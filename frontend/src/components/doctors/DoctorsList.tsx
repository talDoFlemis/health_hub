import React from "react";
import { Avatar } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosure } from "@chakra-ui/react";
import CreateDoctorModal from "./CreateDoctorModal";
import EditDoctorModal from "./EditDoctorModal";
import DeleteDoctorAlert from "./DeleteDoctorAlert";
import { AiOutlineClose } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { IPhysician } from "@/types/physician";
import { Roles } from "@/utils/constants";
import { useSession } from "next-auth/react";

interface DoctorCardProps {
  role: Roles;
  doctor: IPhysician;
  doctors: IPhysician[];
  mutate: (args: any) => void;
}

const DoctorCard = ({ role, doctor, doctors, mutate }: DoctorCardProps) => {
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

  return (
    <>
      <EditDoctorModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        doctor={doctor}
        doctors={doctors}
        mutate={mutate}
      />
      <DeleteDoctorAlert
        id={doctor.id}
        name={doctor.name}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      />
      <div className="flex w-full items-center gap-4 rounded-lg border border-description/30 px-4 py-2">
        <Avatar name={doctor.name} />
        <div>
          <h3 className="text-xl font-bold text-primary">{doctor.name}</h3>
          <h4 className="text-md text-description/70">{doctor.specialty}</h4>
        </div>
        {role === Roles.Admin && (
          <>
            <button className="ml-auto self-start" onClick={onEditOpen}>
              <BiPencil className="text-description/70 hover:text-primary" />
            </button>
            <button className="self-start" onClick={onDeleteOpen}>
              <AiOutlineClose className="text-sm text-description/70 hover:text-accent" />
            </button>
          </>
        )} 
      </div>
    </>
  );
};

interface DoctorsListProps {
  doctors: IPhysician[];
  mutate: (args: any) => void;
}

const DoctorsList = ({ doctors, mutate }: DoctorsListProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const role = useSession().data?.user.role as Roles;

  return (
    <div className="grid w-full gap-2 rounded-lg bg-white px-4 py-4 shadow-lg lg:grid-cols-2">
      <CreateDoctorModal
        doctors={doctors}
        mutate={mutate}
        isOpen={isOpen}
        onClose={onClose}
      />
      <div className="flex items-center lg:col-span-full">
        <h1 className="mb-4 text-5xl font-bold text-primary">Médicos</h1>
        {role === Roles.Admin && (
          <button
            className="ml-auto flex gap-2 rounded-lg bg-green-500 px-4 py-2"
            onClick={onOpen}
          >
            <span className="text-sm text-white">Novo</span>
            <AiOutlinePlus className="text-white" size="1.25rem" />
          </button>
        )}
      </div>
      {doctors.length > 0 ? (
        doctors.map((doctor) => {
          return (
            <DoctorCard
              key={doctor.id}
              role={role}
              doctor={doctor}
              doctors={doctors}
              mutate={mutate}
            />
          );
        })
      ) : (
        <span className="py-4 px-2 text-description/70 text-xl">
          Nenhum médico encontrado...
        </span>
      )}
    </div>
  );
};

export default DoctorsList;
