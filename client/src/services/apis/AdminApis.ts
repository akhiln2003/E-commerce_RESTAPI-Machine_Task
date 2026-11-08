import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";

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
  }),
});

export const { useFetchUsersMutation, useUpdateUserBlockMutation } = adminApi;
