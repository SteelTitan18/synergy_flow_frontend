import { useForm } from "react-hook-form";
import Banner from "../components/Banner";
import {
  useAddTaskMutation,
  useGetUsersQuery,
} from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Back from "../components/BackComponent";

export default function NewTask() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useSelector((state) => state.user);
  const project_id = useParams().project_id;

  let [createTask, { isLoading: isCreatingTask }] = useAddTaskMutation();
  let { data: users_fetched, isLoading: isUsersLoading } = useGetUsersQuery();

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

  async function handleCreateTask(data) {
    data.task_author = currentUser.id;
    data.project_id = project_id;

    return new Promise(async (resolve, reject) => {
      if (!isCreatingTask) {
        let res = await createTask(data);
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

  const onSubmit = (data) => handleCreateTask(data);

  return (
    <div className="page-layout">
      <Back />
      <Banner title={"Ajouter une nouvelle tâche"} />

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
          Envoyer
        </Button>
      </form>
    </div>
  );
}
