import { Navigate } from "react-router-dom";
import routes from "../utils/routes";
import NotAuthorized from "../pages/403Page";

export default function Protected({
  element,
  loggedIn,
  allowed = ["ADM", "MBR"],
  user,
  inventory = false,
}) {
  if (loggedIn) {
    if (allowed.includes(user?.type)) {
      return element;
    } else {
      return <NotAuthorized />;
    }
  } else {
    return <Navigate to={routes.login.path} />;
  }
}
