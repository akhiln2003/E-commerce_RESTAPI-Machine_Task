import { useState, type FormEvent } from "react";
import type { IProduct, ProductStatus } from "@/@types/interface/IProduct";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useFetchCategoriesQuery,
  useFetchProductsQuery,
  useUpdateProductMutation,
} from "@/services/apis/AdminApis";
import Pagination from "@/components/common/Pagination";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";

interface ProductForm {
  name: string;
  sku: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  status: ProductStatus;
}

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  salePrice: "",
  stock: "",
  categoryId: "",
  status: "active",
};

function ProductManagement() {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const { data: categoriesData } = useFetchCategoriesQuery();
  const { data, isLoading, isError } = useFetchProductsQuery({
    page,
    limit: 5,
  });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      stock: Number(form.stock),
      categoryId: form.categoryId,
      status: form.status,
    };

    try {
      if (editingId) {
        await updateProduct({ productId: editingId, data: payload }).unwrap();
        showSuccessToast({ title: "Product updated" });
      } else {
        await createProduct(payload).unwrap();
        showSuccessToast({ title: "Product created" });
      }
      resetForm();
    } catch (error) {
      showErrorToast({
        title: "Unable to save product",
        description: getErrorMessage(error),
      });
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: String(product.price),
      salePrice: product.salePrice === null ? "" : String(product.salePrice),
      stock: String(product.stock),
      categoryId: product.categoryId,
      status: product.status,
    });
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      showSuccessToast({ title: "Product deleted" });
      setProductToDelete(null);
    } catch (error) {
      showErrorToast({
        title: "Unable to delete product",
        description: getErrorMessage(error),
      });
    }
  };

  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Administration
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Product management
          </h1>
        </div>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit product" : "Create product"}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
            {(
              [
                ["name", "Name", "text"],
                ["sku", "SKU", "text"],
                ["price", "Price", "number"],
                ["salePrice", "Sale price", "number"],
                ["stock", "Stock", "number"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <input
                  required={key !== "salePrice"}
                  type={type}
                  min={type === "number" ? "0" : undefined}
                  step={type === "number" && key !== "stock" ? "0.01" : "1"}
                  value={form[key]}
                  onChange={(event) => updateField(key, event.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Category</span>
              <select
                required
                value={form.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select category</option>
                {categoriesData?.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as ProductStatus)
                }
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Description</span>
              <textarea
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="mt-1 min-h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingId
                    ? "Update product"
                    : "Create product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {isLoading ? (
            <p className="p-8 text-center text-sm text-gray-500">Loading products...</p>
          ) : isError ? (
            <p className="p-8 text-center text-sm text-red-600">
              Unable to load products.
            </p>
          ) : data?.products.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Product", "SKU", "Price", "Stock", "Status", "Actions"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.salePrice ?? product.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4 text-sm capitalize text-gray-600">
                          {product.status}
                        </td>
                        <td className="flex gap-3 px-6 py-4 text-sm">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="font-medium text-gray-700"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(product)}
                            className="font-medium text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <p className="p-8 text-center text-sm text-gray-500">No products found.</p>
          )}
        </section>
      </div>
      <ConfirmationModal
        isOpen={Boolean(productToDelete)}
        title="Delete product?"
        description={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"?`
            : ""
        }
        isConfirming={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setProductToDelete(null)}
      />
    </main>
  );
}

export default ProductManagement;
