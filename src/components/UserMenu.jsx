import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import { TbLogout } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@mui/material";
import routes from "../utils/routes";
import { TbReportMoney } from "react-icons/tb";

export default function UserMenu({ user }) {
  const isonPortrait = useMediaQuery("only screen and (max-width : 550px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menu = useRef(null);
  const items = [
    {
      label: `${user?.firstname} ${user?.lastname}`,
      items: [
        {
          label: "Profil",
          icon: <ImProfile className="mr-2" />,
          command: () => {
            navigate(routes.profile.path);
          },
        },
        {
          label: "Déconnexion",
          icon: <TbLogout className="mr-2" />,
          /* command: () => {
            dispatch(logout());
          }, */
        },
      ],
    },
  ];

  return !isonPortrait ? (
    <div className="card flex justify-content-center cursor-pointer">
      <Menu model={items} popup ref={menu} />
      <div
        className="flex flex-col items-center gap-5 text-4xl font-bold"
        onClick={(event) => menu.current.toggle(event)}
      >
        <div className="h-25 w-auto flex justify-center self-center items-center gap-2 text-white text-base font-normal">
          <FaRegUserCircle size={28} />
          {user?.username}
        </div>
      </div>
    </div>
  ) : (
    <div className="card flex justify-items-center cursor-pointer self-center">
      <Menu model={items} popup ref={menu} />
      <div
        className="flex flex-col items-center gap-5 text-4xl font-bold"
        onClick={(event) => menu.current.toggle(event)}
      >
        <div className="h-25 w-auto flex justify-center self-center items-center gap-2 text-primary-font text-base font-normal">
          <FaRegUserCircle />
          <h3 className="self-center">{user.username}</h3>
        </div>
      </div>
    </div>
  );
}
