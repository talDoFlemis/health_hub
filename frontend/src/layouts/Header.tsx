import { FC } from "react";
import { IconButton, Avatar, AvatarBadge } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FiMenu } from "react-icons/fi";
import { BiPlusMedical } from "react-icons/bi";
import { Roles, roleToName } from "@/utils/constants";

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

export default Header;
