import { FC } from "react";
import NextLink from "next/link";
import { FaHome } from "react-icons/fa";
import { FaUserDoctor, FaUserInjured, FaUserTie } from "react-icons/fa6";
import { BsFillCalendarDayFill } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { PiFolderSimpleUserBold } from "react-icons/pi";
import { type IconType } from "react-icons";
import { Roles } from "@/utils/constants";
import { signOut } from "next-auth/react";

interface SidebarItemProps {
  name: string;
  Icon: IconType;
  path: string;
  isActive?: boolean;
  roles: Roles[];
}

export const sidebarItems: SidebarItemProps[] = [
  {
    name: "Home",
    Icon: FaHome,
    path: "/",
    roles: [Roles.Admin, Roles.Attendant],
  },
  {
    name: "Consultas",
    Icon: BsFillCalendarDayFill,
    path: "/appointments",
    roles: [Roles.Admin, Roles.Attendant],
  },
  {
    name: "Minhas Consultas",
    Icon: PiFolderSimpleUserBold,
    path: "/my-appointments",
    roles: [Roles.Patient],
  },
  {
    name: "Pacientes",
    Icon: FaUserInjured,
    path: "/patients",
    roles: [Roles.Admin, Roles.Attendant],
  },
  {
    name: "Médicos",
    Icon: FaUserDoctor,
    path: "/doctors",
    roles: [Roles.Admin, Roles.Attendant],
  },
  {
    name: "Atendentes",
    Icon: FaUserTie,
    path: "/attendants",
    roles: [Roles.Admin],
  },
];

export const SidebarItem: FC<SidebarItemProps> = ({ name, Icon, path, isActive }) => {
  const nextLinkStyle = `
        group flex py-2 px-4 gap-4 rounded-md  
        hover:bg-primary [transition:background_200ms_ease-in]
      `;
  const iconStyle =
    "text-primary group-hover:text-white [transition:color_200ms_ease-in]";
  const spanStyle =
    "text-primary font-semibold text-md group-hover:text-white [transition:color_200ms_ease-in]";

  return (
    <NextLink
      className={isActive ? nextLinkStyle + " bg-primary" : nextLinkStyle}
      href={path}
    >
      <Icon
        className={isActive ? iconStyle + " text-white" : iconStyle}
        size="1.25rem"
      />
      <span className={isActive ? spanStyle + " text-white" : spanStyle}>
        {name}
      </span>
    </NextLink>
  );
};

export const SignOutButton = () => {
  const buttonStyle = `
        group flex py-2 px-4 gap-4 rounded-md  
        hover:bg-primary [transition:background_200ms_ease-in]
      `;
  const iconStyle =
    "text-primary group-hover:text-white [transition:color_200ms_ease-in]";
  const spanStyle =
    "text-primary font-semibold text-md group-hover:text-white [transition:color_200ms_ease-in]";

  return (
    <button
      className={buttonStyle}
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <RiLogoutBoxRLine className={iconStyle} size="1.25rem" />
      <span className={spanStyle}>logout</span>
    </button>
  );
};
