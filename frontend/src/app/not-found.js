import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>

      <p className="mt-4 text-lg text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-700"
      >
        Go back home
      </Link>
    </div>
  );
}
