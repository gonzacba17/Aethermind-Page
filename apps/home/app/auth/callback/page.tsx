'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { saveToken } from '@/lib/auth-utils';
import { redirectAfterAuth } from '@/lib/auth-utils';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions in React StrictMode or fast navigation
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // OAuth failed, redirect to login with error
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Save token and redirect based on membership
      saveToken(token);
      redirectAfterAuth();
    } else {
      // No token, go back to login
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <h2 className="text-white text-xl font-medium">Authenticating...</h2>
        <p className="text-zinc-400 mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
