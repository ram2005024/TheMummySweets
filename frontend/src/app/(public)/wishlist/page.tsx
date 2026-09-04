"use client";
import WishlistProductBody from "./components/wishlist-body";
import WishListCategoryAndFilter from "./components/wishlist-category-section";

import WishlistHeader from "./components/wishlist-header";

const WishlistPage = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      <WishlistHeader />
      <WishListCategoryAndFilter />
      <WishlistProductBody />
    </div>
  );
};

export default WishlistPage;
