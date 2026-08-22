import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../assets/Logo';
import { NAVIGATION_SECTIONS } from '../data/mockNavigation';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { role } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
          <Logo size="md" showTagline={false} />
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {NAVIGATION_SECTIONS.map((section) => {
            // Filter items based on user role permissions
            const visibleItems = section.items.filter(
              (item) => !item.requiredRole || item.requiredRole.includes(role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  {section.title}
                </p>

                <div className="pt-1.5 space-y-0.5">
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
                            'group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 select-none',
                            isActive
                              ? 'bg-indigo-50/90 text-indigo-700 font-semibold shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          )
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={cn(
                              'w-5 h-5 transition-colors shrink-0',
                              isActive
                                ? 'text-indigo-600'
                                : 'text-slate-400 group-hover:text-slate-600'
                            )}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.badge && (
                            <Badge
                              variant={item.badgeVariant || 'neutral'}
                              size="xs"
                              className={isActive ? 'bg-indigo-100 text-indigo-800' : ''}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {isActive && (
                            <ChevronRight className="w-4 h-4 text-indigo-500 ml-0.5" />
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

        {/* Workspace Footer Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>
              <p className="text-xs font-bold text-slate-800 truncate">Dayflow Enterprise</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="System Operational" />
          </div>
        </div>
      </aside>
    </>
  );
};
