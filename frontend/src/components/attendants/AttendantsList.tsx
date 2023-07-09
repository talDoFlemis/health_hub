import React from "react";
import { Avatar } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosure } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { IAttendant } from "@/types/attendant";
import CreateAttendantModal from "./CreateAttendantModal";
import EditAttendantModal from "./EditAttendantModal";
import DeleteAttendantAlert from "./DeleteAttendantAlert";

interface AttendantCardProps {
  attendant: IAttendant;
  attendants: IAttendant[];
  mutate: (args: any) => void;
}

const AttendantCard = ({
  attendant,
  attendants,
  mutate,
}: AttendantCardProps) => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const attendantName = `${attendant.firstname} ${attendant.lastname}`;

  return (
    <>
      <EditAttendantModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        mutate={mutate}
        attendant={attendant}
        attendants={attendants}
      />
      <DeleteAttendantAlert
        id={attendant.id}
        name={attendantName}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      />
      <div className="flex w-full items-center gap-4 rounded-lg border border-description/30 px-4 py-2">
        <Avatar name={attendantName} />
        <div>
          <h3 className="text-xl font-bold text-primary">{attendantName}</h3>
          <h4 className="text-md text-description/70">{attendant.email}</h4>
        </div>
        <button className="ml-auto self-start" onClick={onEditOpen}>
          <BiPencil className="text-description/70 hover:text-primary" />
        </button>
        <button className="self-start" onClick={onDeleteOpen}>
          <AiOutlineClose className="text-sm text-description/70 hover:text-accent" />
        </button>
      </div>
    </>
  );
};

interface AttendantsListProps {
  attendants: IAttendant[];
  mutate: (args: any) => void;
}

const AttendantsList = ({ attendants, mutate }: AttendantsListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="grid w-full gap-2 rounded-lg bg-white px-4 py-4 shadow-lg lg:grid-cols-2">
      <CreateAttendantModal
        attendants={attendants}
        mutate={mutate}
        isOpen={isOpen}
        onClose={onClose}
      />
      <div className="flex items-center lg:col-span-full">
        <h1 className="mb-4 text-5xl font-bold text-primary">Atendentes</h1>
        <button
          className="ml-auto flex gap-2 rounded-lg bg-green-500 px-4 py-2"
          onClick={onOpen}
        >
          <span className="text-sm text-white">Novo</span>
          <AiOutlinePlus className="text-white" size="1.25rem" />
        </button>
      </div>
      {attendants.length > 0 ? (
        attendants.map((attendant) => {
          return (
            <AttendantCard
              key={attendant.id}
              attendant={attendant}
              attendants={attendants}
              mutate={mutate}
            />
          );
        })
      ) : (
        <span className="py-4 px-2 text-description/70 text-xl">
          Nenhum atendente encontrado...
        </span>
      )}
    </div>
  );
};

export default AttendantsList;
