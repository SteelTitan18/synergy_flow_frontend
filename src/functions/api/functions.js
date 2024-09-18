import routes from "../../utils/routes";
import { requestAuthentication } from "../user/session";

let requestHasFailed = (res, error = {}, navigate) => {
  console.log(res);
  console.log(error);

  const request_error = res ? res.error : error;

  if (!request_error) {
    return false;
  } else {
    if (
      request_error.status === 401 ||
      request_error.status_code === 401 ||
      error.status === 401
    ) {
      requestAuthentication(navigate);
    } else if (
      request_error.status === 403 ||
      request_error.status_code === 403
    ) {
      navigate(routes.not_authorized.path, { replace: true });
    }
    return true;
  }
};

export { requestHasFailed };
