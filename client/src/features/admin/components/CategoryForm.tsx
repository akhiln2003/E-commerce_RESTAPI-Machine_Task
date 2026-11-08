import type { FormEvent } from "react";
import type { ICategory } from "@/@types/interface/ICategory";

export interface CategoryFormValues {
  name: string;
  parentId: string;
}

interface CategoryFormProps {
  values: CategoryFormValues;
  categories: ICategory[];
  isEditing: boolean;
  isSaving: boolean;
  onChange: (values: CategoryFormValues) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

function CategoryForm({
  values,
  categories,
  isEditing,
  isSaving,
  onChange,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">
        {isEditing ? "Edit category" : "Create category"}
      </h2>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <input
            required
            maxLength={100}
            value={values.name}
            onChange={(event) =>
              onChange({ ...values, name: event.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Parent category
          </span>
          <select
            value={values.parentId}
            onChange={(event) =>
              onChange({ ...values, parentId: event.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
          >
            <option value="">No parent (top-level)</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : isEditing
                ? "Update category"
                : "Create category"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default CategoryForm;
