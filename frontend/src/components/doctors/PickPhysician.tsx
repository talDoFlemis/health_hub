import React from "react";
import { IPhysician } from "@/types/physician";
import { Avatar } from "@chakra-ui/react";
import { CLIENT_SPECIALITES } from "@/utils/constants";

interface PickDoctorCardProps {
  physician: IPhysician;
  setSelectedPhysicianId: (id: number) => void;
  selected: boolean;
}

const PickDoctorCard = ({
  physician,
  setSelectedPhysicianId,
  selected,
}: PickDoctorCardProps) => {
  return (
    <>
      <button
        className={`hover flex w-full items-center gap-4 
        rounded-lg  px-4
        py-2 ${
          selected ? "bg-secondary" : "border border-description/30 bg-white"
        }
        `}
        onClick={(event) => {
          event.preventDefault();
          setSelectedPhysicianId(physician.id);
        }}
      >
        <Avatar name={physician.name} />
        <div>
          <h3
            className={`text-xl font-bold ${
              selected ? "text-white" : "text-primary"
            }`}
          >
            {physician.name}
          </h3>
          <h4
            className={`text-md text-left ${
              selected ? "text-white" : "text-description/70"
            }`}
          >
            {CLIENT_SPECIALITES.get(physician.specialty) ?? physician.specialty}
          </h4>
        </div>
      </button>
    </>
  );
};

interface PickPhysicianProps {
  physicians: IPhysician[];
  notFoundMsg: string | undefined;
  setSelectedPhysicianId: (id: number) => void;
  currentPhysician?: number;
}

const PickPhysician = ({
  physicians,
  setSelectedPhysicianId,
  notFoundMsg,
  currentPhysician,
}: PickPhysicianProps) => {
  const notFoundMensage = notFoundMsg ?? "Nenhum médico encontrado...";

  return (
    <div className="w-full rounded-lg border border-description/30">
      {physicians && physicians.length > 0 ? (
        <div className="grid w-full gap-2 px-4 py-4 lg:grid-cols-2">
          {physicians.map((physician) => {
            return (
              <PickDoctorCard
                key={physician.id}
                physician={physician}
                setSelectedPhysicianId={setSelectedPhysicianId}
                selected={currentPhysician === physician.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid w-full gap-2 px-4 py-4">
          <span className="py- w-full px-4 text-xl text-description/70">
            {notFoundMensage}
          </span>
        </div>
      )}
    </div>
  );
};

export default PickPhysician;
