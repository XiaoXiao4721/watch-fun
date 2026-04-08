import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
        <p className="text-gray-400 mb-6">
          This movie doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/movies"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-colors"
        >
          Back to My Movies
        </Link>
      </div>
    </div>
  );
}
