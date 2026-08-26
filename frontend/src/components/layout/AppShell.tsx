"use client";

import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function AppShell({ children, title, subtitle, showSearch = true }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#060913] text-[#1E293B] dark:text-[#F8FAFC] flex transition-colors duration-300">
      {/* Shared Sidebar */}
      <AppSidebar 
        mobileOpen={mobileOpen} 
        onCloseMobile={() => setMobileOpen(false)} 
      />

      {/* Main Content Area (Offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ltr:pl-64 lg:ltr:xl:pl-72 lg:rtl:pr-64 lg:rtl:xl:pr-72 transition-all">
        {/* Shared Topbar */}
        <AppTopbar 
          onOpenMobile={() => setMobileOpen(true)} 
          title={title} 
          subtitle={subtitle}
          showSearch={showSearch}
        />

        {/* Page Inner Content */}
        <main className="flex-1 p-4 sm:p-7 lg:p-8 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
