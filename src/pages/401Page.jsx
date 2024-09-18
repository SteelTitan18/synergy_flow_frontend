import { useMediaQuery } from "@mui/material"
import NotAuthorizedImage from "../assets/401.svg"
import Back from "../components/BackComponent"

export default function BlockedAccount() {
  const isOnPortrait = useMediaQuery("only screen and (max-width : 550px)")

  if (!isOnPortrait) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          alt="blocked account"
          src={NotAuthorizedImage}
          className="h-1/2 w-1/2"
        />
        <div className="text-3xl font-bold text-primary-font text-center">
          Votre compte à été bloqué ! Veuillez contacter votre administrateur
        </div>
        <Back />
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <img
          alt="blocked account"
          src={NotAuthorizedImage}
          className="h-1/2 w-1/2"
        />
        <div className="text-xl font-bold text-primary-font text-center">
          Votre compte à été bloqué ! Veuillez contacter votre administrateur
        </div>
        <Back />
      </div>
    )
  }
}
