import React, {useState} from "react";
import {IPhysician, Specialty} from "@/types/physician";
import {useCustomQuery} from "@/hooks/useCustomQuery";
import {Avatar, Button, Select} from "@chakra-ui/react";
import {SPECIALTIES, CLIENT_SPECIALITES} from "@/utils/constants";
import {AiOutlineClose} from "react-icons/ai";
import {BsSearch} from "react-icons/bs";
import {BiPencil} from "react-icons/bi";
interface PickDoctorCardProps {
  physician: IPhysician;
  setSelectedPhysicianId: (id: number) => void;
}

const PickDoctorCard = ({ physician, setSelectedPhysicianId,  }: PickDoctorCardProps) => {
  return (
    <>
      <button
        className = "flex w-full items-center gap-4 rounded-lg border border-description/30 px-4 py-2"
        onClick={(event) => {
          event.preventDefault();
          setSelectedPhysicianId(physician.id);
        }}
      >
        <Avatar name={physician.name} />
        <div>
          <h3 className="text-xl font-bold text-primary">{physician.name}</h3>
          <h4 className="text-md text-description/70">{CLIENT_SPECIALITES.get(physician.specialty) ?? physician.specialty}</h4>
        </div>
      </button>
    </>
  );
};

interface PickPhysicianProps {
  physicians: IPhysician[];
  notFoundMsg: string | undefined;
  setSelectedPhysicianId: (id: number) => void;
}

const PickPhysician = ({ physicians, setSelectedPhysicianId, notFoundMsg }: PickPhysicianProps) => {
  const notFoundMensage = notFoundMsg ?? "Nenhum médico encontrado..."

  return (
    <div className="w-full rounded-lg border border-description/30">
      {/*<div className="flex items-center lg:col-span-full">*/}
      {/*  <h1 className="mb-4 text-5xl font-bold text-primary">Médicos</h1>*/}
      {/*</div>*/}
      {(physicians && physicians.length > 0) ? (
        <div className="grid w-full gap-2 px-4 py-4 lg:grid-cols-2">
          {physicians.map((physician) => {
            return (
              <PickDoctorCard
                key={physician.id}
                physician={physician}
                setSelectedPhysicianId={setSelectedPhysicianId}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid w-full gap-2 px-4 py-4">
          <span className="w-full py- px-4 text-description/70 text-xl">
            {notFoundMensage}
          </span>
        </div>
      )}
    </div>
  );
};

export default PickPhysician;