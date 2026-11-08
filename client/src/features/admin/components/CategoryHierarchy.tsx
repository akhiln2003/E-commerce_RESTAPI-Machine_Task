import type {
  ICategory,
  ICategoryTreeNode,
} from "@/@types/interface/ICategory";
import CategoryTree from "./CategoryTree";

interface CategoryHierarchyProps {
  categories: ICategoryTreeNode[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
}

function CategoryHierarchy({
  categories,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: CategoryHierarchyProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        Category hierarchy
      </h2>
      {isLoading ? (
        <p className="py-8 text-sm text-gray-500">Loading categories...</p>
      ) : isError ? (
        <p className="py-8 text-sm text-red-600">
          Unable to load the category hierarchy.
        </p>
      ) : categories?.length ? (
        <div className="mt-4">
          <CategoryTree
            nodes={categories}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ) : (
        <p className="py-8 text-sm text-gray-500">
          No categories have been created yet.
        </p>
      )}
    </section>
  );
}

export default CategoryHierarchy;
