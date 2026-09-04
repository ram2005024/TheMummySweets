"use client";

import { PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const NoWishlistItems = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <PackageOpen className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold">Your wishlist is empty</h2>

      {/* Subtitle */}
      <p className="max-w-sm text-sm text-muted-foreground">
        Save your favorite treats here and come back when you’re ready to enjoy
        them.
      </p>

      {/* Action */}
      <button
        onClick={() => router.push("/menu")}
        className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Browse Products
      </button>
    </div>
  );
};

export default NoWishlistItems;
