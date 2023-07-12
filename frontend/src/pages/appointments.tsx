import Head from 'next/head'
import DashboardLayout from '@/layouts/DashboardLayout'
import type { NextPageWithLayout } from './_app'
import React, {ReactElement, useState} from 'react'
import {useForm} from "react-hook-form";
import moment, {Moment} from "moment/moment";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import {useCustomQuery} from "@/hooks/useCustomQuery";
import {IPatient} from "@/types/patient";
import {IPhysician} from "@/types/physician";
import {IAppointment} from "@/types/appointment";
import {API_URL, CLIENT_SPECIALITES} from "@/utils/constants";
import {AiOutlinePlus} from "react-icons/ai";
import {useRouter} from "next/router";
import {
  useSession,
} from "next-auth/react";
import useCustomToast from "@/hooks/useCustomToast";
import * as typeHandler from "zod";

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
    end: Date
  } | undefined
}

const ClientSearchType: Map<SearchType, string> = new Map([
  [SearchType.patient, "Filtrar Consultas por Paciente"],
  [SearchType.physician, "Filrat consultas por Médico"],
  [SearchType.all, "Todas as Consultas"]
]);

const ServerSearchType: Map<SearchType, string> = new Map([
  [SearchType.patient, "/api/appointment/patient/"],
  [SearchType.physician, "//api/appointment/physician/"],
  [SearchType.all, "/api/appointment/"]
]);

const ArraySearchType = [
  SearchType.patient,
  SearchType.physician,
  SearchType.all
];

const ClientSelectId = new Map([
  [SearchType.physician, "Selecione um Médico"],
  [SearchType.patient, "Selecione um Paciente"],
  [SearchType.all, "---------------"]
])

const DefaultBackwardStartDate = 15;

interface SearchForm {
  searchTarget: {
    type: SearchType,
    targetId: number | null
  },
  betweenOn: boolean,
  between: {
    start: Date,
    end: Date
  } | null
}

const searchFormSchema = typeHandler.object({
  searchTarget: typeHandler.object({
    type: typeHandler.nativeEnum(SearchType),
    targetId: typeHandler.number().nullable()
  }).refine(
    (data) => data.targetId && data.type === SearchType.all, {
      path: ["targetId"],
      message: `O filtro "${ClientSearchType.get(SearchType.all)}" não pode ter um alvo definido`
    }
  ),
  betweenOn: typeHandler.boolean().default(false),
  between: typeHandler.object({
    start: typeHandler.date(),
    end: typeHandler.date()
  }).nullable().refine(
    (data) => data && (data.end && !data.start), {
      path: ["end"],
      message: "É preciso definir o limite inferior de busca"
    }
  ).default(null)
});

