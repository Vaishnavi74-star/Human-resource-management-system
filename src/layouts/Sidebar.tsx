import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../assets/Logo';
import { NAVIGATION_SECTIONS } from '../data/mockNavigation';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { X, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { role, user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 dark:bg-[#0a0f1e]/95 backdrop-blur-md border-r border-slate-200/90 dark:border-indigo-500/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm dark:shadow-2xl dark:shadow-black/50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-indigo-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <Logo size="md" showTagline={false} />
            <div className="text-left">
              <span className="text-sm font-black tracking-wider text-slate-900 dark:text-white font-['Plus_Jakarta_Sans',sans-serif]">DAYFLOW</span>
              <span className="text-[9px] block font-mono text-indigo-600 dark:text-cyan-400 tracking-widest uppercase font-bold">WORKSPACE OS</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAVIGATION_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.requiredRole || (role && item.requiredRole.includes(role))
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase select-none">
                  {section.title}
                </p>

                <div className="pt-1.5 space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 select-none cursor-pointer',
                            isActive
                              ? 'bg-linear-to-r from-indigo-50 to-indigo-50/40 text-indigo-700 font-bold border-l-3 border-indigo-600 shadow-2xs dark:from-indigo-950/70 dark:to-cyan-950/40 dark:text-cyan-300 dark:border-cyan-400'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 hover:translate-x-0.5'
                          )
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={cn(
                              'w-4 h-4 transition-colors shrink-0',
                              isActive
                                ? 'text-indigo-600 dark:text-cyan-400'
                                : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-cyan-400'
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant || 'neutral'}
                              size="xs"
                              className={isActive ? 'bg-indigo-100 text-indigo-800 dark:bg-cyan-500/20 dark:text-cyan-300' : ''}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 ml-0.5" />
                          )}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Workspace Footer Connected Status */}
        <div className="p-4 border-t border-slate-100 dark:border-indigo-500/20 bg-slate-50/50 dark:bg-slate-950/60 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/80 dark:border-indigo-500/20 shadow-2xs flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 dark:text-cyan-400 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-indigo-500 dark:text-cyan-400" />
                <span>{user?.role === 'admin' || user?.role === 'hr' ? 'HR Console' : 'Employee Portal'}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                {user?.name || 'Dayflow Workplace'}
              </p>
            </div>
            <span className="relative flex h-2.5 w-2.5 shrink-0" title="Connected">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
