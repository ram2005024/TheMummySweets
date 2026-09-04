import WishlistProductBody from "./components/wishlist-body";
import WishlistHeader from "./components/wishlist-header";

const WishlistPage = () => {
  return (
    <div className="max-w-[80%] min-h-screen  w-full mx-auto space-y-3 pt-10 flex flex-col gap-5">
      <WishlistHeader />
      <WishlistProductBody />
    </div>
  );
};

export default WishlistPage;
