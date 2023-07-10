import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { NextPageWithLayout } from './_app'
import React, {ReactElement, useState} from 'react'
import {useForm} from "react-hook-form";
import moment, {Moment} from "moment/moment";
import {Avatar, Button, Card, FormControl, FormLabel, Input, Select, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {useCustomQuery} from "@/hooks/useCustomQuery";
import {IPatient} from "@/types/patient";
import {IPhysician} from "@/types/physician";
import {IAppointment} from "@/types/appointment";
import {CLIENT_SPECIALITES} from "@/utils/constants";
import {AiOutlinePlus} from "react-icons/ai";
import {useRouter} from "next/router";

const SearchType = {
  patient: "PATIENT",
  physician: "PHYSICIAN",
  day: "DAY"
};

interface SearchBy {
  patientId: number | null,
  physicianId: number | null,
  day: Date | null,
  code: string | null
}

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const DefaultSearch = `api/appointment/all`;

const AppointmentCard = (appointment: IAppointment) => {
  return (
    <>
      <div
        className = {`flex w-full items-center rounded-lg 
          border border-description/30 
        `}
      >
        <div className={`
          flex w-1/2 h-full items-center justify-end bg-primary py-4 px-2 gap-4 bg-opacity-25
        `}>
          <Avatar name={appointment.physician.name} />
          <div className={"w-2/3"}>
            <h3 className="text-xl font-bold text-primary">{appointment.physician.name}</h3>
            <h4 className="text-md text-description/70">{
              CLIENT_SPECIALITES.get(appointment.physician.specialty) ?? appointment.physician.specialty
            }</h4>
          </div>
        </div>
        <div className={`
          flex w-1/2 h-full items-center justify-end bg-white py-4 px-2 gap-4
        `}>
          <Avatar name={appointment.patient.firstname + " " + appointment.patient.lastname} />
            <div className={"w-2/3"}>
              <h3 className="text-xl font-bold text-primary">{
                appointment.patient.firstname + " " + appointment.patient.lastname
              }</h3>
              <h4 className="text-md text-description/70">{
                `Consulta dia: ${appointment.time}`
              }</h4>
            </div>
        </div>
      </div>
    </>
  );
};

const Appointments: NextPageWithLayout = () => {
  const router = useRouter();
  const {
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<SearchBy>();
  const [dayState, setDayState] = useState<Date | null>(null);
  const betweenURLCalc = (dateStart: Date, dateEnd: Date) => {
    const start = moment(dateStart).startOf("day");
    const end = moment(dateEnd).startOf("day").add(1, "days");

    return (`start=${start.toISOString()}&end=${end.toISOString()}`);
  };

  const [physicianIdState, setPhysicianIdState] = useState<number | null>(null);
  const byPhysicianUrl = (physicianId: number | null) => (
    physicianId ? (
      `/api/appointment/physician/${physicianId}`
      ) : null
  );

  const [patientIdState, setPatientIdState] = useState<number | null>(null);
  const byPatientUrl = (patientId: number | null) => (
    patientId ? (
    `/api/appointment/patient/${patientId}`
    ) : null
  );

  const [codeState, setCodeState] = useState<string | null>(SearchType.day);
  const makeUrl = (
    code: string | null,
  ) => {


    if (code === null) {
      console.log(patientIdState, physicianIdState, dayState);
    }

    if (code === SearchType.patient) {
      return byPatientUrl(patientIdState) ?? DefaultSearch;
    }

    if (code === SearchType.physician) {
      return byPhysicianUrl(physicianIdState) ?? DefaultSearch;
    }

    // if (code === SearchType.day) {
    //   return betweenURLCalc(dayState) ?? DefaultSearch;
    // }

    return DefaultSearch;
  };

  const { data: queryResult} = useCustomQuery<IAppointment[]>(
    "/api/appointment/all"
  );
    // useCustomQuery<IAppointment[]>(makeUrl(codeState));


  const fixedQueryPhysicians = useCustomQuery<IPhysician[]>(
    "/api/physician"
  ).data;

  const fixedQueryPatients = useCustomQuery<IPatient[]>(
    "/api/patient/all"
  ).data;

  const [invalidPhysician, setInvalidPhysician] = useState(false);
  const [invalidPatient, setInvalidPatient] = useState(false);
  const [invalidDay, setInvalidDay] = useState(false);

  return (<>
    <Head>
        <title>Health Hub - Consultas</title>
    </Head>
    <main>
      <div className="flex flex-col p-8">
        <div className="flex w-full flex-col rounded-lg bg-white px-4 py-4 shadow-lg">
          <form
            onSubmit={handleSubmit(
              (event) => {
                console.log();
                setCodeState(
                  event.day ? (SearchType.day) : (
                    event.patientId ? (SearchType.physician) : (
                      event.physicianId ? (SearchType.patient) : null
                    )
                  )
                );
              }
            )}
            id="form"
            className="flex flex-col gap-4"
          >
            <FormControl>
              <FormLabel className="text-description/70" mb={1}>
                Filtre por Paciente:
              </FormLabel>
              <Select placeholder={"Escolha um Paciente"}
                {...register("patientId",
                  {
                    required: false,
                    onChange: (event) => {
                      setValue("patientId", event.target.value.length > 0 ? (
                          event.target.value
                        ) : null
                      );
                      setValue("physicianId", null);
                      setInvalidPatient(false);
                    }
                  })
                }
              >
                {fixedQueryPatients && fixedQueryPatients.map((patient) => {
                  return (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstname + patient.lastname}
                    </option>
                  );
                })}
              </Select>
              {invalidPatient && (
                <FormError message="Escolha apenas um filtro"/>
              )}
            </FormControl>

            <FormControl>
              <FormLabel className="text-description/70" mb={1}>
                Filtre por Médico:
              </FormLabel>
              <Select placeholder={"Escolha um Médico"}
                {...register("physicianId",
                  {
                    required: false,
                    onChange: (event) => {
                      setValue("physicianId", event.target.value.length > 0 ? (
                          event.target.value
                        ) : null
                      );
                      setValue("patientId", null);
                      setInvalidPatient(false);
                    }
                  })
                }
              >
                {fixedQueryPhysicians && fixedQueryPhysicians.map((physician) => {
                  return (
                    <option key={physician.id} value={physician.id}>
                      {physician.name}
                    </option>
                  );
                })}
              </Select>
              {invalidPhysician && (
                <FormError message="Escolha apenas um filtro"/>
              )}
            </FormControl>


            <FormControl>
              <FormLabel className="text-description/70" mb={1}>
                Escolha o dia:
              </FormLabel>
              <Input
                 placeholder="Select Date and Time"
                 size="md"
                 type="datetime-local"
                 {...register("day", {required: true})
              }/>
            </FormControl>

            <Button colorScheme="green" mr={3} type="submit" form="form">
              Buscar Consulta
            </Button>
          </form>
        </div>
      </div>




      <div className={"grid w-full gap-2 rounded-lg bg-white px-4 py-4 shadow-lg lg:grid-cols-2"}>
        <div className="flex items-center lg:col-span-full">
          <h1 className="mb-4 text-5xl font-bold text-primary">Consultas</h1>
        </div>
          {queryResult && queryResult.length > 0 ? (
            queryResult.map((appointment) => {
              return (
                <AppointmentCard
                  {...appointment}
                  key={appointment.id}
                />
              );
            })
          ) : (
              <span className="py-4 px-2 text-description/70 text-xl">
                Nenhuma Consulta Encontrada
              </span>
            )}
      </div>
    </main>
  </>)
}

Appointments.getLayout = function getLayout(page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}

export default Appointments