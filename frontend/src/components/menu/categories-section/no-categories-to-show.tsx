import { PackageX } from "lucide-react";

const NoCategories = () => {
  return (
    <p className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <PackageX className="h-10 w-10 text-muted-foreground mb-2" />
      <span className="text-sm font-medium">No categories found</span>
      <span className="text-xs">Try adding a new one to get started</span>
    </p>
  );
};

export default NoCategories;
