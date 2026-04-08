import { login } from "./actions";
import Link from "next/link";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl">
            🎬
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-1">Welcome back</h1>
          <p className="text-gray-400">Sign in to your Watch Fun account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <AsyncMessages searchParams={searchParams} />

          <form action={login} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors mt-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

async function AsyncMessages({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  if (params.error) {
    return (
      <div className="mb-5 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
        {params.error}
      </div>
    );
  }
  if (params.message) {
    return (
      <div className="mb-5 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-sm">
        {params.message}
      </div>
    );
  }
  return null;
}
