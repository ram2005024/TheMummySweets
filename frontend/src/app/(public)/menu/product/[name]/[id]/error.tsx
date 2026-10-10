"use client";

import { APIError } from "@/libs/error_class";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const message =
    error instanceof APIError
      ? `${error.message} (status: ${error.status_code}, code: ${error.error_code ?? "N/A"})`
      : error.message;

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div
        className="max-w-md w-full rounded-lg border border-red-200 bg-white p-6 shadow-md"
        aria-live="polite"
      >
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Something went wrong
        </h2>

        <p className="text-sm text-red-500 mb-4 whitespace-pre-wrap">
          {message}
        </p>

        {error.digest && (
          <p className="text-xs text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}

        <button
          onClick={reset}
          className="w-full rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
