"use client";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full rounded-lg border border-red-200 bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Something went wrong
        </h2>
        <pre className="text-sm text-red-500 mb-4 whitespace-pre-wrap">
          {String(error?.message ?? error)}
        </pre>
        <button
          onClick={reset}
          className="w-full rounded-md bg-red-500 px-4 py-2 text-white font-medium hover:bg-red-600 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
