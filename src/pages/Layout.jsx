import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";

export default function Layout() {
  const { user: currentUser } = useSelector((state) => state.user);

  return currentUser?.token ? (
    <div className="flex">
      <div className="w-full overflow-y-auto h-screen">
        <Header />
        <div className="flex h-full">
          <div className="mt-28 w-[20%]">
            <SideBar />
          </div>
          <div className="mt-28 ml w-full mx-auto bg-white-blue flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={"/login"} />
  );
}
