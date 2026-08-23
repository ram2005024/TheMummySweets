import { useGetMenuProducts } from "@/hooks/menu/useMenuItems";

const HeadingSection = () => {
  const { data: products } = useGetMenuProducts();
  return (
    <section className="bg-[#fff8ed]">
      <div className="sm:max-w-[80%] w-full mx-auto  py-10">
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
            Showing {products?.meta.limit} of {products?.meta.total} products.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeadingSection;
