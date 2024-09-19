// primereact styles files
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css"; //core css

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import routes from "./utils/routes";
import Dashboard from "./pages/DashboardPage";
import Protected from "./components/ProtectedPage";
import Login from "./pages/LoginPage";
import { useSelector } from "react-redux";
import Chat from "./pages/ChatPage";
import Profile from "./pages/ProfilePage";
import Staff from "./pages/StaffPage";
import NewMember from "./pages/NewMemberPage";
import MemberDetails from "./pages/MemberDetailsPage";
import Tasks from "./pages/TasksPage";
import NewTask from "./pages/NewTaskPage";
import TaskDetails from "./pages/TaskDetailsPage";
import Projects from "./pages/ProjectsPage";
import NewProject from "./pages/NewProjectPage";
import ProjectDetails from "./pages/ProjectDetailsPage";

function App() {
  const { loggedIn, user: currentUser } = useSelector((state) => state.user);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={routes.home.path} element={<Layout />}>
            <Route
              index
              element={
                <Protected /* Custom component whixch allowed only permit users to access a specific page */
                  element={<Dashboard />}
                  loggedIn={loggedIn}
                  user={currentUser}
                />
              }
            />
            <Route path={routes.login.path} element={<Login />} />
            <Route
              path={routes.profile.path}
              element={
                <Protected
                  element={<Profile />}
                  loggedIn={loggedIn}
                  user={currentUser}
                />
              }
            />

            {/* membgres pages */}
            <Route
              path={routes.staff.path}
              element={
                <Protected
                  element={<Staff />}
                  loggedIn={loggedIn}
                  user={currentUser}
                  allowed={"ADM"}
                />
              }
            />
            <Route
              path={routes.new_member.path}
              element={
                <Protected
                  element={<NewMember />}
                  loggedIn={loggedIn}
                  user={currentUser}
                  allowed={"ADM"}
                />
              }
            />
            <Route
              path={routes.member_details.path(":member_id")}
              element={
                <Protected
                  element={<MemberDetails />}
                  loggedIn={loggedIn}
                  user={currentUser}
                  allowed={"ADM"}
                />
              }
            />

            {/* Tasks pages */}
            <Route
              path={routes.tasks.path}
              element={
                <Protected
                  element={<Tasks />}
                  loggedIn={loggedIn}
                  user={currentUser}
                />
              }
            />
            <Route
              path={routes.new_task.path}
              element={
                <Protected
                  element={<NewTask />}
                  loggedIn={loggedIn}
                  user={currentUser}
                  allowed={"ADM"}
                />
              }
            />
            <Route
              path={routes.task_details.path(":task_id")}
              element={
                <Protected
                  element={<TaskDetails />}
                  loggedIn={loggedIn}
                  user={currentUser}
                />
              }
            />

            {/* Projects pages */}
            <Route
              path={routes.projects.path}
              element={
                <Protected
                  element={<Projects />}
                  loggedIn={loggedIn}
                  user={currentUser}
                />
              }
            />
            <Route
              path={routes.new_project.path}
              element={
                <Protected
                  element={<NewProject />}
                  loggedIn={loggedIn}
                  user={currentUser}
                  allowed={"ADM"}
                />
              }
            />
            <Route path={routes.project_details.path(":project_id")}>
              <Route
                index
                element={
                  <Protected
                    element={<ProjectDetails />}
                    loggedIn={loggedIn}
                    user={currentUser}
                  />
                }
              ></Route>
              <Route
                path={routes.chatPage.path(":project_id")}
                element={
                  <Protected
                    element={<Chat />}
                    loggedIn={loggedIn}
                    user={currentUser}
                  />
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
