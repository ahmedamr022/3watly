"use client";

import React, { useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  /** When true, the main area fills the viewport height without scrolling —
   *  children are responsible for their own independent scroll panes.
   *  Use this only for the CV Builder split-scroll layout. */
  fullHeight?: boolean;
}

export function AppShell({ children, title, subtitle, showSearch = true, fullHeight = false }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('majra-sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('majra-sidebar-collapsed', String(next));
      return next;
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#F8FAFC] dark:bg-[#040816] text-[#1E293B] dark:text-[#F8FAFC] flex transition-colors duration-300">
      
      {/* Dynamic Background Graphics */}
      <div 
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 bg-[url('/backgrounds/dashboard-light.png')] dark:bg-[url('/backgrounds/dashboard-dark.png')] opacity-100 dark:opacity-90"
      />

      {/* Shared Collapsible Sidebar */}
      <AppSidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area */}
      <div className={`relative z-10 flex-1 flex flex-col h-full min-w-0 ${
        isCollapsed ? 'lg:ltr:pl-20 lg:rtl:pr-20' : 'lg:ltr:pl-64 lg:rtl:pr-64'
      } transition-all duration-300`}>
        {/* Shared Topbar */}
        <AppTopbar 
          onOpenMobile={() => setMobileOpen(true)} 
          title={title} 
          subtitle={subtitle}
          showSearch={showSearch}
        />

        {/* Page Inner Content */}
        {fullHeight ? (
          // Split-scroll mode: main fills remaining height, children manage their own scroll
          <main className="flex-1 min-h-0 overflow-hidden p-4 sm:p-7 lg:p-8 w-full flex flex-col">
            {children}
          </main>
        ) : (
          // Normal mode: full-page scroll
          <main className="flex-1 overflow-y-auto p-4 sm:p-7 lg:p-8 max-w-[1500px] w-full mx-auto">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
