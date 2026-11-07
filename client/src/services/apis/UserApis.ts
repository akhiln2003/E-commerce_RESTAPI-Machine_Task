import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Fetch user profile
    fetchUserProfile: builder.mutation({
      query: (id: string) => ({
        url: `${UserApiEndPoints.fetchProfile}/${id}`,
        method: "GET",
      }),
    }),

    /////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const { useFetchUserProfileMutation } = userApi;
