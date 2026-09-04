const WishlistSubtitle = ({ count }: { count: number }) => {
  return (
    <p className="mt-1 text-sm text-muted-foreground">
      {count && count > 0
        ? `${count} treats waiting for a warm moment`
        : "Your favorite treats, saved for later"}
    </p>
  );
};

export default WishlistSubtitle;
