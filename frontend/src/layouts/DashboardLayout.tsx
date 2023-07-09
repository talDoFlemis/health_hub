import { ReactElement, FC } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SideDrawer from "./SideDrawer";

const inter = Inter({ subsets: ["latin"] });

interface DashboardLayoutProps {
  children: ReactElement;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pathname } = useRouter();

  const wrapperStyle = "min-h-screen w-full bg-gray-200 pt-[80px] md:w-[calc(100% - 250px)] md:pl-[250px]";

  return (
    <>
      <Header openSidebar={onOpen} />
      <Sidebar currentRoute={pathname} />
      <SideDrawer isOpen={isOpen} onClose={onClose} currentRoute={pathname} /> 
      <div className={`${wrapperStyle} ${inter.className}`}>
        {children}
      </div>
    </>
  );
};

export default DashboardLayout;
