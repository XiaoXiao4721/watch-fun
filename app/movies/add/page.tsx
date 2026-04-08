"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

type MovieUrl = {
  name: string;
  url: string;
};

export default function AddMoviePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [watchedAt, setWatchedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState("");
  const [urls, setUrls] = useState<MovieUrl[]>([{ name: "", url: "" }]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function addUrlRow() {
    setUrls([...urls, { name: "", url: "" }]);
  }

  function removeUrlRow(index: number) {
    setUrls(urls.filter((_, i) => i !== index));
  }

  function updateUrl(index: number, field: keyof MovieUrl, value: string) {
    const updated = [...urls];
    updated[index] = { ...updated[index], [field]: value };
    setUrls(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    const cleanUrls = urls.filter((u) => u.name.trim() && u.url.trim());

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase.from("watched_movies").insert({
      user_id: user.id,
      title: title.trim(),
      rating,
      watched_at: new Date(watchedAt).toISOString(),
      urls: cleanUrls,
      notes: notes.trim() || null,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/movies");
  }

  const displayRating = hoverRating || rating;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
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
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Log a Movie</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movie Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="e.g. Inception"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Rating <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= displayRating
                      ? "text-yellow-400"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-3 text-gray-400 text-sm">
                {displayRating > 0 ? `${displayRating}/10` : "Click to rate"}
              </span>
            </div>
          </div>

          {/* Watched At */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Watched On
            </label>
            <input
              type="datetime-local"
              value={watchedAt}
              onChange={(e) => setWatchedAt(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition [color-scheme:dark]"
            />
          </div>

          {/* URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Related Links
            </label>
            <div className="space-y-3">
              {urls.map((link, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => updateUrl(index, "name", e.target.value)}
                    placeholder="Label (e.g. Trailer, IMDb)"
                    className="w-36 flex-shrink-0 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateUrl(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlRow(index)}
                      className="px-3 py-2.5 text-gray-500 hover:text-red-400 transition-colors text-sm"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addUrlRow}
              className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              + Add another link
            </button>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
              placeholder="What did you think? Any memorable scenes?"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
            >
              {loading ? "Saving..." : "Save Movie"}
            </button>
            <Link
              href="/movies"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
