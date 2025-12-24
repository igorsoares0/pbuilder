'use client';

import { ReactNode } from 'react';
import { useUIStore } from '@/store';

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <aside
      className={`
        fixed top-16 left-0 bottom-0 bg-[#f0efeb] border-r border-[#161413]
        transition-all duration-300 z-30
        ${sidebarCollapsed ? 'w-0' : 'w-96'}
      `}
    >
      <div className={`h-full ${sidebarCollapsed ? 'hidden' : 'flex flex-col'}`}>
        {children}
      </div>
    </aside>
  );
}
