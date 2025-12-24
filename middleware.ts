export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/projects/:path*',
    '/settings/:path*',
  ],
};
