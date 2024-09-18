import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import UserMenu from "./UserMenu";
import routes from "../utils/routes";
import { useSelector } from "react-redux";
import NotificationDisplay from "./NotificationDisplay";

function Header() {
  const { user: currentUser, loggedIn } = useSelector((state) => state.user);

  return (
    <div className="box-border w-full text-secondary-font bg-dark-blue flex flex-col object-right fixed z-10 text-white">
      <div className="flex justify-between p-4 font-bold text-4xl text-primary-font items-center">
        <div className="flex flex-col self-center items-center">
          <span className="flex items-center">
            <Link to={routes.home.path}>
              <img src={logo} alt="logo" className="p-2 rounded-full size-20" />
            </Link>
            SynergyFlow
          </span>
        </div>
        <div className="flex gap-3 items-center">
          {loggedIn && (
            <div className="flex gap-3 items-center">
              {/* <NotificationDisplay /> */}
              <UserMenu user={currentUser} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
