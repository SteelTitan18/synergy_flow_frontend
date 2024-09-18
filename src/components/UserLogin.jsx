import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { FaUser } from "react-icons/fa";

export default function UserLogin({
  formik,
  isFormFieldInvalid,
  loginData,
  setLoginData,
}) {
  return (
    <div className="flex flex-col w-full h-screen self-center items-center justify-center">
      <span className="text-xl text-primary-font mb-10">
        Entrez vos identifiants afin de vous connecter !
      </span>
      <div className="bg-white p-10 rounded-lg flex flex-col">
        <div className="flex self-center items-center text-4xl font-bold text-primary-font">
          Connexion
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex flex-col items-center justify-center gap-3 py-3">
            <form
              onSubmit={formik.handleSubmit}
              className="gap-5 flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <label className="font-bold text-primary-font">
                  Nom d'utilisateur ou email
                </label>
                <InputText
                  style={{ backgroundColor: "#f2f2f2" }}
                  autoComplete="new-password"
                  id="username"
                  type="text"
                  className={classNames({
                    "p-invalid": isFormFieldInvalid("first_name"),
                    "p-2": "p-2",
                  })}
                  value={formik.values.username}
                  onChange={(e) => {
                    formik.setFieldValue("username", e.target.value);
                    setLoginData({ ...loginData, username: e.target.value });
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <label className="font-bold text-primary-font">
                  Mot de passe
                </label>
                <InputText
                  style={{ backgroundColor: "#f2f2f2" }}
                  autoComplete="new-password"
                  id="password"
                  type="password"
                  className="p-2"
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.setFieldValue("password", e.target.value);
                    setLoginData({ ...loginData, password: e.target.value });
                  }}
                />
              </div>
              <Button
                type="submit"
                label="Connexion"
                icon={FaUser}
                className="mx-auto bg-light-blue p-2 text-white flex gap-2"
              ></Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
