import NextLink from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { FiMenu } from "react-icons/fi";
import { BiPlusMedical } from "react-icons/bi";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { BsFillCalendarDayFill } from "react-icons/bs";
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

const inter = Inter({ subsets: ["latin"] });

interface SidebarItemProps {
  name: string;
  Icon: IconType;
  path: string;
  isActive?: boolean;
}

const sidebarItems: SidebarItemProps[] = [
  { name: "Home", Icon: FaHome, path: "/" },
  { name: "Consultas", Icon: BsFillCalendarDayFill, path: "/appointments" },
  { name: "Pacientes", Icon: FaUserFriends, path: "/patients" },
  { name: "Médicos", Icon: FaUserDoctor, path: "/doctors" },
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

interface HeaderProps {
  openSidebar: () => void;
}

const Header: FC<HeaderProps> = ({ openSidebar }) => {
  return (
    <div className="fixed top-0 right-0 flex items-center justify-between w-full h-[80px] px-5 bg-white border-b border-gray-300">
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={() => openSidebar()}
        variant="outline"
        aria-label="open sidebar"
        icon={<FiMenu size="1.25rem" />}
      />
      <div className="flex items-center mx-auto md:hidden">
        <h2 className="text-3xl text-primary">HH</h2>
        <BiPlusMedical className="text-primary" size="1.5rem" />
      </div>
      <div className="flex items-center gap-4 md:ml-auto">
        <Avatar boxSize="2.25rem" name="attendant">
          <AvatarBadge boxSize="1rem" bg="green.500" />
        </Avatar>
        <div className="hidden md:block">
          <h3 className="text-sm text-primary font-bold">Gabrigas</h3>
          <h4 className="text-xs text-description">Atendente</h4>
        </div>
      </div>
    </div>
  );
};

interface SidebarProps {
  currentRoute: string;
}

const SideBar: FC<SidebarProps> = ({ currentRoute }) => {
  return (
    <div
      className={`
      hidden fixed md:flex flex-col 
      top-0 left-0 h-full w-[250px] 
      bg-white border-r border-gray-300
      py-4 px-4 
    `}
    >
      <div className="flex items-center gap-2 my-2">
        <h1 className="text-3xl text-primary font-bold">Health Hub</h1>
        <BiPlusMedical className="text-primary" size="1.5rem" />
      </div>
      <div className="flex flex-col py-4 gap-2">
        {sidebarItems.map((link) => {
          const isActive = currentRoute === link.path;

          return <SidebarItem key={link.name} isActive={isActive} {...link} />;
        })}
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
            <div className="flex items-center gap-2 my-2">
              <h1 className="text-3xl text-primary font-bold">Health Hub</h1>
              <BiPlusMedical className="text-primary" size="1.5rem" />
            </div>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col py-4 gap-2">
              {sidebarItems.map((link) => {
                const isActive = pathname === link.path;

                return (
                  <SidebarItem key={link.name} isActive={isActive} {...link} />
                );
              })}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div
        className={`w-full md:w-[calc(100% - 250px)] min-h-screen bg-gray-200 pt-[80px] md:pl-[250px] ${inter.className}`}
      >
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
