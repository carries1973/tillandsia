import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on everything except static assets & images — and skip the public
  // /trip app entirely so it never touches Supabase auth (keeps it loading even
  // if the Supabase backend is unreachable).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/|trip|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)'],
};
