import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axios/axiosBaseQuery";
import { AdminApiEndPoints } from "../endPoints/AdminEndPoints";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    ///////////////////////////////--User--///////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
  }),
});

// Export the hook directly from the API slice
export const {} = adminApi;
