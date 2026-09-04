import { useGetWishlistProducts } from "@/hooks/menu/useMenuItems";
import { useWishlistStore } from "@/store/wishlist.store";
import { useEffect } from "react";
import { LuHeart } from "react-icons/lu";

const WishlistButton = () => {
  const { data, isPending } = useGetWishlistProducts();
  const { setWishlistCount, wishlist_count } = useWishlistStore();
  useEffect(() => {
    const hasData = data?.pages[0].products.meta.total;
    if (hasData) {
      setWishlistCount(hasData);
    }
  }, [data?.pages, isPending, setWishlistCount]);
  if (isPending) return null;
  return (
    <button
      type="button"
      aria-label="Wishlist"
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center text-[#554941] transition-all hover:text-[#e95d48]"
    >
      <LuHeart size={20} strokeWidth={1.7} />

      <span className="absolute right-[1px] top-0 flex h-[13px] min-w-[13px] items-center justify-center rounded-full bg-[#e95d48] px-1 text-[7px] font-bold text-white">
        {wishlist_count}
      </span>
    </button>
  );
};

export default WishlistButton;
