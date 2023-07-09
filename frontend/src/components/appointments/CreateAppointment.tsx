import useCustomToast from "@/hooks/useCustomToast";
import {ICreatePatient, IPatient} from "@/types/patient";
import { API_URL } from "@/utils/constants";
import {
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

interface ICreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: IAppointment[];
}

const freeAppointmentsEventsCalc = (
    RangeOfDays: number,
    physicianId: number,
    appointments: IAppointment[]
    ) => {
  const firstValidHour = 8;
  const hoursWorkedPerDay = 10;
  const lastValidHour = firstValidHour + hoursWorkedPerDay;

  const appointmentMinutesStart = 0
  const MinutesPerAppointment = 50
  const appointmentMinutesEnd = appointmentMinutesStart + MinutesPerAppointment

  const firstValidDay = moment(Date.now()).startOf("day").add(1, "day");
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

  const physicianAppointments = appointments.filter((appointment) => appointment.physicianId == physicianId)
  physicianAppointments.forEach((appointment) => {
    const appointmentMoment = moment(new Date(appointment.time));
    const appointmentHour = appointmentMoment.startOf("hour").hour();

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
  })

  OpenAppointmentsMatrix.forEach(
    (column, i) => column.forEach(
      (free, j) => {
        if (free) {
          const startMoment = moment(firstValidDay).add(i, "days").add(j + firstValidHour, "hours");

          events.push(
           {
            id: j + i*hoursWorkedPerDay,
            title: "Horario Livre",
            start: startMoment.toDate(),
            end: startMoment.add(1, "hours").toDate(),
          }
         )
        }
      }
    )
  )

  return {
    events: events,
    firstDay: firstValidDay,
    lastDay: lastValidDay
  };
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
  onClose,
  appointments
  }: ICreateAppointmentModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading},
  } = useForm<InputToCreateAppointment>({ mode: "onBlur" });
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const router = useRouter();

  const onSubmit = async (pat: InputToCreateAppointment) => {


    const newAppointment: ICreateAppointment = {
      patientId: pat.patientId,
      physicianId: pat.physicianId,
      time: moment(pat.appointmentDay).add(pat.appointHour, "hours").toISOString(),
      annotations: pat.annotations,
    }

    const access = session?.user.access_token as string;
    try {

      const res = await fetch(`${API_URL}/appointment/CreateAppointmentDTO.java`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: JSON.stringify(pat),
      });
      showSuccessToast("Consulta marcada com sucesso");
      closeAndClear();
    } catch (error: any) {
      showErrorToast("Não foi possível marcar sua consulta", error.message);
    }
  };
  const closeAndClear = () => {
      reset();
      onClose();
  };

  const [selectedPhysicianId, setSelectedPhysicianId] = useState<number | undefined>(undefined)

  const [physicianBySpcltURL, setPhysicianBySpcltURL] = useState(
    physicianPickMakeURL("", "")
  );
  const { data: doctors} = useCustomQuery<IPhysician[]>(physicianBySpcltURL);

  const [selectedPatientName, setSelectedPatientName] = useState<string | undefined>(undefined)

  const { data: patients } =
    useCustomQuery<IPatient[]>("/api/patient/all");

  const [limitDays, setLimitDays] = useState<{
    firstDay: Moment,
    lastDay: Moment
  } | undefined>(undefined)

  const [events, setEvents] = useState<{
      id: number,
      title: string,
      start: Date,
      end: Date
    }[] | undefined>(undefined);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
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
                  {patients? (
                    patients.map((patient) => {
                      return (
                        <option key={patient.id} value={patient.id}>
                          {patient.firstname + " " +  patient.lastname}
                        </option>
                      )
                    })
                  ) : (
                    <span className="py-4 px-2 text-description/70 text-xl">
                      {"Adicione mais pacientes."}
                    </span>
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
                    onChange: event => {
                      setEvents(undefined);
                      setLimitDays(undefined);

                      setSelectedPhysicianId(undefined);
                      setPhysicianBySpcltURL(
                        physicianPickMakeURL(
                          event.target.value, null
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
                      setSelectedPhysicianId(id);
                      const freeApp = freeAppointmentsEventsCalc(
                        15,
                        Number(selectedPhysicianId),
                        appointments
                      );

                      setLimitDays({
                        firstDay: freeApp.firstDay,
                        lastDay: freeApp.lastDay
                      })

                      setEvents(
                        freeApp.events
                      );
                      setValue('physicianId', id);
                    }}
                    physicians={getValues("specialty") ? (doctors as []) : [] }
                    notFoundMsg={!getValues("specialty") ? "É preciso escolher uma especialidade primeiro" : undefined}
                  />

                {!!errors.physicianId && (
                  <FormError message="É preciso escolher um médico prosseguir"/>
                )}
              </FormControl>


              <FormControl isInvalid={!!errors.appointHour || !!errors.appointmentDay} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escolha uma data
                </FormLabel>
                {(events && limitDays) ? (
                  <div className="h-[70vh]">
                    <Calendar
                      localizer={momentLocalizer(moment)}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      messages={messages}
                      defaultView={getValues("appointmentDay") ?
                        "day" : "month"
                      }
                      onSelectEvent={
                        (event, background ) => {
                          if (getValues("appointmentDay")) {
                            setValue("appointHour", event.start?.getHours());

                          } else {
                            setValue("appointmentDay", event.start)
                          }
                        }
                      }
                      toolbar={false}
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
