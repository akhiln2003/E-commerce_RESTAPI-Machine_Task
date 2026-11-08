import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";
import type {
  ICategory,
  ICategoryTreeNode,
} from "@/@types/interface/ICategory";
import type { IProduct, ProductStatus } from "@/@types/interface/IProduct";
import type { IOrder, OrderStatus } from "@/@types/interface/IOrder";

interface CategoryListResponse {
  success: boolean;
  categories: ICategory[];
}

interface CategoryTreeResponse {
  success: boolean;
  categories: ICategoryTreeNode[];
}

interface CategoryInput {
  name: string;
  parentId: string | null;
}

interface ProductInput {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: string;
  status: ProductStatus;
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    fetchUsers: builder.mutation({
      query: ({ page, limit = 12 }: { page: number; limit?: number }) => ({
        url: `${AdminApiEndPoints.fetchUsers}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    updateUserBlock: builder.mutation({
      query: ({
        userId,
        isBlocked,
      }: {
        userId: string;
        isBlocked: boolean;
      }) => ({
        url: `${AdminApiEndPoints.updateUserBlock}/${userId}/block`,
        method: "PATCH",
        data: { isBlocked },
      }),
    }),
    fetchCategories: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: AdminApiEndPoints.categories,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    fetchCategoryTree: builder.query<CategoryTreeResponse, void>({
      query: () => ({
        url: `${AdminApiEndPoints.categories}/tree`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    createCategory: builder.mutation<
      { category: ICategory },
      CategoryInput
    >({
      query: (data) => ({
        url: AdminApiEndPoints.categories,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateCategory: builder.mutation<
      { category: ICategory },
      { categoryId: string; data: CategoryInput }
    >({
      query: ({ categoryId, data }) => ({
        url: `${AdminApiEndPoints.categories}/${categoryId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (categoryId) => ({
        url: `${AdminApiEndPoints.categories}/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    fetchProducts: builder.query<
      { products: IProduct[]; pagination: { page: number; totalPages: number } },
      { page?: number; limit?: number; categoryId?: string }
    >({
      query: ({ page = 1, limit = 12, categoryId }) => ({
        url: AdminApiEndPoints.products,
        method: "GET",
        params: { page, limit, categoryId },
      }),
      providesTags: ["Admin"],
    }),
    createProduct: builder.mutation<{ product: IProduct }, ProductInput>({
      query: (data) => ({
        url: AdminApiEndPoints.products,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateProduct: builder.mutation<
      { product: IProduct },
      { productId: string; data: ProductInput }
    >({
      query: ({ productId, data }) => ({
        url: `${AdminApiEndPoints.products}/${productId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (productId) => ({
        url: `${AdminApiEndPoints.products}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    fetchOrders: builder.query<{ orders: IOrder[] }, void>({
      query: () => ({ url: "/orders/admin", method: "GET" }),
      providesTags: ["Admin"],
    }),
    updateOrderStatus: builder.mutation<
      { order: IOrder },
      { orderId: string; status: OrderStatus }
    >({
      query: ({ orderId, status }) => ({
        url: `/orders/admin/${orderId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useFetchUsersMutation,
  useUpdateUserBlockMutation,
  useFetchCategoriesQuery,
  useFetchCategoryTreeQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchOrdersQuery,
  useUpdateOrderStatusMutation,
} = adminApi;
