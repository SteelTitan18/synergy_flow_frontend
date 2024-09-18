import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import { useEffect } from "react";
import { checkLoginStatus } from "../redux/features/user/userSlice";
import Loader from "../components/Loader";

export default function Layout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  const {
    loading,
    loggedIn,
    user: currentUser,
  } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!loggedIn) {
    return (
      <div className="flex">
        <div className="w-full overflow-y-auto h-screen">
          <Header />
          <div className="flex h-full">
            <div className="mt-28 ml w-full mx-auto bg-white-blue flex flex-col">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
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
}
