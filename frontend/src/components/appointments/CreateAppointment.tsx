import useCustomToast from "@/hooks/useCustomToast";
import {ICreatePatient, IPatient} from "@/types/patient";
import { API_URL } from "@/utils/constants";
import {
  background,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Select,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { IAppointment, ICreateAppointment, InputToCreateAppointment } from "@/types/appointment";
import { SPECIALTIES, CLIENT_SPECIALITES } from "@/utils/constants";
import moment, {Moment} from "moment/moment";
import React, { useState } from "react";
import { IPhysician, Specialty } from "@/types/physician";
import PickPhysician from "@/components/doctors/PickPhysician";
import { Simulate } from "react-dom/test-utils";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import {mockSession} from "next-auth/client/__tests__/helpers/mocks";
import {Calendar, Messages, momentLocalizer} from "react-big-calendar";
import {useRouter} from "next/router";
import {pairs} from "yaml/dist/schema/yaml-1.1/pairs";
import {hours} from "date-arithmetic";

interface ICreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const messages: Messages = {
allDay: "Dia inteiro",
previous: "<",
next: ">",
today: "Hoje",
month: "Mês",
week: "Semana",
day: "Dia",
agenda: "Agenda",
date: "Data",
time: "Hora",
event: "Evento",
};

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const physicianPickMakeURL = (specialty: string | null, name: string | null) => (
  "/api/physician" +
  (specialty ? `?specialty=${specialty}` : "") +
  (name ? `?name=${name}` : ""));

const CreateAppointment = ({
  isOpen,
  onClose
  }: ICreateAppointmentModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading},
  } = useForm<ICreateAppointment>({ mode: "onBlur" });
  moment.locale("pt-br");

  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { data: appointments, mutate } = useCustomQuery<IAppointment[]>(
    "/api/appointment/all"
  );
  const closeAndClear = () => {
        reset();
        onClose();
  };

  const onSubmit = async (data: ICreateAppointment) => {
    const formatedData = {
      annotations: data.annotations ?? "",
      patient_id: data.patientId,
      physician_id: data.physicianId,
      time: data.time
    }

    const access = session?.user.access_token as string;
    try {
      const res = await fetch(`${API_URL}/api/appointment/create`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: JSON.stringify(formatedData),
      });
      const newApp = await res.json();
      showSuccessToast("Médico criado com sucesso");
      mutate([...appointments, newApp]);
      reset();
      onClose();
    } catch (error: any) {
      showErrorToast("Não foi possível marcar sua consulta", error.message);
    }
  };

  const freeAppointmentsEventsCalc = (
    RangeOfDays: number,
    physicianId: number | undefined
    ) => {
  const firstValidHour = 8;
  const hoursWorkedPerDay = 10;
  const lastValidHour = firstValidHour + hoursWorkedPerDay;


  const firstValidDay = moment().startOf("day").add(1, "day");
  const lastValidDay = moment(firstValidDay).add(RangeOfDays, "day");

  const events: {
    id: number,
    title: string,
    start: Date,
    end: Date
  }[] = [];

  const OpenAppointmentsMatrix: boolean[][] = new Array(RangeOfDays)
                                 .fill(false)
                                 .map(() =>
                                   new Array(hoursWorkedPerDay).fill(true)
                                 );

  const physicianAppointments = appointments?.filter(
    (appointment) => (
      physicianId && appointment.physicianId === physicianId
    ));

  for (const appointment of physicianAppointments as IAppointment[]) {
    const appointmentMoment = moment(new Date(appointment.time));
    const appointmentHour = appointmentMoment.hour();

    console.log(appointment);

    if (
      (
        appointmentMoment.isAfter(firstValidDay) &&
        appointmentMoment.isBefore(lastValidDay)
      ) && (
        appointmentHour >= firstValidHour &&
        appointmentHour <= lastValidHour
      )
    ) {
      const dayIndex = appointmentMoment.diff(firstValidDay, "days");
      const hourIndex = appointmentHour - firstValidHour;

      if (OpenAppointmentsMatrix[dayIndex][hourIndex]) {
        OpenAppointmentsMatrix[dayIndex][hourIndex] = false;
      }
    }
  }

    for (const column of OpenAppointmentsMatrix) {
      const i = OpenAppointmentsMatrix.indexOf(column);
      for (let j = 0; j < column.length; j++){
        const free = column[j];
        if (free) {
          const startMoment = moment(
            firstValidDay
          ).add(i, "days").add(j + firstValidHour, "hours");

          events.push(
            {
              id: j + hoursWorkedPerDay * i,
              title: free ? "Horario Livre" : "Horario Ocupado",
              start: startMoment.toDate(),
              end: startMoment.add(50, "minutes").toDate(),
            }
          )
        }
      }
    }
  return {
    events: events,
    firstDay: firstValidDay,
    lastDay: lastValidDay
  };
}

  const [physicianBySpcltURL, setPhysicianBySpcltURL] = useState(
    physicianPickMakeURL("", "")
  );
  const { data: doctors} = useCustomQuery<IPhysician[]>(physicianBySpcltURL);

  const { data: patients } =
    useCustomQuery<IPatient[]>("/api/patient/all");

  const [limitDays, setLimitDays] = useState<{
    firstDay: Moment,
    lastDay: Moment
  } | undefined>(undefined);

  const [eventsUseState, setEventsUseState] = useState<{
      id: number,
      title: string,
      start: Date,
      end: Date
    }[] | undefined>(undefined);

  const [selectedEventUseState, setSelectedEventUseState] = useState< {
      id: number,
      title: string,
      start: Date,
      end: Date
    } | undefined>(undefined);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">Marcar Consulta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="form"
              className="flex flex-col gap-4"
            >
              <FormControl isInvalid={!!errors.patientId} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Para qual paciente é a consulta?
                </FormLabel>

                <Select
                  placeholder="Escolha o paciente que será atendido."
                  {...register("patientId", { required: true})}
                >
                  {patients && (
                    patients.map((patient) => {
                      return (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstname + " " +  patient.lastname}
                        </option>
                      )
                    })
                  )}
                </Select>

                {!!errors.patientId && <FormError message="É preciso escolher um paciente" />}
              </FormControl>

              <FormControl isInvalid={!!errors.specialty} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Para qual especialidade você busca atendimento?
                </FormLabel>

                <Select
                  placeholder="Escolha a especialidade do médico"
                  {...register("specialty", { required: true,
                    onChange: SelectEvent => {
                      setEventsUseState(undefined);
                      setLimitDays(undefined);
                      setSelectedEventUseState(undefined);

                      setPhysicianBySpcltURL(
                        physicianPickMakeURL(
                          SelectEvent.target.value, null
                        )
                      );
                    }
                  })}
                >
                  {
                    SPECIALTIES.map((specialityFromMap, index) => {
                      const key = specialityFromMap + "_id_" + index.toString()
                      return (
                        <option key={key} value={specialityFromMap}>
                          {CLIENT_SPECIALITES.get(specialityFromMap) ?? specialityFromMap}
                        </option>
                      )
                    })
                  }
                </Select>

                {!!errors.specialty && <FormError message="É preciso escolher uma especialidade" />}
              </FormControl>


              <FormControl isInvalid={!!errors.physicianId} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escolha um médico:
                </FormLabel>

                  <PickPhysician
                    setSelectedPhysicianId={(id: number) => {
                      setValue('physicianId', id);

                      const freeApp = freeAppointmentsEventsCalc(
                        15,
                        getValues("physicianId")
                      );

                      setLimitDays({
                        firstDay: freeApp.firstDay,
                        lastDay: freeApp.lastDay
                      })

                      setEventsUseState(
                        freeApp.events
                      );
                    }}
                    physicians={getValues("specialty") ? (doctors as []) : [] }
                    notFoundMsg={!getValues("specialty") ? "É preciso escolher uma especialidade primeiro" : undefined}
                  />

                {!!errors.physicianId && (
                  <FormError message="É preciso escolher um médico prosseguir"/>
                )}
              </FormControl>


              <FormControl isInvalid={!!errors.time} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escolha uma data {selectedEventUseState?.start.toString()}
                </FormLabel>
                {(eventsUseState && limitDays && getValues("physicianId")) ? (
                  <div className="h-[70vh]">
                    <Calendar
                      localizer={momentLocalizer(moment)}
                      events={eventsUseState}
                      startAccessor="start"
                      endAccessor="end"
                      messages={messages}
                      defaultView={"week"}
                      selected={selectedEventUseState}
                      onSelectEvent={
                        (eventSelected ) => {
                          setSelectedEventUseState(eventSelected);
                          if (selectedEventUseState) {
                            setValue("time", selectedEventUseState.start.toISOString());
                          }
                        }
                      }
                      popup
                    />
                  </div>
                  ) : (
                    <span className="py-4 px-2 text-description/70 text-xl">
                      {"Escolha um médico antes"}
                    </span>
                  )
                }
              </FormControl>

              <FormControl isInvalid={!!errors.annotations} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escreva aqui informações importantes sobre a consulta
                </FormLabel>
                <Input
                  placeholder={"O paciente relatou ter os seguintes sintomas..."}
                  {...register("annotations", {
                    required: true
                  })
                }/>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} type="submit" form="form">
              Marcar Consulta
            </Button>
            <Button onClick={closeAndClear}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateAppointment;


