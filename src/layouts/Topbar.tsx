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
  ChevronDown,
  User,
  Settings,
  Shield,
  LogOut,
  Building2,
  Calendar,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Subscribe to notifications tailored for this user
    const unsubscribe = notificationService.subscribe((allNotifs) => {
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
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (result.link && result.link !== '#') {
      navigate(result.link);
    }
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    await notificationService.markAsRead(notif.id);
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(user?.id);
  };

  const handleLogout = () => {
    logout();
    success('Signed Out', 'You have been safely signed out of DAYFLOW.');
    navigate('/login');
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

          {/* Search Dropdown / Auto-suggest */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span>{isSearching ? 'Searching...' : `Found ${searchResults.length} results`}</span>
                <span>ESC to close</span>
              </div>
              
              {searchResults.length === 0 && !isSearching ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No matches found for "{searchQuery}"
                </div>
              ) : (
                <div className="p-1 space-y-1">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleSelectResult(res)}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {res.type === 'employee' && <User className="w-4 h-4" />}
                          {res.type === 'leave_request' && <Calendar className="w-4 h-4" />}
                          {res.type === 'department' && <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {res.title}
                          </p>
                          {res.subtitle && (
                            <p className="text-[10px] text-slate-400">{res.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="neutral" size="xs">
                        {res.type === 'employee' ? 'Staff' : res.type === 'leave_request' ? 'Leave' : 'Dept'}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Right section: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Menu */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className={cn(
              'relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer',
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
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                  <p className="text-[10px] text-slate-400">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    You're all caught up! No notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        'p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start',
                        !n.isRead && 'bg-indigo-50/40'
                      )}
                    >
                      <div className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        n.type === 'success' ? 'bg-emerald-500' :
                        n.type === 'warning' ? 'bg-amber-500' :
                        n.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500',
                        n.isRead && 'opacity-30'
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn('text-xs font-medium text-slate-900 truncate', !n.isRead && 'font-bold')}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                            {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1 rounded-full sm:rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.name || 'User'}
              size="sm"
              status="active"
            />
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Authorized Staff'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge
                  variant={role === 'admin' ? 'purple' : role === 'hr' ? 'primary' : 'neutral'}
                  size="xs"
                >
                  {role ? role.toUpperCase() : 'USER'}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">
                  {user?.employeeId || 'DF-1000'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{user?.email}</p>
                <p className="text-[10px] text-slate-400 mt-1">{user?.department} &bull; {user?.title}</p>
              </div>

              {/* Navigation Items */}
              <div className="p-1 space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(role === 'employee' ? '/employee/dashboard' : '/admin/dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Personal Workspace</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Preferences & Settings</span>
                </button>

                {role !== 'employee' && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate('/admin/dashboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span>Admin Control Center</span>
                  </button>
                )}
              </div>

              {/* Sign Out Action */}
              <div className="p-1 pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left text-xs cursor-pointer"
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
