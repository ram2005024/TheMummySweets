"use client";

const IngredientDetails = ({ ingredients }: { ingredients: string[] }) => {
  return (
    <div className="rounded-xl bg-card w-fit p-4 space-y-4 shadow-sm">
      {/* Heading */}
      <h3 className=" font-semibold text-sm text-gray-500 tracking-tight">
        INGREDIENTS
      </h3>

      {/* Ingredient Pills */}
      <div className="flex flex-wrap gap-2">
        {ingredients.map((item) => (
          <span
            key={item}
            className="rounded-full bg-muted px-4 py-1.5 text-[10px] font-medium text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IngredientDetails;
