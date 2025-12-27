'use client';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#f0efeb] border-b border-[#161413] z-40">
      <div className="h-full px-6 flex items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Geist Mono, monospace' }}>
            AIBUILDER
          </div>
        </div>
      </div>
    </header>
  );
}
