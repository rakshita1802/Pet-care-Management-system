"use client";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        Something went wrong
      </h1>

      <p className="mt-3 text-gray-600 max-w-md">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-red-600 px-6 py-2 text-white font-medium hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
