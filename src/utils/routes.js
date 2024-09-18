// all paths of the application pages will be defined here and will be used as variables in other files

const routes = {
  home: { path: "/" },
  login: { path: "/login" },
  chatPage: { path: "chat/" },
  not_authorized: { path: "/not_authorized" },
  dashboard: { path: "/dashboard/" },
  profile: { path: "/profile/" },

  // members management pages
  staff: { path: "/staff" },
  new_member: { path: "add-member/" },
  member_details: { path: (member_id) => `${member_id}/` },

  // tasks management pages
  tasks: { path: "/tasks" },
  new_task: { path: "add-task/" },
  task_details: { path: (task_id) => `${task_id}/` },

  // projects management pages
  projects: { path: "/projects" },
  new_project: { path: "/projects/add-project/" },
  project_details: { path: (project_id) => `/projects/${project_id}/` },
};

export default routes;
