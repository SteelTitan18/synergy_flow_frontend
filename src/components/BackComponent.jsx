import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function Back() {
  const navigate = useNavigate();

  return (
    <div className="font-bold hover:text-primary-back w-24 text-primary-font my-5">
      <Link onClick={() => navigate(-1)} className="flex gap-2 items-center">
        <IoMdArrowRoundBack />
        Retour
      </Link>
    </div>
  );
}
