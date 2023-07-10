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
import {API_URL, CLIENT_SPECIALITES} from "@/utils/constants";
import {AiOutlinePlus} from "react-icons/ai";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import useCustomToast from "@/hooks/useCustomToast";

enum SearchType {
  patient="PATIENT",
  physician="PHYSICIAN",
  all="ALL"
}

interface SearchBy {
  code: SearchType
  id: number | undefined
  between: {
    start: Date,
    end: Date,
    confirm: boolean
  } | undefined
}

const ArraySearchType = [
  SearchType.patient,
  SearchType.physician,
  SearchType.all
]

const ClientSearchType: Map<SearchType, string> = new Map([
  [SearchType.patient, "Filtrar Consultas por Paciente"],
  [SearchType.physician, "Filrat consultas por Médico"],
  [SearchType.all, "Todas as Consultas"]
]);

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
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const makeUrl = (
    code: SearchType,
    id?: number | undefined,
    between?: {
      start: Date,
      end: Date,
      confirm: boolean
    } | undefined
  ) => {
    let url = "/api/appointment/";
    const defaultUrl = url + "all";

    if (code === SearchType.all) {
      return defaultUrl;
    }

    if (code === SearchType.patient) {
      url = url + "patient/" + ((id && !between) ? id.toString() : "");
    } else if (code === SearchType.physician) {
      url = url + "physician/" + ((id && !between) ? id.toString() : "");
    }

    if (between) {
      const start = moment(between.start).startOf("day");
      const end = moment(between.end).startOf("day").add(1, "days");
      const betweenStrChange = `between/${id ? id.toString() : ""}?start=${start.toISOString()}&end=${end.toISOString()}`;

      return (url + betweenStrChange);
    }

    return defaultUrl;
  }

  const [urlState, setUrlState] = useState<string>(makeUrl(SearchType.all));
  const { data: queryResult, mutate, error} =
    useCustomQuery<IAppointment[]>(urlState);

  const onSubmit = async (search: SearchBy) => {
    setUrlState(
      makeUrl(
        search.code, search.id, search.between
      )
    )

    if (error) {
      showErrorToast("Nao Foi Possível Realizar Sua Pesquisa", error.message);
    } else {
      showSuccessToast("Pesquisa Realizada Com Sucesso");
    }
    reset();
  }

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
            onSubmit={handleSubmit(onSubmit)}
            id="form"
            className="flex flex-col gap-4"
          >
            <FormControl>
              <FormLabel className="text-description/70" mb={1}>
                Escolha o Formato da Pesquisa
              </FormLabel>
              <Select placeholder={"Escolha o formato da pesquisa"}
                {...register("code", {required: true})}
                onChange={() => {
                  reset();
                }}
              >
                {ArraySearchType.map((type, index) => {
                  return (
                    <option key={index} value={type}>
                      {ClientSearchType.get(type) ?? type}
                    </option>
                  );
                })}
              </Select>
              {invalidPatient && (
                <FormError message="É preciso escolher o formato da pesquisa"/>
              )}
            </FormControl>

            <FormControl
              isDisabled={(
                getValues("code") !== SearchType.patient && getValues("code") !== SearchType.physician
              )}
              >
                <FormLabel className="text-description/70" mb={1}>
                  Filtre por {ClientSearchType.get(getValues("code"))}
                </FormLabel>
                <Select
                  placeholder={
                  (getValues("code") === SearchType.patient) ? (
                    "Escolha um Paciente"
                    ) : (
                      getValues("code") === SearchType.physician ? (
                        "Escolha um Médico"
                      ) : (
                        "------------------"
                      )
                    )
                  }
                  {...register("id")}
                >
                  {(getValues("code") !== SearchType.physician ? (
                      fixedQueryPatients
                    ) : (
                      fixedQueryPhysicians
                    ))?.map((data) => {
                      const numId: number = data.id;
                      const name: string = getValues("code") === SearchType.physician ? (
                        (data as IPhysician).name
                      ) : (
                        (data as IPatient).firstname + " " + (data as IPatient).lastname
                      );
                      return (
                        <option key={data.id} value={numId}>
                          {name}
                        </option>
                      );
                  })
                  }
              </Select>
              {invalidPhysician && (
                <FormError message="Escolha apenas um filtro"/>
              )}
            </FormControl>


            <FormControl
              isDisabled={(getValues("code") === SearchType.all)}
              className={"flex flex-column gap-2 justify-around"}
            >

              <FormLabel className="text-description/40" mb={1}>
                Inicio
                <Input
                 placeholder="Selecione a data de inicio do intervalo"
                 size="md"
                 type="datetime-local"
                 {...register("between.start", {required: (getValues("code") !== SearchType.all)})
                }/>
              </FormLabel>

              <FormLabel className="text-description/40" mb={1}>
                Final
                <Input
                  isDisabled={!(
                    getValues("between") && getValues("between.start")
                  )}
                  placeholder="Selecione a data do final do intervalo"
                  size="md"
                  type="datetime-local"
                  {...register("between.end", {required: (getValues("code") !== SearchType.all)})
                }/>
              </FormLabel>
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