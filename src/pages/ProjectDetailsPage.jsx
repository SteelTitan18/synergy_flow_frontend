import { Button } from "primereact/button";
import Banner from "../components/Banner";
import {
  useGetProjectDetailsQuery,
  useUpdateProjectMutation,
} from "../redux/features/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { requestHasFailed } from "../functions/api/functions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function ProjectDetails() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const project_id = useParams().project_id;
  const [readOnly, setReadOnly] = useState(true);

  let { data: project_fetched, isLoading: isProjectLoading } =
    useGetProjectDetailsQuery(project_id);

  let [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectMutation();

  useEffect(() => {
    if (!isProjectLoading) {
      if (!requestHasFailed(project_fetched, navigate)) {
        setProject(project_fetched);
        setValue("label", project_fetched.label);
        setValue("description", project_fetched.description);
      }
    }
  }, [isProjectLoading, project_fetched]);

  async function handleUpdateProject(data) {
    return new Promise(async (resolve, reject) => {
      if (!isUpdatingProject) {
        let res = await updateProject({ ...project, ...data });
        if (!requestHasFailed(res, navigate)) {
          resolve("success");
          navigate(-1);
        } else {
          reject("error");
          for (var error in res?.error?.data?.details) {
            toast.error(res?.error?.data?.details[error], { duration: 8000 });
          }
        }
      }
    });
  }

  const onSubmit = (data) =>
    toast.promise(handleUpdateProject(data), {
      loading: "Processus en cours",
      success: <b>Mise à jour effectuée avec succès</b>,
      error: <b>Une erreur s'est produite</b>,
    });

  if (isProjectLoading) return <Loader />;

  return (
    <div className="page-layout">
      <div className="flex justify-between items-center mb-16">
        <Banner title={"Détails d'un projet"} />
        {readOnly && (
          <Button className="button" onClick={() => setReadOnly(false)}>
            Modifier
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[30%] gap-5"
      >
        <label className="flex flex-col font-bold text-lg">
          Libellé :
          <input
            className="h-12 rounded-sm p-2"
            {...register("label")}
            readOnly={readOnly}
            required
          />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Description :
          <textarea
            className="rounded-sm p-2"
            {...register("description")}
            required
            readOnly={readOnly}
          />
        </label>
        {!readOnly && (
          <div className="flex justify-around">
            <Button className="cancel-button" onClick={() => setReadOnly(true)}>
              Annuler
            </Button>
            <Button className="button" type="submit">
              Enregistrer
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
