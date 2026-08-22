import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { notificationService } from '../services/notificationService';
import { searchService, type SearchResult } from '../services/searchService';
import type { AppNotification } from '../types/notification';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Subscribe to notifications tailored for this user
    const unsubscribe = notificationService.subscribe((allNotifs) => {
      // Filter if necessary, but we'll let service handle filtering or just filter here
      const userNotifs = allNotifs.filter(n => !n.userId || n.userId === user?.id);
      setNotifications(userNotifs);
    });
    return unsubscribe;
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform global search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        const results = await searchService.globalSearch(searchQuery, role || undefined);
        setSearchResults(results);
        setIsSearching(false);
        setIsSearchOpen(true);
      } else {
        setSearchResults([]);
        setIsSearchOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, role]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    logout();
    success('Logged Out', 'You have been safely signed out from DAYFLOW.');
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left section: Hamburger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block" ref={searchRef}>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.trim().length >= 2) setIsSearchOpen(true); }}
            placeholder="Search employees, departments, leave (Ctrl + K)..."
            className="w-full bg-slate-50/90 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl pl-9 pr-12 py-2 transition-all focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-3xs pointer-events-none">
            ⌘K
          </kbd>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-500">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {/* Grouped Results */}
                  {['employee', 'leave_request', 'department'].map((type) => {
                    const typedResults = searchResults.filter(r => r.type === type);
                    if (typedResults.length === 0) return null;
                    
                    const typeLabels = {
                      'employee': 'Employees',
                      'leave_request': 'Leave Requests',
                      'department': 'Departments'
                    };

                    return (
                      <div key={type} className="mb-2">
                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                          {typeLabels[type as keyof typeof typeLabels]}
                        </div>
                        {typedResults.map(result => (
                          <button
                            key={result.id}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 focus:bg-slate-50 outline-none transition-colors"
                            onClick={() => {
                              if (result.link !== '#') {
                                navigate(result.link);
                                setIsSearchOpen(false);
                                setSearchQuery('');
                              }
                            }}
                          >
                            <div className="text-xs font-semibold text-slate-900">{result.title}</div>
                            {result.subtitle && <div className="text-[11px] text-slate-500">{result.subtitle}</div>}
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">No results found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Right section: Action Buttons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Role Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-indigo-600" />
          <span>Role: {role ? role.toUpperCase() : 'USER'}</span>
          {user?.employeeId && (
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
              {user.employeeId}
            </span>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => {
              setIsHelpOpen((prev) => !prev);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className={cn(
              'p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors',
              isHelpOpen && 'bg-slate-100 text-slate-800'
            )}
            title="Help & Guides"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {isHelpOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Dayflow Assistance</h4>
                <p className="text-xs text-slate-500 mt-0.5">Workplace guides & knowledge base</p>
              </div>
              <div className="p-2 space-y-1 text-xs">
                <a
                  href="#getting-started"
                  onClick={(e) => {
                    e.preventDefault();
                    info('Help Guide', 'Opening onboarding and workflow tutorials.');
                    setIsHelpOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Onboarding & Quick Start</span>
                </a>
                <a
                  href="#support"
                  onClick={(e) => {
                    e.preventDefault();
                    info('HR Support', 'Dayflow internal support ticketing channel.');
                    setIsHelpOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Contact HR Operations</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Menu */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsHelpOpen(false);
              setIsProfileOpen(false);
            }}
            className={cn(
              'relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors',
              isNotificationsOpen && 'bg-slate-100 text-slate-800'
            )}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2.5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="primary" size="xs">{unreadCount} New</Badge>
                  )}
                </div>
                <button
                  onClick={() => {
                    notificationService.markAllAsRead(user?.id);
                    success('All marked as read', 'Your notifications inbox is up to date.');
                  }}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 px-2 py-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-2.5 rounded-xl transition-colors cursor-pointer",
                        notif.isRead ? "hover:bg-slate-50" : "bg-indigo-50/50 hover:bg-indigo-50"
                      )}
                      onClick={() => {
                        notificationService.markAsRead(notif.id);
                        info(notif.title, notif.message);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-xs", notif.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900")}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
              setIsHelpOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.name || 'User'}
              size="sm"
              status="active"
              ring
            />
            <div className="text-left hidden md:block leading-tight">
              <p className="text-xs font-bold text-slate-900 truncate max-w-32">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate max-w-32">{user?.title || 'Team Member'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant="primary" size="xs">
                    {user?.role.toUpperCase()}
                  </Badge>
                  <Badge variant="neutral" size="xs">
                    {user?.department}
                  </Badge>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5 text-xs">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings & Preferences
                  </button>
              </div>

              <div className="p-1.5 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
