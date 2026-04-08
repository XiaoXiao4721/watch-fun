"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function DeleteMovieButton({ movieId }: { movieId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("watched_movies").delete().eq("id", movieId);
    router.push("/movies");
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl text-sm font-semibold transition-colors"
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
    >
      Delete movie
    </button>
  );
}
