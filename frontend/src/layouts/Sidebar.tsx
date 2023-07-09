import { FC } from "react";
import { Roles } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { sidebarItems, SidebarItem, SignOutButton } from "./SidebarItem"; 
import { BiPlusMedical } from "react-icons/bi";

interface SidebarProps {
  currentRoute: string;
}

const Sidebar: FC<SidebarProps> = ({ currentRoute }) => {
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

export default Sidebar;
