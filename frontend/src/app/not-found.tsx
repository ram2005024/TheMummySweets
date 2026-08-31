"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 text-center">
      <p className="text-sm font-medium tracking-widest text-orange-500">404</p>

      <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
        Page not found
      </h1>

      <p className="mt-3 max-w-sm text-neutral-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>

        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
