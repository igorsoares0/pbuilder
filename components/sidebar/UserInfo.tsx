'use client';

export function UserInfo() {
  return (
    <div className="border-t border-[#161413] p-4 bg-[#f0efeb]">
      <div className="flex items-center gap-3 px-2">
        <div className="w-11 h-11 rounded-full bg-[#e91e63] flex items-center justify-center text-white font-bold text-2xl" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
          U
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
            User Name
          </div>
        </div>
      </div>
    </div>
  );
}
