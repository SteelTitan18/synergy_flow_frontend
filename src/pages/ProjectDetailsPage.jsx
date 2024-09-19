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
import {
  TbEdit,
  TbMessage,
  TbPlus,
  TbTableOptions,
  TbTrash,
} from "react-icons/tb";
import routes from "../utils/routes";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { CgOptions } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";

export default function ProjectDetails() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const project_id = useParams().project_id;
  const [readOnly, setReadOnly] = useState(true);
  const floating_items = [
    {
      label: "Modifier",
      icon: <TbEdit className="text-white" size={20} />,
      command: () => {
        setReadOnly(!readOnly);
      },
    },
    {
      label: "Chat",
      icon: <TbMessage className="text-white" size={20} />,
      command: () => {
        navigate(routes.chatPage.path(project_id));
      },
    },
    {
      label: "Supprimer",
      icon: <TbTrash className="text-white" size={20} />,
      command: () => {},
    },
  ];

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
      <Banner title={"Détails d'un projet"} />

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
      <Tooltip
        target=".speeddial-bottom-right .p-speeddial-action"
        className="p-10"
      />
      <SpeedDial
        model={floating_items}
        direction="up"
        className="speeddial-bottom-right right-0 bottom-0"
        buttonClassName="bg-dark-blue m-5"
        showIcon={<CgOptions className="text-white" size={20} />}
        hideIcon={<FaTimes className="text-white" size={20} />}
      />
    </div>
  );
}
