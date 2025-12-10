import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white">Check your email</h1>
        <p className="text-zinc-400">
          We&apos;ve sent you a verification link to confirm your email address.
        </p>
        
        <Link href="/login" className="inline-block text-white hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  )
}
