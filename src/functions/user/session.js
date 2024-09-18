import routes from "../../utils/routes";
import toast from "react-hot-toast";

export const getSessionUser = () => {
  if (sessionStorage.getItem("user"))
    return JSON.parse(sessionStorage.getItem("user"));
  else return null;
};

export const getToken = () => {
  return JSON.parse(sessionStorage.getItem("user")).token || null;
};

export const setSessionUser = ({ user }) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const removeUserSession = () => {
  sessionStorage.removeItem("user");
};

export const requestAuthentication = (navigate) => {
  removeUserSession();
  toast.dismiss();
  toast.error("Authentification requise", { duration: 6000 });
  navigate(routes.login.path);
};
