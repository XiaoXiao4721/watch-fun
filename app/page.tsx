import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/movies");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Watch Fun
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Your personal movie journal. Track what you&apos;ve watched, rate it,
          and save your favorite links.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors border border-white/20"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
