import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IAttendant } from "@/types/attendant";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Skeleton,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import AttendantsList from "./AttendantsList"; 

const mockAttendants: IAttendant[] = [
  { 
    id: 1, 
    firstname: "gabrigas", 
    lastname: "brigas 1", 
    email: "example1@example.com", 
    dbo: new Date(),
    age: 18 
  },
  { 
    id: 2, 
    firstname: "gabrigas", 
    lastname: "brigas 2", 
    email: "example2@example.com", 
    dbo: new Date(),
    age: 18 
  },
  { 
    id: 3, 
    firstname: "gabrigas", 
    lastname: "brigas 3", 
    email: "example3@example.com", 
    dbo: new Date(),
    age: 18 
  },
  { 
    id: 4, 
    firstname: "gabrigas", 
    lastname: "brigas 4", 
    email: "example4@example.com", 
    dbo: new Date(),
    age: 18 
  },
]

interface NameSearchBar {
  name: string;
}

interface EmailSearchBar {
  email: string; 
}

interface AttendantsSearchBarProps {
  searchByName: (name: string) => void;
  searchByEmail: (email: string) => void;
  resetSearch: () => void;
}

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const AttendantsSearchBar = ({
  searchByName,
  searchByEmail,
  resetSearch,
}: AttendantsSearchBarProps) => {
  const [active, setActive] = useState<boolean>(false);
  const {
    register: registerName,
    reset: resetName,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors },
  } = useForm<NameSearchBar>();

  const {
    register: registerEmail,
    reset: resetEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailSearchBar>();

  const nameValid = nameErrors.name ? false : true;
  const emailValid = emailErrors.email ? false : true;

  const onNameSubmit = handleNameSubmit((data) => {
    searchByName(data.name);
    setActive(true);
  });

  const onEmailSubmit = handleEmailSubmit((data) => {
    searchByEmail(data.email);
    setActive(true);
  });

  const cleanSearchBar = () => {
    resetSearch();
    resetName();
    resetEmail();
    setActive(false);
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-white px-4 py-4 shadow-lg">
      <Tabs>
        <TabList>
          <Tab _selected={{ color: "#FF0077" }}>Nome</Tab>
          <Tab _selected={{ color: "#FF0077" }}>Email</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="#FF0077"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel py="1.5rem">
            <form className="flex flex-col gap-2" onSubmit={onNameSubmit}>
              <div className="flex items-center gap-3">
                <input
                  className="max-w-[400px] md:w-2/3 rounded-md border border-primary px-3 py-2 text-description/70 focus:outline-primary"
                  type="text"
                  placeholder="nome do atendente"
                  {...registerName("name", { required: true })}
                />
                {active && (
                  <button onClick={() => cleanSearchBar()}>
                    <AiOutlineClose
                      className="text-description/70 hover:text-accent"
                      size="1rem"
                    />
                  </button>
                )}
                <button className="cursor-pointer" type="submit">
                  <BsSearch className="text-primary" size="1.25rem" />
                </button>
              </div>
              {!nameValid && (
                <FormError message="O nome do atendente é necessário" />
              )}
            </form>
          </TabPanel>
          <TabPanel py="1.5rem">
            <form className="flex flex-col gap-2" onSubmit={onEmailSubmit}>
              <div className="flex items-center gap-3">
                <input
                  className="max-w-[400px] md:w-2/3 rounded-md border border-primary px-3 py-2 text-description/70 focus:outline-primary"
                  type="email"
                  placeholder="email do atendente"
                  {...registerEmail("email", { required: true })}
                />
                {active && (
                  <button onClick={() => cleanSearchBar()}>
                    <AiOutlineClose
                      className="text-description/70 hover:text-accent"
                      size="1rem"
                    />
                  </button>
                )}
                <button className="cursor-pointer" type="submit">
                  <BsSearch className="text-primary" size="1.25rem" />
                </button>
              </div>
              {!emailValid && (
                <FormError message="O email do atendente é necessário" />
              )}
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ); 
}

const AttendantsPanel = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const URL = "/api/attendant/all"
    + (name ? `?name=${name}` : "")
    + (email ? `?email=${email}` : "")

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
}

export default AttendantsPanel;










