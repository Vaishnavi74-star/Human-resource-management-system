import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#080c18] text-slate-900 dark:text-slate-100 flex relative overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Subtle Ambient Mesh Grid & Glow Flares */}
      <div className="absolute inset-0 bg-cyber-grid dark:bg-cyber-grid-dark opacity-60 dark:opacity-30 pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-cyan-200/25 dark:bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Responsive Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300 relative z-10">
        {/* Sticky Topbar */}
        <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        {/* Main Scrollable Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
