import React from "react";
import { Avatar } from "@chakra-ui/react"

interface DoctorCardProps {
  name: string
  specialty: string
}

const DoctorCard = ({ name, specialty }: DoctorCardProps) => {
  return (
    <div className="flex items-center w-full gap-4 py-2 px-4 border border-description/30 rounded-lg">
      <Avatar name={name}/>
      <div>
        <h3 className="text-primary font-bold text-xl">
          {name}
        </h3>
        <h4 className="text-description/70 text-md">{specialty}</h4>
      </div>
    </div>
  )
}

const DoctorsList = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-2 w-full rounded-lg bg-white px-4 py-4 shadow-lg">
      <DoctorCard name="gabrigas" specialty="gynecologist" />
      <DoctorCard name="john baiano" specialty="baiano" />
      <DoctorCard name="said" specialty="fisioterapelta" />
      <DoctorCard name="marcelo" specialty="psychologist" />
      <DoctorCard name="enzo" specialty="personal trainer" />
      <DoctorCard name="gabrigas" specialty="gynecologist" />
      <DoctorCard name="john baiano" specialty="baiano" />
      <DoctorCard name="said" specialty="fisioterapelta" />
      <DoctorCard name="marcelo" specialty="psychologist" />
      <DoctorCard name="enzo" specialty="personal trainer" />
    </div>
  )
}

export default DoctorsList;