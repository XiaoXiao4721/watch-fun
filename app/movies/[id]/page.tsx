import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import Link from "next/link";
import DeleteMovieButton from "./DeleteMovieButton";

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
  created_at: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={`text-xl ${i < rating ? "text-yellow-400" : "text-gray-700"}`}
        >
          ★
        </span>
      ))}
      <span className="text-gray-300 text-lg font-semibold ml-2">
        {rating}/10
      </span>
    </div>
  );
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: movie } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("id", id)
    .single();

  if (!movie) notFound();

  const m = movie as Movie;
  const watchedDate = new Date(m.watched_at);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/movies"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back
            </Link>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Watch Fun
              </span>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 leading-tight">{m.title}</h1>

          {/* Rating */}
          <div className="mb-6">
            <StarRating rating={m.rating} />
          </div>

          {/* Watched date */}
          <div className="mb-6 text-gray-400">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Watched
            </span>
            <p className="mt-1 text-white">
              {watchedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {watchedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Notes */}
          {m.notes && (
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Notes
              </span>
              <p className="mt-2 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {m.notes}
              </p>
            </div>
          )}

          {/* URLs */}
          {m.urls && m.urls.length > 0 && (
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Links
              </span>
              <div className="mt-3 flex flex-col gap-3">
                {m.urls.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 transition-colors group"
                  >
                    <span className="font-medium">{link.name}</span>
                    <span className="text-purple-500 group-hover:text-purple-300 transition-colors text-xs flex-1 truncate">
                      {link.url}
                    </span>
                    <span className="text-purple-500">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Added date */}
          <div className="pt-4 border-t border-white/10 text-sm text-gray-600">
            Added on{" "}
            {new Date(m.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Delete */}
        <div className="mt-6 flex justify-end">
          <DeleteMovieButton movieId={m.id} />
        </div>
      </main>
    </div>
  );
}
