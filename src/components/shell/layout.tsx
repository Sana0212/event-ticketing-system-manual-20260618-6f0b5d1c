'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

interface ShellLayoutProps {
  children: React.ReactNode;
}

export default function ShellLayout({ children }: ShellLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Bar */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dynamic Content Frame */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
