import type {
  ICategory,
  ICategoryTreeNode,
} from "@/@types/interface/ICategory";

interface CategoryTreeProps {
  nodes: ICategoryTreeNode[];
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
  level?: number;
}

function CategoryTree({
  nodes,
  onEdit,
  onDelete,
  level = 0,
}: CategoryTreeProps) {
  return (
    <ul className={level ? "ml-6 border-l border-gray-200 pl-4" : ""}>
      {nodes.map((category) => (
        <li key={category.id} className="py-2">
          <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2 hover:bg-gray-50">
            <span className="font-medium text-gray-900">{category.name}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(category)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(category)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          {category.children.length > 0 && (
            <CategoryTree
              nodes={category.children}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default CategoryTree;
