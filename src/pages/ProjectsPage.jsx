import { Column } from "primereact/column";
import Banner from "../components/Banner";
import Datatable from "../components/DataTable";
import { useEffect, useState } from "react";
import { requestHasFailed } from "../functions/api/functions";
import { useGetProjectsQuery } from "../redux/features/api/apiSlice";
import { Link, useNavigate } from "react-router-dom";
import { TbListDetails } from "react-icons/tb";
import routes from "../utils/routes";
import { Button } from "primereact/button";
import { FaPlus } from "react-icons/fa";
import Back from "../components/BackComponent";
import { useSelector } from "react-redux";

export default function Projects() {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.user);

  const [projects, setProjects] = useState([]);

  let { data: projects_fetched, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  useEffect(() => {
    if (!isProjectsLoading) {
      if (!requestHasFailed(projects_fetched, navigate)) {
        setProjects([...projects_fetched?.results]);
      }
    }
  }, [isProjectsLoading, projects_fetched]);

  const data = projects.map((project) => ({
    key: project.id,
    label: project.label,
    description: project.description,
    actions: (
      <>
        <span className="flex">
          <Link to={routes.project_details.path(project.id)}>
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
    <Column key={"label"} header="NOM" field={"label"} />,
    <Column key={"description"} header="DESCRIPTION" field={"description"} />,
    <Column key={"actions"} header="ACTIONS" field={"actions"} />,
  ];

  return (
    <div className="page-layout">
      <Banner title={"Liste des projets"} />

      <Datatable data={data} columns={columns} />
      {currentUser.type === "ADM" && (
        <Button
          className="button self-end mt-10"
          onClick={() => navigate(routes.new_project.path)}
        >
          <FaPlus /> Ajouter un projet
        </Button>
      )}
    </div>
  );
}
