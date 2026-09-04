"use client";
import { useWishlistStore } from "@/store/wishlist.store";
const WishlistHeader = () => {
  const { wishlist_count } = useWishlistStore();
  return (
    <div className="mb-8">
      {/* Title */}
      <h1 className="text-3xl font-serif font-extrabold  tracking-tight">
        Your Wishlist
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {wishlist_count && wishlist_count > 0
          ? `${wishlist_count} treats waiting for a warm moment`
          : "Your favorite treats, saved for later"}
      </p>
    </div>
  );
};

export default WishlistHeader;
