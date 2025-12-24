'use client';

import { ReactNode } from 'react';
import { useUIStore } from '@/store';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main
      className={`
        fixed top-16 bottom-0 right-0 transition-all duration-300 bg-[#f0efeb]
        ${sidebarCollapsed ? 'left-0' : 'left-96'}
      `}
    >
      {children}
    </main>
  );
}
