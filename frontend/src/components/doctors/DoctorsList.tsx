import React from "react";
import { Avatar } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosure } from "@chakra-ui/react";
import CreateDoctorModal from "./CreateDoctorModal";
import EditDoctorModal from "./EditDoctorModal";
import DeleteDoctorAlert from "./DeleteDoctorAlert";
import { AiOutlineClose } from "react-icons/ai";
import { BiPencil } from "react-icons/bi";
import { Specialty } from "@/utils/constants";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { IPhysician } from "@/types/physician";

interface DoctorCardProps {
  id: number;
  name: string;
  email: string;
  specialty: Specialty;
}

const doctors: IPhysician[] = [
  { id: 1, name: "gabrigas", email: "example@example.com", specialty: "Ginecologista" },
  { id: 2, name: "john baiano", email: "example@example.com", specialty: "Cardiologista" },
  { id: 3, name: "said", email: "example@example.com", specialty: "Psiquiatra" },
  { id: 4, name: "marcelo", email: "example@example.com", specialty: "Psiquiatra" },
  { id: 5, name: "enzo", email: "example@example.com", specialty: "Neuroradiologista" },
  { id: 6, name: "gabrigas", email: "example@example.com", specialty: "Pediatra" },
  { id: 7, name: "john baiano", email: "example@example.com", specialty: "Pediatra" },
  { id: 8, name: "said", email: "example@example.com", specialty: "Urologista" },
  { id: 9, name: "marcelo", email: "example@example.com", specialty: "Cardiologista" },
  { id: 10, name: "enzo", email: "example@example.com", specialty: "Urologista" },
];

const DoctorCard = ({ id, name, email, specialty }: DoctorCardProps) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  return (
    <>
      <EditDoctorModal 
        isOpen={isEditOpen}
        onClose={onEditClose}
        name={name}
        email={email}
        specialty={specialty}
      />
      <DeleteDoctorAlert 
        id={id}
        name={name}
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      />
      <div className="flex w-full items-center gap-4 rounded-lg border border-description/30 px-4 py-2">
        <Avatar name={name} />
        <div>
          <h3 className="text-xl font-bold text-primary">{name}</h3>
          <h4 className="text-md text-description/70">{specialty}</h4>
        </div>
        <button className="ml-auto self-start" onClick={onEditOpen}>
          <BiPencil
            className="text-description/70 hover:text-primary"
          />
        </button>
        <button className="self-start" onClick={onDeleteOpen}>
          <AiOutlineClose
            className="text-description/70 text-sm hover:text-accent"
          />
        </button>
      </div>
    </>
  );
};

const DoctorsList = () => {
  // const { data: doctors, mutate } = useCustomQuery<IPhysician[]>("/api/psysician")

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="grid w-full gap-2 rounded-lg bg-white px-4 py-4 shadow-lg lg:grid-cols-2">
      <CreateDoctorModal isOpen={isOpen} onClose={onClose} />
      <div className="flex items-center lg:col-span-full">
        <h1 className="mb-4 text-5xl font-bold text-primary">Médicos</h1>
        <button
          className="ml-auto flex gap-2 rounded-lg bg-green-500 px-4 py-2"
          onClick={onOpen}
        >
          <span className="text-sm text-white">Novo</span>
          <AiOutlinePlus className="text-white" size="1.25rem" />
        </button>
      </div>
      {doctors.map((doctor) => {
        return (
          <DoctorCard
            key={doctor.id}
            id={doctor.id}
            name={doctor.name}
            email={doctor.email}
            specialty={doctor.specialty}
          />
        );
      })}
    </div>
  );
};

export default DoctorsList;
