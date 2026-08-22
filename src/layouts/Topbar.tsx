import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  LogOut,
  Building2,
  Calendar,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { cn } from '../utils/cn';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Subscribe to notifications tailored for this user
    const unsubscribe = notificationService.subscribe((allNotifs) => {
      const userNotifs = allNotifs.filter((n) => !n.userId || n.userId === user?.id);
      setNotifications(userNotifs);
    });
    return unsubscribe;
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
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
    <header className="h-18 bg-white/95 dark:bg-[#0a0f1e]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-indigo-500/20 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs dark:shadow-lg dark:shadow-black/40">
      {/* Left section: Hamburger & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block" ref={searchRef}>
          <Search className="w-4 h-4 text-slate-400 dark:text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
            }}
            placeholder="Search employees, departments, leave (Ctrl + K)..."
            className="w-full bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-500/30 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl pl-9 pr-12 py-2 transition-all focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-indigo-600 dark:focus:border-cyan-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-cyan-500/20 shadow-2xs"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded pointer-events-none">
            ⌘K
          </kbd>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-indigo-500/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-medium text-slate-400">
                <span className="text-indigo-600 dark:text-cyan-400 font-semibold">{isSearching ? 'Searching...' : `Found ${searchResults.length} results`}</span>
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
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-cyan-400">
                          {res.type === 'employee' && <User className="w-4 h-4" />}
                          {res.type === 'leave_request' && <Calendar className="w-4 h-4" />}
                          {res.type === 'department' && <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                            {res.title}
                          </p>
                          {res.subtitle && <p className="text-[10px] text-slate-400">{res.subtitle}</p>}
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

      {/* Right section: Theme Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Theme Switcher Button */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setIsThemeMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Theme: ${theme}`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Laptop className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setTheme('light');
                  setIsThemeMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer',
                  theme === 'light'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                onClick={() => {
                  setTheme('dark');
                  setIsThemeMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer',
                  theme === 'dark'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </button>

              <button
                onClick={() => {
                  setTheme('system');
                  setIsThemeMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer',
                  theme === 'system'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-cyan-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                <Laptop className="w-3.5 h-3.5 text-slate-400" />
                <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Menu */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className={cn(
              'relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer',
              isNotificationsOpen && 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
            )}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-indigo-500/30 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h4>
                  <p className="text-[10px] text-slate-400">
                    {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-600 dark:text-cyan-400 font-semibold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
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
                        'p-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer flex gap-3 items-start',
                        !n.isRead && 'bg-indigo-50/50 dark:bg-indigo-950/30'
                      )}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          n.type === 'success'
                            ? 'bg-emerald-500'
                            : n.type === 'warning'
                            ? 'bg-amber-500'
                            : n.type === 'error'
                            ? 'bg-rose-500'
                            : 'bg-indigo-500',
                          n.isRead && 'opacity-30'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={cn('text-xs font-semibold text-slate-900 dark:text-slate-200 truncate', !n.isRead && 'font-bold')}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name || 'Eleanor Vance'}</p>
              <p className="text-[10px] text-slate-400 dark:text-cyan-400 font-medium">
                {user?.role === 'admin' ? 'HR Specialist' : 'Engineer'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'Eleanor Vance'}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">{user?.email || 'hr@dayflow.com'}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-cyan-500/10 dark:text-cyan-300 font-bold uppercase">
                    {user?.role === 'admin' ? 'HR / Admin' : 'Employee'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{user?.employeeId || 'DF-1001'}</span>
                </div>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(role === 'admin' ? '/admin/settings' : '/employee/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  <span>My Profile Dossier</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(role === 'admin' ? '/admin/settings' : '/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="p-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer font-semibold"
                >
                  <LogOut className="w-4 h-4" />
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
