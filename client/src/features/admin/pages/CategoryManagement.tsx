import { useMemo, useState, type FormEvent } from "react";
import type { ICategory } from "@/@types/interface/ICategory";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useFetchCategoryTreeQuery,
  useUpdateCategoryMutation,
} from "@/services/apis/AdminApis";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";
import CategoryForm, {
  type CategoryFormValues,
} from "../components/CategoryForm";
import CategoryHierarchy from "../components/CategoryHierarchy";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const emptyForm: CategoryFormValues = { name: "", parentId: "" };

function CategoryManagement() {
  const [form, setForm] = useState<CategoryFormValues>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null,
  );
  const {
    data: treeData,
    isLoading: isTreeLoading,
    isError: isTreeError,
  } = useFetchCategoryTreeQuery();
  const { data: listData } = useFetchCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const selectableCategories = useMemo(
    () =>
      (listData?.categories ?? []).filter(
        (category) => category.id !== editingId,
      ),
    [listData?.categories, editingId],
  );
  const isSaving = isCreating || isUpdating;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      name: form.name,
      parentId: form.parentId || null,
    };

    try {
      if (editingId) {
        await updateCategory({ categoryId: editingId, data }).unwrap();
        showSuccessToast({ title: "Category updated" });
      } else {
        await createCategory(data).unwrap();
        showSuccessToast({ title: "Category created" });
      }
      resetForm();
    } catch (error) {
      showErrorToast({
        title: "Unable to save category",
        description: getErrorMessage(error),
      });
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingId(category.id);
    setForm({ name: category.name, parentId: category.parentId ?? "" });
  };

  const handleDelete = (category: ICategory) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      showSuccessToast({ title: "Category deleted" });
      if (editingId === categoryToDelete.id) {
        resetForm();
      }
      setCategoryToDelete(null);
    } catch (error) {
      showErrorToast({
        title: "Unable to delete category",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Category management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create and organize categories at any nesting depth.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <CategoryForm
            values={form}
            categories={selectableCategories}
            isEditing={Boolean(editingId)}
            isSaving={isSaving}
            onChange={setForm}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
          <CategoryHierarchy
            categories={treeData?.categories}
            isLoading={isTreeLoading}
            isError={isTreeError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={Boolean(categoryToDelete)}
        title="Delete category?"
        description={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? Categories with children cannot be deleted.`
            : ""
        }
        isConfirming={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setCategoryToDelete(null)}
      />
    </main>
  );
}

export default CategoryManagement;
