import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Specialty } from "@/types/physician";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Select,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { SPECIALTIES } from "@/utils/constants";

interface NameSearchBar {
  name: string;
}

interface SpecialtySearchBar {
  specialty: Specialty;
}

interface DoctorsSearchBarProps {
  searchByName: (name: string) => void;
  searchBySpecialty: (specialty: Specialty) => void;
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

const DoctorsSearchBar = ({
  searchByName,
  searchBySpecialty,
  resetSearch,
}: DoctorsSearchBarProps) => {
  const [active, setActive] = useState<boolean>(false);
  const {
    register: registerName,
    reset: resetName,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors },
  } = useForm<NameSearchBar>();

  const {
    register: registerSpecialty,
    reset: resetSpecialty,
    handleSubmit: handleSpecialtySubmit,
    formState: { errors: specialtyErrors },
  } = useForm<SpecialtySearchBar>();

  const inputValid = nameErrors.name ? false : true;
  const selectValid = specialtyErrors.specialty ? false : true;

  const onNameSubmit = handleNameSubmit((data) => {
    searchByName(data.name);
    setActive(true);
  });

  const onSpecialtySubmit = handleSpecialtySubmit((data) => {
    searchBySpecialty(data.specialty);
    setActive(true);
  });

  const cleanSearchBar = () => {
    resetSearch();
    resetName();
    resetSpecialty();
    setActive(false);
  };

  return (
    <div className="flex w-full flex-col rounded-lg bg-white px-4 py-4 shadow-lg">
      <Tabs>
        <TabList>
          <Tab _selected={{ color: "#FF0077" }}>Nome</Tab>
          <Tab _selected={{ color: "#FF0077" }}>Especialidade</Tab>
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
                  placeholder="nome do médico"
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
              {!inputValid && (
                <FormError message="O nome do médico é necessário" />
              )}
            </form>
          </TabPanel>
          <TabPanel py="1.5rem">
            <form className="flex flex-col gap-2" onSubmit={onSpecialtySubmit}>
              <div className="flex items-center gap-3 w-full lg:w-2/3 max-w-[400px]">
                <Select
                  placeholder="especialidade"
                  {...registerSpecialty("specialty", { required: true })}
                >
                  {SPECIALTIES.map((especialty, index) => {
                    return (
                      <option key={especialty + index} value={especialty}>
                        {especialty.toLowerCase()}
                      </option>
                    );
                  })}
                </Select>
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
              {!selectValid && (
                <FormError message="A especialidade do médico é necessária" />
              )}
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default DoctorsSearchBar;
