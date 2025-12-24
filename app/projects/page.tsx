'use client';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f0efeb]">
      <DashboardSidebar />

      <main className="ml-72 min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
          Projects
        </h1>
        <p className="text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
          Your projects will appear here.
        </p>
      </main>
    </div>
  );
}