type SearchFormSchema = typeHandler.infer<typeof searchFormSchema>

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

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
  moment.locale("pt-br");
  const router = useRouter();
  const {
    register,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<SearchFormSchema>();
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const [ appointmentsQuery, setAppointments ]  = useState<IAppointment[]>([] as IAppointment[]);
  const DefaultDateSearch = {
    start: moment().startOf("day").subtract(
      DefaultBackwardStartDate, "days"
    ).toDate(),
    end: moment().toDate()
  }

  const searchAppointments = async (
      {
        searchTarget,
        betweenOn,
        between
      } : SearchForm ) => {
    const fetchBody = () => {
      if (betweenOn && between) {
        const startISO = moment(between.start)
          .startOf("day").toDate()
          .toISOString();
        const endISO = moment(between.end)
          .startOf("day").add(1, "days").toDate()
          .toISOString();
        const queryBody = {
          start: startISO,
          end: endISO
        };

        return({
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.access_token as string}`,
          },
          body: JSON.stringify(queryBody)
        })
      }

      return({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      })
    }
    const baseUrl = ServerSearchType.get(searchTarget.type);
    const addBetween = searchTarget.type === SearchType.all ? (
        betweenOn ? (
          "between"
        ) : (
          "all"
        )
      ) : (
        betweenOn ? (
          "between/"
        ) : (
          ""
        )
    );
    const addId = (
      searchTarget.type === SearchType.patient ||
      searchTarget.type === SearchType.physician) &&
      searchTarget.targetId? (
        searchTarget.targetId.toString()
      ) : "";

    const url = baseUrl + addBetween + addId;
    const path = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    console.log(fetchBody());
    console.log(path);
    const response = await fetch(
      path, fetchBody()
    )

    reset();
    const responseJson = await response.json();
    if (response.ok) {
      showSuccessToast(responseJson.data.length > 0 ? (
        "Sua pesquisa foi realizada"
      ):(
        "Nenhuma consulta se enquadra nos filtros desejados"
      ));

      setAppointments(
        responseJson.data
      );
    } else {
      console.log(response);
      const error = new Error("An error occurred while fetching the data.");

      setAppointments(
        [] as IAppointment[]
      );
    }
  }

  const onSubmit = async (data: SearchFormSchema) => {
    try {
      await searchAppointments(data)
    } catch (err) {
      console.log(err);
    }
  }

  const fixedQueryPhysicians = useCustomQuery<IPhysician[]>(
    "/api/physician"
  ).data;

  const fixedQueryPatients = useCustomQuery<IPatient[]>(
    "/api/patient/all"
  ).data;

  const searchBetweenCheckBoxChange = () => {
    const between = getValues("between");

    if (between) {
      setValue("between", null);
    } else {
      setValue("between", DefaultDateSearch);
    }
  }

  const [unionSelectArray, setUnionSelectArray] =
    useState<IPatient[] | IPhysician[]>([] as IPhysician[]);

  const searchTypeChange = () => {
    const targetType = getValues("searchTarget.type");
    reset({
      searchTarget: {
        type: targetType,
        targetId: null
      },
      between: null
    });

    if (targetType && targetType === SearchType.patient) {
      setUnionSelectArray(fixedQueryPatients ?? [] as IPatient[]);
    } else if (targetType && targetType === SearchType.physician) {
      // Adicionar match de tipo para evitar reescrita desnecessaria
      setUnionSelectArray(fixedQueryPhysicians ?? [] as IPhysician[]);
    }
  }

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
                {...register("searchTarget.type", {
                  required: true,
                  onChange: searchTypeChange
                })}
              >
                {ArraySearchType.map((type, index) => {
                  return (
                    <option key={index} value={type}>
                      {ClientSearchType.get(type) ?? type}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl>
                <FormLabel className="text-description/70" mb={1}>
                  Filtre por {ClientSearchType.get(getValues("searchTarget.type"))}
                </FormLabel>
                <Select
                  placeholder={ClientSelectId.get(getValues("searchTarget.type"))}
                  {...register("searchTarget.targetId")}
                >
                  {unionSelectArray.map((data) => {
                      const numId: number = data.id;
                      const name: string = getValues("searchTarget.type") === SearchType.physician ? (
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
            </FormControl>

            <FormControl className={"flex flex-column gap-2 justify-around"}
            isInvalid={!!errors.between} >
              <Checkbox
                  size="md"
                  type="checkbox"
                  {...register("betweenOn", {required: false})}
                >
              <FormLabel className="text-description/70" mb={1}>
                Pesquisar em um intervalo {
                getValues("between.start")?.toString() +
                getValues("between.end")?.toString()
              }
              </FormLabel>

              <FormLabel className="text-description/70" mb={1}>
                Inicio
                <Input
                 placeholder="Selecione a data de inicio do intervalo"
                 size="md"
                 type="datetime-local"
                 {...register("between.start", { required: false })
                }/>
              </FormLabel>

              <FormLabel className="text-description/70" mb={1}>
                Final
                <Input
                  placeholder="Selecione a data do final do intervalo"
                  size="md"
                  type="datetime-local"
                  {...register("between.end", { required: false })
                }/>
              </FormLabel>
              </Checkbox>
              {!!errors && !!errors.between && (
                <FormError message={errors.between.message ?? "ERROR IN INPUT DATE"}></FormError>
              )}
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
          {appointmentsQuery && appointmentsQuery.length > 0 ? (
            appointmentsQuery.map((appointment) => {
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