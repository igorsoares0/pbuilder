'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      toast.error('OAuth sign in failed');
      console.error('OAuth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0efeb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Geist Mono, monospace' }}>
            AIBUILDER
          </h1>
          <p className="text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border-[1.4px] border-[#161413] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#161413] mb-2"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f7f7f7] border-[1.4px] border-[#161413] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f27b2f]"
                style={{ fontFamily: 'Geist Mono, monospace' }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#161413] mb-2"
                style={{ fontFamily: 'Geist, sans-serif' }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#f7f7f7] border-[1.4px] border-[#161413] rounded-md focus:outline-none focus:ring-2 focus:ring-[#f27b2f]"
                style={{ fontFamily: 'Geist Mono, monospace' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#f27b2f] border-[1.4px] border-black rounded-md font-semibold text-[#161413] hover:bg-[#e06a1f] transition-colors disabled:opacity-50"
              style={{ fontFamily: 'Geist Mono, monospace' }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#161413]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="px-4 py-3 bg-white border-[1.4px] border-[#161413] rounded-md font-medium text-sm text-[#161413] hover:bg-[#f7f7f7] transition-colors"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              className="px-4 py-3 bg-white border-[1.4px] border-[#161413] rounded-md font-medium text-sm text-[#161413] hover:bg-[#f7f7f7] transition-colors"
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              GitHub
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[#161413]" style={{ fontFamily: 'Geist, sans-serif' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-[#f27b2f] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
