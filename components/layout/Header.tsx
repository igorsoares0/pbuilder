'use client';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#f0efeb] border-b border-[#161413] z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold tracking-tight" style={{ fontFamily: 'Geist Mono, monospace' }}>
            AIBUILDER
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button className="text-xs font-medium text-[#161413] hover:opacity-70 transition-opacity" style={{ fontFamily: 'Geist, sans-serif' }}>
            COLLECTIVE
          </button>
          <button className="text-xs font-medium text-[#161413] hover:opacity-70 transition-opacity" style={{ fontFamily: 'Geist, sans-serif' }}>
            ENTERPRISE
          </button>
          <button className="text-xs font-medium text-[#161413] hover:opacity-70 transition-opacity" style={{ fontFamily: 'Geist, sans-serif' }}>
            PRICING
          </button>
          <button className="text-xs font-semibold text-[#161413] hover:opacity-70 transition-opacity" style={{ fontFamily: 'Geist, sans-serif' }}>
            SIGN IN
          </button>
        </div>
      </div>
    </header>
  );
}
