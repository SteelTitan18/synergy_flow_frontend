import { Button } from "primereact/button";
import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import { requestHasFailed } from "../functions/api/functions";
import {
  useDeleteTaskMutation,
  useGetTaskDetailsQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
} from "../redux/features/api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { TbEdit, TbTrash } from "react-icons/tb";
import toast from "react-hot-toast";
import Back from "../components/BackComponent";

export default function TaskDetails() {
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useSelector((state) => state.user);
  const task_id = useParams().task_id;
  const [readOnly, setReadOnly] = useState(true);
  const [task, setTask] = useState();

  const floating_items = [
    {
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
        handleDeleteTask();
      },
    },
  ];

  let [updateTask, { isLoading: isUpdatingTask }] =
    useUpdateTaskMutation(task_id);
  let { data: task_fetched, isLoading: isTaskLoading } =
    useGetTaskDetailsQuery(task_id);
  let [deleteTask, { isLoading: isDeletingTask }] =
    useDeleteTaskMutation(task_id);
  let { data: users_fetched, isLoading: isUsersLoading } = useGetUsersQuery();

  useEffect(() => {
    if (!isTaskLoading) {
      if (!requestHasFailed(task_fetched, navigate)) {
        setTask(task_fetched);
        setValue("label", task_fetched.label);
        setValue("description", task_fetched.description);
        setValue("start_date", task_fetched.start_date);
        setValue("end_date", task_fetched.end_date);
        setValue("task_assignees", task_fetched.task_assignees);
        setValue("task_status", task_fetched.task_status);
        setValue("task_priority", task_fetched.task_priority);
      }
    }
  }, [isTaskLoading, task_fetched]);
  useEffect(() => {
    if (!isUsersLoading) {
      if (!requestHasFailed(users_fetched, navigate)) {
        setUsers([...users_fetched?.results]);
      }
    }
  }, [isUsersLoading, users_fetched]);

  const users_options = users.map((user) => (
    <option value={user.id}>{user.username}</option>
  ));

  async function handleUpdateTask(data) {
    data.project_id = task?.task_project.id;
    data.assignees = data.task_assignees;

    return new Promise(async (resolve, reject) => {
      if (!isUpdatingTask) {
        let res = await updateTask({ ...task, ...data });
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

  async function handleDeleteTask() {
    return new Promise(async (resolve, reject) => {
      if (!isDeletingTask) {
        let res = await deleteTask(task_id);
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

  const onSubmit = (data) => handleUpdateTask(data);

  return (
    <div className="page-layout">
      <Back />
      <Banner title={"Détails de la tâche"} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[30%] gap-5"
      >
        <label className="flex flex-col font-bold text-lg">
          Libellé* :
          <input
            className="h-12 rounded-sm p-2"
            {...register("label")}
            required
          />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Description :
          <textarea className="rounded-sm p-2" {...register("description")} />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Date de début* :
          <input
            type="date"
            className="h-12 rounded-sm p-2"
            {...register("start_date")}
            required
          />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Date de fin* :
          <input
            type="date"
            className="h-12 rounded-sm p-2"
            {...register("end_date")}
            required
          />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Assignés*
          <select {...register("task_assignees")} multiple>
            {users_options}
          </select>
        </label>
        <label className="flex flex-col font-bold text-lg">
          Status
          <select {...register("task_status")}>
            <option value="SCD">Programmée</option>
            <option value="PRG">En cours</option>
            <option value="DNE">Terminée</option>
          </select>
        </label>
        <label className="flex flex-col font-bold text-lg">
          Priorité
          <select {...register("task_priority")}>
            <option value="LOW">Bas</option>
            <option value="MDM">Moyen</option>
            <option value="HGH">Critique</option>
          </select>
        </label>

        <Button className="button self-center" type="submit">
          Enregistrer
        </Button>
        {currentUser.type === "ADM" && (
          <Button
            className="delete-button self-end"
            onClick={() => handleDeleteTask()}
          >
            Supprimer
          </Button>
        )}
      </form>
    </div>
  );
}
