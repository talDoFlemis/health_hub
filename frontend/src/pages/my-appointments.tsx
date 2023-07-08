import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import {
  Avatar,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import { IAppointment } from "@/types/appointment";

const AppointmentRow = ({ appointment }: { appointment: IAppointment }) => {
  return (
    <Tr>
      <Td className="flex items-center space-x-4">
        <Avatar name={appointment.physician.name} size="sm" />
        <span>{appointment.physician.name}</span>
      </Td>
      <Td>{moment(appointment.time).format("dddd, DD MMMM YYYY, HH:mm")}</Td>
    </Tr>
  );
};

const MyAppointments: NextPageWithLayout = () => {
  const { data: appointments } = useCustomQuery<IAppointment[]>(
    "/api/patient/me/appointments"
  );
  return (
    <>
      <Head>
        <title>Minhas Consultas • Health Hub</title>
      </Head>
      <main className="flex flex-col p-8">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-4xl font-bold">Minhas as Consultas</h1>
          {appointments ? (
            <TableContainer className="mt-8">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Médico</Th>
                    <Th>Data e Hora</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {appointments.map((appointment) => (
                    <AppointmentRow
                      key={appointment.id}
                      appointment={appointment}
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <>
              <Skeleton height="140px" />
            </>
          )}
        </div>
      </main>
    </>
  );
};

MyAppointments.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MyAppointments;
