import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { UserApiEndPoints } from "../endPoints/UserEndPoints";
import type { IUserDB } from "@/@types/interface/IDataBase";

interface ProfileResponse {
  success: boolean;
  user: IUserDB;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    fetchUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: UserApiEndPoints.fetchProfile,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    /////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const { useFetchUserProfileQuery } = userApi;
