import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { INewUserData, ISignInData } from "@/@types/interface/IUserApisQuery";
import { CommonApiEndPoints } from "../endPoints/CommonEndPoints";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    ///////////////////////////////--Common--/////////////////////////////
    // signUp new
    signUp: builder.mutation({
      query: (newUser: INewUserData) => ({
        url: CommonApiEndPoints.signUp,
        method: "POST",
        data: newUser,
      }),
    }),

    // signIn
    signIn: builder.mutation({
      query: (data: ISignInData) => ({
        url: CommonApiEndPoints.signIn,
        method: "POST",
        data: data,
      }),
    }),
    // singOut
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: CommonApiEndPoints.signOut,
        method: "POST",
      }),
    }),

    ///////////////////////////////--Common end--//////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {
  // Common
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,

} = authApi;
