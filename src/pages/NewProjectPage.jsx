import { useForm } from "react-hook-form";
import Banner from "../components/Banner";
import { Button } from "primereact/button";
import { useAddProjectMutation } from "../redux/features/api/apiSlice";
import { requestHasFailed } from "../functions/api/functions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Back from "../components/BackComponent";

export default function NewProject() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  let [createProject, { isLoading: isCreatingProject }] =
    useAddProjectMutation();

  async function handleCreateProject(data) {
    return new Promise(async (resolve, reject) => {
      if (!isCreatingProject) {
        let res = await createProject(data);
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

  const onSubmit = (data) => handleCreateProject(data);

  return (
    <div className="page-layout">
      <Back />
      <Banner title={"Ajouter un nouveau projet"} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[30%] gap-5"
      >
        <label className="flex flex-col font-bold text-lg">
          Libellé :
          <input
            className="h-12 rounded-sm p-2"
            {...register("label")}
            required
          />
        </label>
        <label className="flex flex-col font-bold text-lg">
          Description :
          <input
            className="h-12 rounded-sm p-2"
            {...register("description")}
            required
          />
        </label>
        <Button className="button self-center" type="submit">
          Envoyer
        </Button>
      </form>
    </div>
  );
}
