import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { useEffect, useState } from "react";
import { useGetTasksQuery } from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import { Column } from "primereact/column";
import Datatable from "../components/DataTable";
import { TbListDetails } from "react-icons/tb";
import { dateFormatterInv } from "../functions/utils/functions";

export default function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  let { data: tasks_fetched, isLoading: isTasksLoading } = useGetTasksQuery();

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

  const data = tasks.map((task) => ({
    key: task.id,
    project: task.task_project,
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
    assignees: task.assignees,
    actions: (
      <>
        <span className="flex">
          <Link to={"#"}>
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
  }));

  const columns = [
    <Column key={"project"} header="PROJET" field={"project"} />,
    <Column key={"label"} header="NOM" field={"label"} />,
    <Column key={"description"} header="DESCRIPTION" field={"description"} />,
    <Column key={"start_date"} header="DÉBUT" field={"start_date"} />,
    <Column key={"end_date"} header="FIN" field={"end_date"} />,
    <Column
      key={"priority"}
      header="PRIORITÉ"
      field={"priority"}
      body={priorityBodyTemplate}
    />,
    <Column
      key={"status"}
      header="STATUS"
      field={"status"}
      body={statusBodyTemplate}
    />,
    <Column key={"assignees"} header="ASSIGNÉS" field={"assignees"} />,
    <Column key={"actions"} header="ACTIONS" field={"actions"} />,
  ];

  return (
    <div className="page-layout">
      <Banner title={"Liste des tâches"} />
      <Datatable data={data} columns={columns} />
    </div>
  );
}
