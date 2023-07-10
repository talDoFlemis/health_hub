import Head from "next/head";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { NextPageWithLayout } from "./_app";
import React, { ReactElement } from "react";
import { Calendar, Messages, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import {Button, Skeleton, useDisclosure} from "@chakra-ui/react";
import { IAppointment } from "@/types/appointment";
import { useRouter } from "next/router";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import CreateAppointment from "@/components/appointments/CreateAppointment"


const Home: NextPageWithLayout = () => {
  moment.locale("pt-br");
  const { data: appointments, mutate } = useCustomQuery<IAppointment[]>(
    "/api/appointment/all"
  );
  const router = useRouter();
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

  const events = appointments?.map((appointment) => {
    return {
      id: appointment.id,
      title: appointment.patient.firstname + " • " + appointment.physician.name,
      start: new Date(appointment.time),
      end: moment(appointment.time).add(1, "hour").toDate(),
    };
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Health Hub</title>
      </Head>
      {appointments && (
          <CreateAppointment
          isOpen={isOpen}
          onClose={onClose}
          appointments={appointments}
          mutate={mutate}
        />)
      }
      <main className="flex flex-col p-8">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-4xl font-bold">Calendário de Consultas</h1>
            <Button
              colorScheme="green"
              leftIcon={<BsFillCalendarPlusFill />}
              onClick={onOpen}
            >
              Nova Consulta{" "}
            </Button>

          </div>
          <div className="h-[70vh]">
            {appointments ? (
              <Calendar
                localizer={momentLocalizer(moment)}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                defaultView="week"
                onSelectEvent={(event) =>
                  router.push(`/appointments/${event.id}`)
                }
                popup
              />
            ) : (
              <Skeleton height="500px" />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Home;
