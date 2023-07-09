import React, { useState } from "react";
import { IAttendant } from "@/types/attendant";
import { Skeleton } from "@chakra-ui/react";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import AttendantsList from "./AttendantsList";
import AttendantsSearchBar from "./AttendantsSearchBar";

const AttendantsPanel = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const URL =
    "/api/attendant/all" +
    (name ? `?name=${name}` : "") +
    (email ? `?email=${email}` : "");

  const searchByName = (name: string) => {
    setName(name);
    setEmail("");
  };

  const searchByEmail = (email: string) => {
    setEmail(email);
    setName("");
  };

  const resetSearch = () => {
    setName("");
    setEmail("");
  };

  const { data: attendants, mutate } = useCustomQuery<IAttendant[]>(URL);
  return (
    <div className="flex flex-col gap-8">
      <AttendantsSearchBar
        resetSearch={resetSearch}
        searchByName={searchByName}
        searchByEmail={searchByEmail}
      />
      {attendants ? (
        <AttendantsList attendants={attendants} mutate={mutate} />
      ) : (
        <Skeleton height="140px" width="100%" />
      )}
    </div>
  );
};

export default AttendantsPanel;
