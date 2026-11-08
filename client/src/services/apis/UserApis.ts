import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import type { IUserDB } from "@/@types/interface/IDataBase";
import type { IProduct } from "@/@types/interface/IProduct";
import type { IOrder } from "@/@types/interface/IOrder";
import type { ICategoryTreeNode } from "@/@types/interface/ICategory";

interface ProfileResponse {
  success: boolean;
  user: IUserDB;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User", "Order"],
  endpoints: (builder) => ({
    fetchUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: UserApiEndPoints.fetchProfile,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    fetchProducts: builder.query<
      { products: IProduct[]; pagination: { page: number; totalPages: number } },
      {
        page?: number;
        limit?: number;
        categoryId?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: "newest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc";
      } | void
    >({
      query: (filters = {}) => ({
        url: "/products",
        method: "GET",
        params: filters,
      }),
    }),
    fetchCategoryTree: builder.query<
      { categories: ICategoryTreeNode[] },
      void
    >({
      query: () => ({ url: "/categories/tree", method: "GET" }),
    }),
    createOrder: builder.mutation<
      { order: IOrder },
      { items: { productId: string; quantity: number }[] }
    >({
      query: (data) => ({ url: "/orders", method: "POST", data }),
      invalidatesTags: ["Order"],
    }),
    fetchOwnOrders: builder.query<
      {
        orders: IOrder[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      },
      { page: number; limit: number }
    >({
      query: (params) => ({ url: "/orders/mine", method: "GET", params }),
      providesTags: ["Order"],
    }),

    /////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {
  useFetchUserProfileQuery,
  useFetchProductsQuery,
  useFetchCategoryTreeQuery,
  useCreateOrderMutation,
  useFetchOwnOrdersQuery,
} = userApi;
