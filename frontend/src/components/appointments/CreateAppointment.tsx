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
import { IAppointment, ICreateAppointment } from "@/types/appointment";
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

interface ICreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: IAppointment[];
}

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};


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
  } = useForm<ICreateAppointment>({ mode: "onBlur" });
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const router = useRouter();

  const onSubmit = async (pat: ICreateAppointment) => {
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
  const physicianPickMakeURL = (specialty: string | null, name: string | null) => (
    "/api/physician" +
    (specialty ? `?specialty=${specialty}` : "") +
    (name ? `?name=${name}` : ""));

  const [physicianBySpcltURL, setPhysicianBySpcltURL] = useState(
    physicianPickMakeURL("", "")
  );
  const { data: doctors} = useCustomQuery<IPhysician[]>(physicianBySpcltURL);

  // const physicianAppointmentsMakeURL = (physicianId: number | undefined) => (
  //     `/api/appointment/physician/${physicianId?.toString()}`
  //   );
  // const [physicianAppointmentsURL, setPhysicianAppointmentsURL] = useState<string>(
  //   (physicianAppointmentsMakeURL(
  //     selectedPhysicianId
  //   ))
  // );
  //
  // const { data: physicianAppointments } = useCustomQuery<IAppointment[]>(physicianAppointmentsURL);

  const freeAppointmentsEventsCalc = (
      RangeOfDays: number,
      physicianId: number
      ) => {
    const firstValidHour = 8;
    const hoursWorkedPerDay = 10;
    const lastValidHour = firstValidHour + hoursWorkedPerDay;

    const appointmentMinutesStart = 0
    const MinutesPerAppointment = 50
    const appointmentMinutesEnd = appointmentMinutesStart + MinutesPerAppointment

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

    const physicianAppointments = appointments.filter((appointment) => appointment.physicianId == physicianId)
    physicianAppointments.forEach((appointment) => {
      const appointmentMoment = moment(new Date(appointment.time));
      const appointmentHour = appointmentMoment.hour();

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
         events.push(
           {
            id: appointment.id,
            title: appointment.patient.firstname + " • " + appointment.physician.name,
            start: new Date(appointment.time),
            end: moment(appointment.time).add(1, "hour").toDate(),
          }
         )
        }
      }
    })

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
              <FormControl isInvalid={!!errors.specialty} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Para qual especialidade você busca atendimento?
                </FormLabel>

                <Select
                  placeholder="Escolha a especialidade do médico"
                  {...register("specialty", { required: true,
                    onChange: event => {
                      setEvents(undefined);
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
                        Number(selectedPhysicianId)
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


              <FormControl isInvalid={!!errors.time} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escolha uma data
                </FormLabel>
                {(events && limitDays) ? (
                    <Calendar
                      localizer={momentLocalizer(moment)}
                      events={events}
                      startAccessor={limitDays.firstDay.toDate}
                      endAccessor={limitDays.lastDay.toDate}
                    />
                  ) : (
                    <span className="py-4 px-2 text-description/70 text-xl">
                      {"Escolha um médico antes"}
                    </span>
                  )}
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} type="submit" form="form">
              Adicionar
            </Button>
            <Button onClick={closeAndClear}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateAppointment;
