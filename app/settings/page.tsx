'use client';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#f0efeb]">
      <DashboardSidebar />

      <main className="ml-72 min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8 text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
          Settings
        </h1>

        <div className="max-w-4xl space-y-6">
          {/* Account Section */}
          <section className="bg-white border-[1.4px] border-[#161413] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Account
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#161413] mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={session?.user?.name || 'User'}
                  className="w-full px-4 py-2 border-[1.4px] border-[#161413] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f27b2f]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#161413] mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={session?.user?.email || 'user@example.com'}
                  className="w-full px-4 py-2 border-[1.4px] border-[#161413] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f27b2f]"
                  style={{ fontFamily: 'Geist, sans-serif' }}
                />
              </div>

              <button className="px-6 py-2 bg-[#f27b2f] text-white rounded-md hover:opacity-90 transition-opacity font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                Save Changes
              </button>
            </div>
          </section>

          {/* Usage & Billing */}
          <section className="bg-white border-[1.4px] border-[#161413] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Usage & Billing
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f7f7f7] rounded-md border-[1.4px] border-[#161413]">
                <div>
                  <p className="font-semibold text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Current Plan
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Pro Plan - $29/month
                  </p>
                </div>
                <button className="px-4 py-2 border-[1.4px] border-[#161413] rounded-md hover:bg-gray-100 transition-colors font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Upgrade
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-[1.4px] border-[#161413] rounded-md">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Generations This Month
                  </p>
                  <p className="text-2xl font-bold text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
                    127 / 1,000
                  </p>
                </div>
                <div className="p-4 border-[1.4px] border-[#161413] rounded-md">
                  <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Projects Created
                  </p>
                  <p className="text-2xl font-bold text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
                    23
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white border-[1.4px] border-[#161413] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#161413]" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Notifications
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#f27b2f] border-[#161413] rounded focus:ring-[#f27b2f]" />
                <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Email notifications for new features
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#f27b2f] border-[#161413] rounded focus:ring-[#f27b2f]" />
                <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Generation completion alerts
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#f27b2f] border-[#161413] rounded focus:ring-[#f27b2f]" />
                <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Marketing emails
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#f27b2f] border-[#161413] rounded focus:ring-[#f27b2f]" />
                <span className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Billing and usage alerts
                </span>
              </label>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white border-[1.4px] border-red-600 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600" style={{ fontFamily: 'Geist Mono, monospace' }}>
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Delete Account
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Geist, sans-serif' }}>
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium" style={{ fontFamily: 'Geist, sans-serif' }}>
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
