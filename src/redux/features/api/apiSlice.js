import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSessionUser } from "../../../functions/user/session";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: async (headers, api_) => {
      if (api_.type === "mutation") {
        headers.set("Content-Type", "application/json");
      }
      let user = getSessionUser();

      headers.set("Authorization", `Bearer ${user?.token}`);

      return headers;
    },
  }),
  tagTypes: ["User", "Project", "Task", "Message", "Notification"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    // handling_user
    login: builder.mutation({
      query: (data) => {
        return {
          url: "/project/login/",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["User", "Project", "Task", "Message", "Notification"],
    }),
  }),
});
