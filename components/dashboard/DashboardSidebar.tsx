'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Chat', href: '/chat' },
    { label: 'Projects', href: '/projects' },
    { label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-72 bg-[#f0efeb] border-r border-[#161413] flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Geist Mono, monospace' }}>
          AIBUILDER
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="px-6 mb-6">
        <Link
          href="/chat"
          className="block w-full py-3 bg-[#f27b2f] border-[1.4px] border-black rounded-md text-center font-semibold text-[#161413] hover:bg-[#e06a1f] transition-colors"
          style={{ fontFamily: 'Geist Mono, monospace' }}
        >
          New Chat
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-6 mb-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 mb-1 rounded-md transition-colors ${
              pathname === item.href
                ? 'bg-[#e5e4e0] text-[#161413]'
                : 'text-[#161413] hover:bg-[#e5e4e0]'
            }`}
            style={{ fontFamily: 'Geist Mono, monospace' }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Recent Chats */}
      <div className="px-6 flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
          Recent chats
        </h3>
        <div className="space-y-1">
          {[
            'Landing page redesign',
            'Landing page digital marketing',
            'Dashboard',
            'New dashboard for HR',
          ].map((chat, index) => (
            <button
              key={index}
              className="block w-full text-left px-3 py-2 text-sm text-[#161413] hover:bg-[#e5e4e0] rounded-md transition-colors"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-[#161413] p-4 mt-auto">
        <UserInfoComponent />
      </div>
    </aside>
  );
}

function UserInfoComponent() {
  const { data: session } = useSession();
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || 'U';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex items-center gap-3 px-2">
      <div className="w-11 h-11 rounded-full bg-[#e91e63] flex items-center justify-center text-white font-bold text-2xl" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
        {userInitial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
          {session?.user?.name || 'User Name'}
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="text-xs text-[#161413] hover:opacity-70 transition-opacity"
        style={{ fontFamily: 'Geist, sans-serif' }}
        title="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}
