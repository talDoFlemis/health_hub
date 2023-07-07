import React from "react";
import { useForm } from "react-hook-form";
import { SPECIALTIES } from "@/utils/constants";
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
import DoctorsList from "./DoctorsList";

interface NameSearchBar {
  name: string;
}

interface SpecialtySearchBar {
  specialty: Specialty;
}

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const DoctorsSearchbar = () => {
  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors },
  } = useForm<NameSearchBar>();

  const {
    register: registerSpecialty,
    handleSubmit: handleSpecialtySubmit,
    formState: { errors: specialtyErrors },
  } = useForm<SpecialtySearchBar>();

  const inputValid = nameErrors.name ? false : true;
  const selectValid = specialtyErrors.specialty ? false : true;

  const onNameSubmit = handleNameSubmit((data) => console.log(data));
  const onSpecialtySubmit = handleSpecialtySubmit((data) => console.log(data));

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

const DoctorsPanel = () => {
  return (
    <div className="flex flex-col gap-8">
      <DoctorsSearchbar />
      <DoctorsList />
    </div>
  );
};

export default DoctorsPanel;
