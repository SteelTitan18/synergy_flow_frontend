import routes from "../../utils/routes";
import toast from "react-hot-toast";

export const getSessionUser = () => {
  return sessionStorage.getItem("user");
};

export const getToken = () => {
  return JSON.parse(sessionStorage.getItem("clinic_user")).token || null;
};

export const setSessionUser = ({ user }) => {
  sessionStorage.setItem("user", user);
};

export const removeUserSession = () => {
  sessionStorage.removeItem("clinic_user");
};

export const requestAuthentication = (navigate) => {
  removeUserSession();
  toast.dismiss();
  toast.error("Authentification requise", { duration: 6000 });
  navigate(routes.login.path);
};
