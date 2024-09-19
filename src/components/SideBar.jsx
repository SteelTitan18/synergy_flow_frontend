import { Link } from "react-router-dom";
import routes from "../utils/routes";
import { RiDashboardFill } from "react-icons/ri";
import { GrProjects } from "react-icons/gr";
import { useSelector } from "react-redux";
import { FaUsers } from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";

export default function SideBar() {
  const { user: currentUser } = useSelector((state) => state.user);

  return (
    <div className="bg-grey-blue w-full overflow-y-auto text-white h-full justify-between flex flex-col pb-5">
      <div className="">
        {/* <Link to={routes.home.path}>
          <div className="sidebar-element">
            <RiDashboardFill />
            Dashboard
          </div>
        </Link> */}
        <Link to={routes.projects.path}>
          <div className="sidebar-element">
            <GrProjects />
            Projets
          </div>
        </Link>
        <Link to={routes.tasks.path}>
          <div className="sidebar-element">
            <SiGoogletasks />
            Tâches
          </div>
        </Link>
        {/* <Link to={routes.staff.path}>
          <div className="sidebar-element">
            <FaUsers />
            Équipe
          </div>
        </Link> */}
      </div>
      <div className="flex flex-col ml-5">
        <div className="flex flex-col">
          <Link to={"#"}>
            <span>Politique de confidentialité</span>
          </Link>
          <Link to={"#"}>
            <span>Conditions d'utilisations</span>
          </Link>
        </div>
        <span className="mt-3">&copy; 2024 SynergyFlow</span>
      </div>
    </div>
  );
}
