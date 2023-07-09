import Head from "next/head";
import DashboardLayout from "@/layouts/DashboardLayout";
import type { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";

const Attendants: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Health Hub - Atendentes</title> 
      </Head>
      <main className="min-h-screen w-full py-4 px-2">
        <h1 className="text-primary text-5xl font-bold mb-4">Buscar</h1>
      </main>
    </>
  )
}

Attendants.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Attendants;
