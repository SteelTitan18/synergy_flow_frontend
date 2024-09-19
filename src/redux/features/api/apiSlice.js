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

    // projects queries
    getProjects: builder.query({
      query: () => `/project/project/`,
      providesTags: ["Project"],
    }),
    getProjectDetails: builder.query({
      query: (project_id) => `/project/project/${project_id}/`,
      providesTags: ["Project"],
    }),
    addProject: builder.mutation({
      query: (data) => ({
        url: `/project/project/`,
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `/project/project/${data.id}/`,
        body: data,
        method: "PUT",
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (project_id) => ({
        url: `/project/project/${project_id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),

    // tasks queries
    getProjectTasks: builder.query({
      query: (project_id) => `/project/task/${project_id}/`,
      providesTags: ["Task"],
    }),
    getTasks: builder.query({
      query: () => `/project/task/`,
      providesTags: ["Task"],
    }),
    getMemberTasks: builder.query({
      query: (member_id) => `/project/task/${member_id}/`,
      providesTags: ["Task"],
    }),

    // messages queries
    getProjectMessages: builder.query({
      query: (project_id) => `/chat/messages/?project_id=${project_id}`,
      providesTags: ["Message"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProjectsQuery,
  useGetMemberTasksQuery,
  useGetProjectTasksQuery,
  useGetTasksQuery,
  useAddProjectMutation,
  useGetProjectDetailsQuery,
  useUpdateProjectMutation,
  useGetProjectMessagesQuery,
  useDeleteProjectMutation,
} = apiSlice;
