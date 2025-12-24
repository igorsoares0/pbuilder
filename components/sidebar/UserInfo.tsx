'use client';

import { useSession, signOut } from 'next-auth/react';

export function UserInfo() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="border-t border-[#161413] p-4 bg-[#f0efeb]">
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
    </div>
  );
}
