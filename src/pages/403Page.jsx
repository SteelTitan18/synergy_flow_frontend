import { useMediaQuery } from "@mui/material"
import ForbiddenImage from "../assets/403.svg"
import Back from "../components/BackComponent"

export default function NotAuthorized() {
  const isOnPortrait = useMediaQuery("only screen and (max-width : 550px)")

  if (!isOnPortrait) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          alt="page not found"
          src={ForbiddenImage}
          className="h-1/2 w-1/2"
        />
        <div className="text-3xl font-bold text-primary-font text-center">
          Vous n'êtes pas autorisé(e) à accéder à cette ressource
        </div>
        <Back />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          alt="page not found"
          src={ForbiddenImage}
          className="h-1/2 w-1/2"
        />
        <div className="text-xl font-bold text-primary-font text-center">
          Vous n'êtes pas autorisé(e) à accéder à cette ressource
        </div>
        <Back />
      </div>
    )
  }
}
