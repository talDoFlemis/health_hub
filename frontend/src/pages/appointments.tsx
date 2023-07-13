import Head from "next/head";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { NextPageWithLayout } from "./_app";
import React, { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import moment, { Moment } from "moment/moment";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  filter,
  FormControl,
  FormLabel,
  Input,
  Select,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { IPatient } from "@/types/patient";
import { IPhysician } from "@/types/physician";
import { IAppointment } from "@/types/appointment";
import { API_URL, CLIENT_SPECIALITES } from "@/utils/constants";
import AppointmentList from "@/components/appointments/AppointmentList";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useCustomToast from "@/hooks/useCustomToast";
import * as typeHandler from "zod";

enum SearchType {
  patient = "PATIENT",
  physician = "PHYSICIAN",
  all = "ALL",
  patientBetween = "PATIENT_BETWEEN",
  physicianBetween = "PHYSICIAN_BETWEEN",
  allBetween = "ALL_BETWEEN",
}

interface SearchBy {
  code: SearchType;
  id: number | undefined;
  between:
    | {
        start: Date;
        end: Date;
      }
    | undefined;
}

const ClientSearchType: Map<SearchType, string> = new Map([
  [SearchType.patient, "Filtrar Consultas por Paciente"],
  [SearchType.physician, "Filrat consultas por Médico"],
  [SearchType.all, "Todas as Consultas"],
  [SearchType.patientBetween, "Filtrar Consultas por Paciente & Entre Datas"],
  [SearchType.physicianBetween, "Filrat consultas por Médico & Entre Datas"],
  [SearchType.allBetween, "Todas as Consultas Entre Datas"],
]);

const ArraySearchType = [
  SearchType.patient,
  SearchType.physician,
  SearchType.all,
  SearchType.physicianBetween,
  SearchType.patientBetween,
  SearchType.allBetween,
];

const ClientSelectId = new Map([
  [SearchType.physician, "Selecione um Médico"],
  [SearchType.patient, "Selecione um Paciente"],
  [SearchType.all, "---------------"],
  [SearchType.physicianBetween, "Selecione um Médico"],
  [SearchType.patientBetween, "Selecione um Paciente"],
  [SearchType.allBetween, "---------------"],
]);

const DefaultBackwardStartDate = 15;

interface SearchForm {
  searchTarget: {
    type: SearchType;
    targetId: number | null;
  };
  between: {
    start: Date;
    end: Date;
  };
}

const searchFormSchema = typeHandler.object({
  searchTarget: typeHandler.object({
    type: typeHandler.nativeEnum(SearchType),
    targetId: typeHandler.number().nullable(),
  }),
  between: typeHandler.object({
    start: typeHandler.date(),
    end: typeHandler.date(),
  }),
});

type SearchFormSchema = typeHandler.infer<typeof searchFormSchema>;

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const AppointmentCard = (appointment: IAppointment) => {
  return (
    <>
      <div
        className={`flex w-full items-center rounded-lg 
          border border-description/30 
        `}
      >
        <div
          className={`
          flex w-1/2 h-full items-center justify-end bg-primary py-4 px-2 gap-4 bg-opacity-25
        `}
        >
          <Avatar name={appointment.physician.name} />
          <div className={"w-2/3"}>
            <h3 className="text-xl font-bold text-primary">
              {appointment.physician.name}
            </h3>
            <h4 className="text-md text-description/70">
              {CLIENT_SPECIALITES.get(appointment.physician.specialty) ??
                appointment.physician.specialty}
            </h4>
          </div>
        </div>
        <div
          className={`
          flex w-1/2 h-full items-center justify-end bg-white py-4 px-2 gap-4
        `}
        >
          <Avatar
            name={
              appointment.patient.firstname + " " + appointment.patient.lastname
            }
          />
          <div className={"w-2/3"}>
            <h3 className="text-xl font-bold text-primary">
              {appointment.patient.firstname +
                " " +
                appointment.patient.lastname}
            </h3>
            <h4 className="text-md text-description/70">{`Consulta dia: ${appointment.time}`}</h4>
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
    formState: { errors },
  } = useForm<SearchFormSchema>();
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const DefaultDateSearch = {
    start: moment()
      .startOf("day")
      .subtract(DefaultBackwardStartDate, "days")
      .toDate(),
    end: moment().toDate(),
  };

  const dateISOStringParams = (start?: Date, end?: Date) =>
    "?" +
    `start=${
      start ? start.toISOString() : DefaultDateSearch.start.toISOString()
    }&end=${end ? end.toISOString() : DefaultDateSearch.start.toISOString()}`;

  const ServerSearchUrl: Map<SearchType, (start?: Date, end?: Date) => string> =
    new Map([
      [
        SearchType.patient,
        () =>
          `/api/appointment/patient/${(
            getValues("searchTarget.targetId") ?? ""
          ).toString()}`,
      ],
      [
        SearchType.physician,
        () =>
          `/api/appointment/physician/${(
            getValues("searchTarget.targetId") ?? ""
          ).toString()}`,
      ],
      [SearchType.all, () => `/api/appointment/all`],
      [
        SearchType.allBetween,
        (start?: Date, end?: Date) =>
          `/api/appointment/between${dateISOStringParams(start, end)}`,
      ],
      [
        SearchType.patientBetween,
        (start?: Date, end?: Date) =>
          `/api/appointment/patient/between/${(
            getValues("searchTarget.targetId") ?? ""
          ).toString()}${dateISOStringParams(start, end)}`,
      ],
      [
        SearchType.physicianBetween,
        (start?: Date, end?: Date) =>
          `/api/appointment/physician/between/${(
            getValues("searchTarget.targetId") ?? ""
          ).toString()}${dateISOStringParams(start, end)}`,
      ],
    ]);

  const makeURL = (type: SearchType, start?: Date, end?: Date) => {
    const getUrlFn = ServerSearchUrl.get(type);

    if (getUrlFn) {
      return getUrlFn(start, end);
    }

    return "/api/appointment/all";
  };

  const [SearchURL, setSearchURL] = useState<string>(makeURL(SearchType.all));

  const { data: appointmentsQuery, mutate } =
    useCustomQuery<IAppointment[]>(SearchURL);

  const filterMutate = (newData: IAppointment[]) =>
    appointmentsQuery?.filter((appointment) => !newData.includes(appointment));

  const onSubmit = async (data: SearchFormSchema) => {
    const access = session?.user.access_token as string;

    const type = data.searchTarget.type;
    const start = data.between.start ?? undefined;
    const end = data.between.end ?? undefined;
    setSearchURL(makeURL(type, start, end));
    try {
      const res = await fetch(`${API_URL}${SearchURL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        method: "GET",
      });
      const appointNewQuery = await res.json();
      mutate(
        [...(filterMutate(appointNewQuery) ?? ([] as IAppointment[]))],
        appointNewQuery
      );
      showSuccessToast("Sua pesquisa foi realizada");
      reset();
    } catch (error: any) {
      showErrorToast("Erro na pesquisa", error.message);
    }
  };

  const fixedQueryPhysicians =
    useCustomQuery<IPhysician[]>("/api/physician").data;

  const fixedQueryPatients =
    useCustomQuery<IPatient[]>("/api/patient/all").data;

  const [unionSelectArray, setUnionSelectArray] = useState<
    IPatient[] | IPhysician[]
  >([] as IPhysician[]);

  const searchTypeChange = () => {
    const targetType = getValues("searchTarget.type");
    reset({
      searchTarget: {
        type: targetType,
        targetId: null,
      },
      between: DefaultDateSearch,
    });

    if (
      targetType &&
      (targetType === SearchType.patient ||
        targetType == SearchType.patientBetween)
    ) {
      setUnionSelectArray(fixedQueryPatients ?? ([] as IPatient[]));
    } else if (
      targetType &&
      (targetType === SearchType.physician ||
        targetType == SearchType.physicianBetween)
    ) {
      setUnionSelectArray(fixedQueryPhysicians ?? ([] as IPhysician[]));
    }
  };

  return (
    <>
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
                <Select
                  placeholder={"Escolha o formato da pesquisa"}
                  {...register("searchTarget.type", {
                    required: true,
                    onChange: searchTypeChange,
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
                  Filtre por{" "}
                  {ClientSearchType.get(getValues("searchTarget.type"))}
                </FormLabel>
                <Select
                  placeholder={ClientSelectId.get(
                    getValues("searchTarget.type")
                  )}
                  {...register("searchTarget.targetId")}
                >
                  {unionSelectArray.map((data) => {
                    const numId: number = data.id;
                    const name: string =
                      (data as IPhysician).name ??
                      (data as IPatient).firstname +
                        " " +
                        (data as IPatient).lastname;

                    return (
                      <option key={data.id} value={numId}>
                        {name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl
                className={"flex flex-column gap-2 justify-around"}
                isInvalid={!!errors.between}
              >
                <FormLabel className="text-description/70" mb={1}>
                  Pesquisar em um intervalo
                </FormLabel>

                <FormLabel className="text-description/70" mb={1}>
                  Inicio: {moment(getValues("between.start")).fromNow()}
                  <Input
                    // defaultValue={DefaultDateSearch.start.toISOString().split("T")[0]}
                    placeholder="Selecione a data de inicio do intervalo"
                    size="md"
                    type="date"
                    {...register("between.start", { required: false })}
                  />
                </FormLabel>

                <FormLabel className="text-description/70" mb={1}>
                  Final: {moment(getValues("between.end")).fromNow()}
                  <Input
                    // defaultValue={DefaultDateSearch.end.toISOString().split("T")[0]}
                    placeholder="Selecione a data do final do intervalo"
                    size="md"
                    type="date"
                    {...register("between.end", { required: false })}
                  />
                </FormLabel>
                {!!errors && !!errors.between && (
                  <FormError
                    message={errors.between.message ?? "ERROR IN INPUT DATE"}
                  ></FormError>
                )}
              </FormControl>

              <Button colorScheme="green" mr={3} type="submit" form="form">
                Buscar Consulta
              </Button>
            </form>
          </div>
        </div>

        <div
          className={
            "flex flex-column w-full rounded-lg bg-white px-4 py-4 shadow-lg"
          }
        >
          <AppointmentList
            appointments={appointmentsQuery ?? ([] as IAppointment[])}
          />
        </div>
      </main>
    </>
  );
};

Appointments.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Appointments;
