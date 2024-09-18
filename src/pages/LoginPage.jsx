import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useLoginMutation } from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import UserLogin from "../components/UserLogin";
import routes from "../utils/routes";
import { useDispatch, useSelector } from "react-redux";
import {
  checkLoginStatus,
  loginFailure,
} from "../redux/features/user/userSlice";
import { loginStart, loginSuccess } from "../redux/features/user/userSlice";
import Loader from "../components/Loader";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    loading: userLoading,
    loggedIn: userLoggedIn,
    user: currentUser,
  } = useSelector((state) => state.user);

  const initLoginState = {
    username: "",
    password: "",
  };

  const [loginData, setLoginData] = useState(initLoginState);
  const [login, { isLoading: isLoginLoading, error: login_error }] =
    useLoginMutation();

  let handleLogin = async () => {
    return new Promise(async (resolve, reject) => {
      if (loginData.username && loginData.password) {
        if (!isLoginLoading) {
          dispatch(loginStart());
          let response = await login(loginData);
          if (!requestHasFailed(response, login_error, navigate, dispatch)) {
            if (response?.data && response?.data?.token) {
              dispatch(loginSuccess(response.data));
              resolve("success");
            } else {
              dispatch(loginFailure(response.data));
              reject("unauthorized");
            }
          } else {
            dispatch(loginFailure(response.data));
            reject("error");
            for (var error in response?.error?.data?.details) {
              toast.error(response?.error?.data?.details[error], {
                duration: 8000,
              });
            }
          }
        }
      }
    });
  };

  const formik = useFormik({
    initialValues: initLoginState,
    validate: (data) => {
      let errors = {};

      if (!data.username) {
        errors.username = "Le username est obligatoire !";
      }

      if (!data.password) {
        errors.username = "Mot de passe obligatoire !";
      }

      return errors;
    },
    onSubmit: (data) => {
      setLoginData(data);
      toast.promise(handleLogin(), {
        loading: "Connexion en cours ...",
        success: <b>Bienvenue !</b>,
        error: (error) =>
          error === "unauthorized" ? (
            <b>Identifiants incorrect !</b>
          ) : (
            <b>Une erreur s'est produite</b>
          ),
      });
    },
  });

  const isFormFieldInvalid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);

  if (userLoading || isLoginLoading) {
    return <Loader />;
  } else {
    if (userLoggedIn && currentUser?.is_active) {
      return <Navigate to={routes.home.path} />;
    } else {
      return (
        <UserLogin
          formik={formik}
          isFormFieldInvalid={isFormFieldInvalid}
          loginData={loginData}
          setLoginData={setLoginData}
        />
      );
    }
  }
}
