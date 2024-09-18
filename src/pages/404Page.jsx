import { useMediaQuery } from "@mui/material"
import NotFoundImage from "../assets/404.svg"
import Back from "../components/BackComponent"

export default function NotFoundPage() {
  const isOnPortrait = useMediaQuery("only screen and (max-width : 550px)")

  if (!isOnPortrait) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img alt="page not found" src={NotFoundImage} className="h-1/2 w-1/2" />
        <div className="text-3xl font-bold text-primary-font text-center">
          La ressource demandée n'a pas été trouvée
        </div>
        <Back />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img alt="page not found" src={NotFoundImage} className="h-1/2 w-1/2" />
        <div className="text-xl font-bold text-primary-font text-center">
          La ressource demandée n'a pas été trouvée
        </div>
        <Back />
      </div>
    )
  }
}
