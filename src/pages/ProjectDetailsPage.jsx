import { Button } from "primereact/button";
import Banner from "../components/Banner";
import {
  useDeleteProjectMutation,
  useGetProjectDetailsQuery,
  useGetProjectTasksQuery,
  useUpdateProjectMutation,
} from "../redux/features/api/apiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { requestHasFailed } from "../functions/api/functions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { TbEdit, TbListDetails, TbMessage, TbTrash } from "react-icons/tb";
import routes from "../utils/routes";
import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
import { CgOptions } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { RiFunctionAddLine } from "react-icons/ri";
import { dateFormatterInv } from "../functions/utils/functions";
import { Column } from "primereact/column";
import Datatable from "../components/DataTable";
import { useSelector } from "react-redux";

export default function ProjectDetails() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const project_id = useParams().project_id;
  const [readOnly, setReadOnly] = useState(true);
  const { user: currentUser } = useSelector((state) => state.user);

  const [tasks, setTasks] = useState([]);

  let { data: tasks_fetched, isLoading: isTasksLoading } =
    useGetProjectTasksQuery(project_id);

  const floating_items = [
    {
      label: "Chat",
      icon: <TbMessage className="text-white" size={20} />,
      command: () => {
        navigate(routes.chatPage.path(project_id));
      },
    },
    currentUser.type === "ADM" &&
      ({
        label: "Modifier",
        icon: <TbEdit className="text-white" size={20} />,
        command: () => {
          setReadOnly(!readOnly);
        },
      },
      {
        label: "Supprimer",
        icon: <TbTrash className="text-white" size={20} />,
        command: () => {
          handleDeleteProject();
        },
      },
      {
        label: "Ajouter une tâche",
        icon: <RiFunctionAddLine className="text-white" size={20} />,
        command: () => {
          navigate(routes.new_task.path(project_id));
        },
      }),
  ];

  let { data: project_fetched, isLoading: isProjectLoading } =
    useGetProjectDetailsQuery(project_id);

  let [updateProject, { isLoading: isUpdatingProject }] =
    useUpdateProjectMutation();

  let [deleteProject, { isLoading: isDeletingProject }] =
    useDeleteProjectMutation();

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

  async function handleDeleteProject() {
    return new Promise(async (resolve, reject) => {
      if (!isDeletingProject) {
        let res = await deleteProject(project_id);
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

  useEffect(() => {
    if (!isTasksLoading) {
      if (!requestHasFailed(tasks_fetched, navigate)) {
        setTasks([...tasks_fetched?.results]);
      }
    }
  }, [isTasksLoading, tasks_fetched]);

  const statusBodyTemplate = (task) => {
    switch (task.status) {
      case "SCD":
        return (
          <>
            <span className="font-bold text-grey-blue text-base">
              Programmée
            </span>
          </>
        );
      case "PGR":
        return (
          <>
            <span className="font-bold text-warning text-base">En cours</span>
          </>
        );
      case "DNE":
        return (
          <>
            <span className="font-bold text-green text-base">Terminée</span>
          </>
        );
      default:
        return (
          <>
            <span className="font-bold text-grey-blue text-base">
              Programmée
            </span>
          </>
        );
    }
  };

  const priorityBodyTemplate = (task) => {
    switch (task.priority) {
      case "LOW":
        return (
          <>
            <span className="font-bold text-green text-base">Bas</span>
          </>
        );
      case "MDM":
        return (
          <>
            <span className="font-bold text-warning text-base">Moyen</span>
          </>
        );
      case "HGH":
        return (
          <>
            <span className="font-bold text-red text-base">Critique</span>
          </>
        );
      default:
        return (
          <>
            <span className="font-bold text-green text-base">Bas</span>
          </>
        );
    }
  };

  const data = tasks.map((task) => {
    return {
      key: task.id,
      project: task.task_project.label,
      label: task.label,
      description: task.description,
      start_date: task.start_date,
      end_date:
        new Date() >= dateFormatterInv(task.end_date) ? (
          <>
            <span className="text-red">{task.end_date}</span>
          </>
        ) : (
          task.end_date
        ),
      priority: task.task_priority,
      status: task.task_status,
      actions: (
        <>
          <span className="flex">
            <Link to={routes.task_details.path(task.id)}>
              <span
                className="bg-dark-blue flex justify-center items-center p-1.5 w-fit text-white rounded-md cursor-pointer mr-2"
                title={"Consulter"}
              >
                <TbListDetails />
              </span>
            </Link>
          </span>
        </>
      ),
    };
  });

  const columns = [
    <Column key={"project"} header="PROJET" field={"project"} />,
    <Column key={"label"} header="NOM" field={"label"} sortable />,
    <Column
      key={"description"}
      header="DESCRIPTION"
      field={"description"}
      sortable
    />,
    <Column key={"start_date"} header="DÉBUT" field={"start_date"} sortable />,
    <Column key={"end_date"} header="FIN" field={"end_date"} sortable />,
    <Column
      key={"priority"}
      header="PRIORITÉ"
      field={"priority"}
      body={priorityBodyTemplate}
      sortable
    />,
    <Column
      key={"status"}
      header="STATUS"
      field={"status"}
      body={statusBodyTemplate}
      sortable
    />,
    <Column key={"actions"} header="ACTIONS" field={"actions"} />,
  ];

  if (isProjectLoading) return <Loader />;

  return (
    <div className="page-layout">
      <Banner title={"Détails d'un projet"} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[30%] gap-5 mb-10"
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
            className="h-48 rounded-sm p-2"
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
        className="speeddial-bottom-right right-0 bottom-0 z-20"
        buttonClassName="bg-dark-blue m-5"
        showIcon={<CgOptions className="text-white" size={20} />}
        hideIcon={<FaTimes className="text-white" size={20} />}
      />
      <span className="font-bold text-3xl">Tâches du projet</span>
      <Datatable data={data} columns={columns} />
    </div>
  );
}
