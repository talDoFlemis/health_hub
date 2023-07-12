import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";
import AppointmentList from "@/components/appointments/AppointmentList";
import { Inter } from "next/font/google";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { IAppointment } from "@/types/appointment";
import { Skeleton } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

const MyAppointments: NextPageWithLayout = () => {
  const { data: appointments } = useCustomQuery<IAppointment[]>(
    "/api/patient/me/appointments"
  );

  return (
    <>
      <Head>
        <title>Minhas Consultas • Health Hub</title>
      </Head>
      <main className={`flex flex-col py-8 px-2 md:px-4 lg:px-8 ${inter.className}`}>
        <h1 className="text-primary text-5xl font-bold mb-4">Minhas Consultas</h1>
        {appointments ? (
          <AppointmentList appointments={appointments}/>
        ) : <Skeleton height="140px" />} 
      </main>
    </>
  );
};

MyAppointments.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyAppointments;
