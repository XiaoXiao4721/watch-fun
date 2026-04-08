import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";

type MovieUrl = {
  name: string;
  url: string;
};

type Movie = {
  id: string;
  title: string;
  rating: number;
  watched_at: string;
  urls: MovieUrl[];
  notes: string | null;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-600"}`}
        >
          ★
        </span>
      ))}
      <span className="text-gray-400 text-sm ml-1">{rating}/10</span>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const watchedDate = new Date(movie.watched_at);
  const dateStr = watchedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = watchedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h2 className="text-xl font-semibold text-white leading-snug">
          {movie.title}
        </h2>
        <Link
          href={`/movies/${movie.id}`}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors shrink-0 mt-1"
        >
          View →
        </Link>
      </div>

      <StarRating rating={movie.rating} />

      <div className="mt-3 text-sm text-gray-400">
        Watched on {dateStr} at {timeStr}
      </div>

      {movie.notes && (
        <p className="mt-3 text-sm text-gray-400 line-clamp-2">{movie.notes}</p>
      )}

      {movie.urls && movie.urls.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {movie.urls.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-full transition-colors"
            >
              {link.name} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function MoviesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: movies, error } = await supabase
    .from("watched_movies")
    .select("*")
    .order("watched_at", { ascending: false });

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Watch Fun
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">
              {user?.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Watched Movies</h1>
            <p className="text-gray-400 mt-1">
              {movies?.length ?? 0} movie{movies?.length !== 1 ? "s" : ""} logged
            </p>
          </div>
          <Link
            href="/movies/add"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors text-sm"
          >
            + Add Movie
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm mb-6">
            Failed to load movies: {error.message}
          </div>
        )}

        {!movies || movies.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍿</div>
            <h2 className="text-xl font-semibold mb-2">No movies yet</h2>
            <p className="text-gray-400 mb-6">
              Start by logging the first movie you&apos;ve watched!
            </p>
            <Link
              href="/movies/add"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors"
            >
              Add Your First Movie
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie as Movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
