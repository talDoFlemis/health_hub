import NextLink from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { FiMenu } from "react-icons/fi";
import { BiPlusMedical } from "react-icons/bi";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { BsFillCalendarDayFill } from "react-icons/bs";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { type IconType } from "react-icons";
import {
  Avatar,
  AvatarBadge,
  IconButton,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactElement, FC } from "react";
import { useSession, signOut } from "next-auth/react";
import { Roles, roleToName } from "@/utils/constants";
import { PiFolderSimpleUserBold } from "react-icons/pi";

const inter = Inter({ subsets: ["latin"] });

interface SidebarItemProps {
  name: string;
  Icon: IconType;
  path: string;
  isActive?: boolean;
  roles: Roles[];
}

const sidebarItems: SidebarItemProps[] = [
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
    Icon: FaUserFriends,
    path: "/patients",
    roles: [Roles.Admin, Roles.Attendant],
  },
  {
    name: "Médicos",
    Icon: FaUserDoctor,
    path: "/doctors",
    roles: [Roles.Admin, Roles.Attendant],
  },
];

const SidebarItem: FC<SidebarItemProps> = ({ name, Icon, path, isActive }) => {
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

const SignOutButton = () => {
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

interface HeaderProps {
  openSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ openSidebar }) => {
  const { data: session } = useSession();
  return (
    <div className="fixed right-0 top-0 z-10 flex h-[80px] w-full items-center justify-between border-b border-gray-300 bg-white px-5">
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={() => openSidebar()}
        variant="outline"
        aria-label="open sidebar"
        icon={<FiMenu size="1.25rem" />}
      />
      <div className="mx-auto flex items-center md:hidden">
        <h2 className="text-3xl text-primary">HH</h2>
        <BiPlusMedical className="text-primary" size="1.5rem" />
      </div>
      <div className="flex items-center gap-4 md:ml-auto">
        <Avatar boxSize="2.25rem" name={session?.user.name}>
          <AvatarBadge boxSize="1rem" bg="green.500" />
        </Avatar>
        <div className="hidden md:block">
          <h3 className="text-sm font-bold text-primary">
            {session?.user.name}
          </h3>
          <h4 className="text-xs text-description">
            {roleToName(session?.user.role as Roles)}
          </h4>
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  currentRoute: string;
}

const SideBar: FC<SidebarProps> = ({ currentRoute }) => {
  const role = useSession().data?.user.role as Roles;
  return (
    <div
      className={`
      fixed left-0 top-0 z-10 hidden
      h-full w-[250px] flex-col border-r 
      border-gray-300 bg-white px-4
      py-4 md:flex 
    `}
    >
      <div className="my-2 flex items-center gap-2">
        <h1 className="text-3xl font-bold text-primary">Health Hub</h1>
        <BiPlusMedical className="text-primary" size="1.5rem" />
      </div>
      <div className="flex flex-col gap-2 py-4">
        {sidebarItems
          .filter((item) => item.roles.includes(role))
          .map((link) => {
            const isActive =
              currentRoute.split("/")[1] === link.path.split("/")[1];

            return (
              <SidebarItem key={link.name} isActive={isActive} {...link} />
            );
          })}
        <SignOutButton />
      </div>
    </div>
  );
};

interface DashboardLayoutProps {
  children: ReactElement;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useRouter();

  return (
    <>
      <Header openSidebar={onOpen} />
      <SideBar currentRoute={pathname} />
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="full">
        <DrawerContent>
          <DrawerCloseButton mt={2} />
          <DrawerHeader>
            <div className="my-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold text-primary">Health Hub</h1>
              <BiPlusMedical className="text-primary" size="1.5rem" />
            </div>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-2 py-4">
              {sidebarItems.map((link) => {
                const isActive =
                  pathname.split("/")[1] === link.path.split("/")[1];

                return (
                  <SidebarItem key={link.name} isActive={isActive} {...link} />
                );
              })}
              <SignOutButton />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div
        className={`md:w-[calc(100% - 250px)] min-h-screen w-full bg-gray-200 pt-[80px] md:pl-[250px] ${inter.className}`}
      >
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
