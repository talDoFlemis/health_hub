import { FC } from "react";
import { BiPlusMedical } from "react-icons/bi";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { sidebarItems, SidebarItem, SignOutButton } from "./SidebarItem";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

const SideDrawer: FC<SideDrawerProps> = ({ isOpen, onClose, currentRoute }) => {
  return (
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
                  currentRoute.split("/")[1] === link.path.split("/")[1];

                return (
                  <SidebarItem key={link.name} isActive={isActive} {...link} />
                );
              })}
              <SignOutButton />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  );
}

export default SideDrawer;
