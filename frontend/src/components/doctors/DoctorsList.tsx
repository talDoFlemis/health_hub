import React from "react";
import { Avatar } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDisclosure } from "@chakra-ui/react";
import CreateDoctorModal from "./CreateDoctorModal";

const doctors = [
  { name: "gabrigas", specialty: "gynecologist" },
  { name: "john baiano", specialty: "baiano" },
  { name: "said", specialty: "fisioterapelta" },
  { name: "marcelo", specialty: "psychologist" },
  { name: "enzo", specialty: "personal trainer" },
  { name: "gabrigas", specialty: "gynecologist" },
  { name: "john baiano", specialty: "baiano" },
  { name: "said", specialty: "fisioterapelta" },
  { name: "marcelo", specialty: "psychologist" },
  { name: "enzo", specialty: "personal trainer" },
];

interface DoctorCardProps {
  name: string;
  specialty: string;
}

const DoctorCard = ({ name, specialty }: DoctorCardProps) => {
  return (
    <div className="flex w-full items-center gap-4 rounded-lg border border-description/30 px-4 py-2">
      <Avatar name={name} />
      <div>
        <h3 className="text-xl font-bold text-primary">{name}</h3>
        <h4 className="text-md text-description/70">{specialty}</h4>
      </div>
    </div>
  );
};

const DoctorsList = () => {
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
      {doctors.map((doctor, index) => {
        return (
          <DoctorCard
            key={doctor.name + doctor.specialty + index}
            name={doctor.name}
            specialty={doctor.specialty}
          />
        );
      })}
    </div>
  );
};

export default DoctorsList;
