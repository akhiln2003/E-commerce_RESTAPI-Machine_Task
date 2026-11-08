import { useMemo, useState } from "react";
import type { ICategoryTreeNode } from "@/@types/interface/ICategory";
import type { ICartItem } from "@/@types/interface/IOrder";
import {
  useCreateOrderMutation,
  useFetchCategoryTreeQuery,
  useFetchProductsQuery,
} from "@/services/apis/UserApis";
import Pagination from "@/components/common/Pagination";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/ToastProvider/toast";

type ProductSort =
  | "newest"
  | "priceAsc"
  | "priceDesc"
  | "nameAsc"
  | "nameDesc";

interface ProductFilters {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  sort: ProductSort;
}

const initialFilters: ProductFilters = {
  search: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
};

function flattenCategories(
  nodes: ICategoryTreeNode[],
  level = 0,
): { id: string; label: string }[] {
  return nodes.flatMap((node) => [
    { id: node.id, label: `${"— ".repeat(level)}${node.name}` },
    ...flattenCategories(node.children, level + 1),
  ]);
}

function Products() {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [page, setPage] = useState(1);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  const { data: categoryData } = useFetchCategoryTreeQuery();
  const { data, isLoading, isFetching, isError } = useFetchProductsQuery({
    page,
    limit: 5,
    search: filters.search || undefined,
    categoryId: filters.categoryId || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    sort: filters.sort,
  });
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const categories = useMemo(
    () => flattenCategories(categoryData?.categories ?? []),
    [categoryData?.categories],
  );
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const applyFilters = () => {
    setPage(1);
    setFilters(draftFilters);
  };

  const addToCart = (product: ICartItem) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.productId);
      if (existing) {
        return current.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item,
        );
      }
      return [...current, product];
    });
  };

  const changeQuantity = (productId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(Math.max(quantity, 0), item.stock) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const placeOrder = async () => {
    if (!cart.length) return;
    try {
      await createOrder({
        items: cart.map(({ productId, quantity }) => ({ productId, quantity })),
      }).unwrap();
      setCart([]);
      showSuccessToast({ title: "Order placed successfully" });
    } catch (error) {
      showErrorToast({
        title: "Unable to place order",
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Search, filter, and add products to your order.
          </p>
        </div>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters({ ...draftFilters, search: event.target.value })
              }
              placeholder="Search products..."
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={draftFilters.categoryId}
              onChange={(event) =>
                setDraftFilters({ ...draftFilters, categoryId: event.target.value })
              }
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={draftFilters.minPrice}
              onChange={(event) =>
                setDraftFilters({ ...draftFilters, minPrice: event.target.value })
              }
              placeholder="Minimum price"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="0"
              value={draftFilters.maxPrice}
              onChange={(event) =>
                setDraftFilters({ ...draftFilters, maxPrice: event.target.value })
              }
              placeholder="Maximum price"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={draftFilters.sort}
              onChange={(event) =>
                setDraftFilters({
                  ...draftFilters,
                  sort: event.target.value as ProductSort,
                })
              }
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: low to high</option>
              <option value="priceDesc">Price: high to low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>
          <button
            type="button"
            onClick={applyFilters}
            className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Apply filters
          </button>
        </section>

        {cart.length > 0 && (
          <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your order</h2>
              <p className="font-semibold text-gray-900">
                Total: {cartTotal.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3"
                >
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                      className="h-8 w-8 rounded border border-gray-300 text-lg"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.stock}
                      onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                      className="h-8 w-8 rounded border border-gray-300 text-lg disabled:opacity-40"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.productId, 0)}
                      className="ml-2 text-sm font-medium text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={isOrdering}
              onClick={() => void placeOrder()}
              className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isOrdering ? "Placing..." : "Confirm order"}
            </button>
          </section>
        )}

        {isLoading || isFetching ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : isError ? (
          <p className="text-sm text-red-600">Unable to load products.</p>
        ) : data?.products.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="font-semibold text-gray-900">{product.name}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                    {product.description}
                  </p>
                  <p className="mt-4 text-lg font-bold text-gray-900">
                    {(product.salePrice ?? product.price).toFixed(2)}
                  </p>
                  <button
                    type="button"
                    disabled={!product.stock}
                    onClick={() =>
                      addToCart({
                        productId: product.id,
                        name: product.name,
                        price: product.salePrice ?? product.price,
                        quantity: 1,
                        stock: product.stock,
                      })
                    }
                    className="mt-4 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {product.stock ? "Add to order" : "Out of stock"}
                  </button>
                </article>
              ))}
            </div>
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <p className="text-sm text-gray-500">No products match your filters.</p>
        )}
      </div>
    </main>
  );
}

export default Products;
