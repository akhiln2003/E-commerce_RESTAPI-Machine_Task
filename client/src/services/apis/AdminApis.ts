import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";
import type {
  ICategory,
  ICategoryTreeNode,
} from "@/@types/interface/ICategory";

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
} = adminApi;
