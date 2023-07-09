import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

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
};

export default AttendantsSearchBar;
