import React, { useState } from "react";
import { Specialty, IPhysician } from "@/types/physician";
import { Skeleton } from "@chakra-ui/react";
import DoctorsList from "./DoctorsList";
import DoctorsSearchBar from "./DoctorsSearchBar";
import { useCustomQuery } from "@/hooks/useCustomQuery";

const DoctorsPanel = () => {
  const [name, setName] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");

  const URL =
    "/api/physician" +
    (specialty ? `?specialty=${specialty}` : "") +
    (name ? `?name=${name}` : "");

  const searchByName = (name: string) => {
    setName(name);
    setSpecialty("");
  };

  const searchBySpecialty = (specialty: Specialty) => {
    setSpecialty(specialty);
    setName("");
  };

  const resetSearch = () => {
    setName("");
    setSpecialty("");
  };

  const { data: doctors, mutate } = useCustomQuery<IPhysician[]>(URL);

  return (
    <div className="flex flex-col gap-8">
      <DoctorsSearchBar
        resetSearch={resetSearch}
        searchByName={searchByName}
        searchBySpecialty={searchBySpecialty}
      />
      {doctors ? (
        <DoctorsList doctors={doctors} mutate={mutate} />
      ) : (
        <Skeleton height="140px" width="100%" />
      )}
    </div>
  );
};

export default DoctorsPanel;
