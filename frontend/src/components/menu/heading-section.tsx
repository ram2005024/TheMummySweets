import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";

const HeadingSection = () => {
  const { data } = useGetMenuProducts();

  // flatten products
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  // meta info (from first page)
  const meta = data?.pages[0]?.meta;

  return (
    <section className="bg-[#fff8ed]">
      <div className="sm:max-w-[80%] w-full mx-auto py-10">
        <div className="max-w-3xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8832a]">
            The Menu
          </p>

          <div className="flex items-center gap-3">
            <h1 className="text-[48px] font-serif font-bold leading-[1.05] tracking-[-0.035em] text-[#2b150c]">
              Everything, fresh today
            </h1>
          </div>

          <p className="mt-7 text-[15px] font-light text-[#544f4c]">
            Showing {products.length} of {meta?.total ?? 0} products.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeadingSection;
