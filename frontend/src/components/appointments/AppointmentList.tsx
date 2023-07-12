import React from "react";
import { IAppointment } from "@/types/appointment";
import { Specialty } from "@/types/physician";
import { Avatar } from "@chakra-ui/react";
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";

const mockAppointments: IAppointment[] = [
  {
    id: 1,
    annotations: "Este paciente está retornando",
    time: "2023-05-21T20:25:21.418Z",
    patient: {
      id: 11,
      dbo: "20-05-1999",
      email: "example@example.com",
      firstname: "gab",
      lastname: "brigas",
    },
    patientId: 11,
    physician: {
      id: 111,
      name: "said",
      email: "said@said.com",
      specialty: "CARDIOLOGY" as Specialty,
    },
    physicianId: 111,
  },
  {
    id: 2,
    annotations: "Este paciente está retornando",
    time: "2023-05-21T20:25:21.418Z",
    patient: {
      id: 12,
      dbo: "20-05-1999",
      email: "example@example.com",
      firstname: "gab",
      lastname: "brigas",
    },
    patientId: 12,
    physician: {
      id: 112,
      name: "said",
      email: "said@said.com",
      specialty: "CARDIOLOGY" as Specialty,
    },
    physicianId: 112,
  },
  {
    id: 3,
    annotations: "Este paciente está retornando",
    time: "2023-05-21T20:25:21.418Z",
    patient: {
      id: 13,
      dbo: "20-05-1999",
      email: "example@example.com",
      firstname: "gab",
      lastname: "brigas",
    },
    patientId: 13,
    physician: {
      id: 113,
      name: "said",
      email: "said@said.com",
      specialty: "CARDIOLOGY" as Specialty,
    },
    physicianId: 113,
  },
  {
    id: 4,
    annotations: "Este paciente está retornando",
    time: "2023-05-21T20:25:21.418Z",
    patient: {
      id: 14,
      dbo: "20-05-1999",
      email: "example@example.com",
      firstname: "gab",
      lastname: "brigas",
    },
    patientId: 14,
    physician: {
      id: 114,
      name: "said",
      email: "said@said.com",
      specialty: "CARDIOLOGY" as Specialty,
    },
    physicianId: 114,
  },
  {
    id: 5,
    annotations: "Este paciente está retornando",
    time: "2023-05-21T20:25:21.418Z",
    patient: {
      id: 15,
      dbo: "20-05-1999",
      email: "example@example.com",
      firstname: "gab",
      lastname: "brigas",
    },
    patientId: 15,
    physician: {
      id: 115,
      name: "said",
      email: "said@said.com",
      specialty: "CARDIOLOGY" as Specialty,
    },
    physicianId: 115,
  },
];

interface AppointmentCardProps {
  appointment: IAppointment;
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const patientName =
    appointment.patient.firstname + " " + appointment.patient.lastname;

  return (
    <div
      className={`
        flex flex-col
        w-full px-4 py-2 gap-4 
        rounded-lg border border-description/30  
      `}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-primary text-2xl font-semibold">
          Consulta #{appointment.id}
        </h3>
        <div className="flex gap-1">
          <FaRegCalendarAlt className="text-accent" size="1.25rem" />
          <span className="text-description/70">
            {moment(appointment.time).format("dddd, DD MMMM YYYY, HH:mm")}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-6 xl:justify-between">
        <div className="flex gap-2">
          <Avatar name={appointment.physician.name} />
          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-primary">
              {appointment.physician.name}
            </h3>
            <h4 className="text-sm text-description/70">
              {appointment.physician.specialty}
            </h4>
          </div>
        </div>
        <div className="flex gap-2">
          <Avatar name={patientName} />
          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-primary">
              {patientName}
            </h3>
            <h4 className="text-sm text-description/70">
              {appointment.patient.email}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AppointmentListProps {
  appointments: IAppointment[];
}

const AppointmentList = ({ appointments }: AppointmentListProps) => {
  return (
    <div className="grid w-full gap-2 rounded-lg bg-white px-4 py-4 shadow-lg xl:grid-cols-2">
      {appointments.length > 0 ? (
        appointments.map((appointment) => {
          return (
            <AppointmentCard
              key={`appointment ${appointment.id}`}
              appointment={appointment}
            />
          );
        })
      ) : (
        <span className="py-4 px-2 text-description/70 text-xl">
          Nenhuma consulta encontrada...
        </span>
      )}
    </div>
  );
};

export default AppointmentList;
