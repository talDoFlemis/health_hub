import Head from "next/head";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import CreateAppointment from "@/components/appointments/CreateAppointment";

const Appointments: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Health Hub - Consultas</title>
      </Head>
      <main className="flex flex-col p-8"></main>
    </>
  );
};

Appointments.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Appointments;
