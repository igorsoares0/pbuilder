'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f0efeb] flex items-center justify-center">
      <p className="text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
        Redirecting...
      </p>
    </div>
  );
}
