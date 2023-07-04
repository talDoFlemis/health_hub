import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import Head from "next/head";
import { useCustomQuery } from "@/hooks/useCustomQuery";
import { IPatient } from "@/types/patient";
import {
  Avatar,
  Button,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment";
import {
  AiFillEdit,
  AiFillEye,
  AiOutlineUserAdd,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import DeletePatientAlert from "@/components/patient/DeletePatientAlert";
import { IAppointment } from "@/types/appointment";
import { LuCalendarClock } from "react-icons/lu";
import { GiCancel } from "react-icons/gi";
import EditPatientModal from "@/components/patient/EditPatientModal";

const AppointmentRow = ({ appointment }: { appointment: IAppointment }) => {
  return (
    <Tr>
      <Td className="flex items-center space-x-4">
        <Avatar name={appointment.physician.name} size="sm" />
        <span>{appointment.physician.name}</span>
      </Td>
      <Td>{moment(appointment.time).format("dddd, DD MMMM YYYY, HH:mm")}</Td>
      <Td isNumeric>
        <Button leftIcon={<LuCalendarClock />} colorScheme="gray" mr="3">
          Remarcar
        </Button>
        <Button leftIcon={<GiCancel />} colorScheme="red">
          Desmarcar
        </Button>
      </Td>
    </Tr>
  );
};

const Patient: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const { data: patient, mutate } = useCustomQuery<IPatient>(
    id ? `/api/patient/${id}` : null
  );
  const { data: appointments } = useCustomQuery<IAppointment[]>(
    id ? `/api/appointment/patient/${id}` : null
  );
  const {
    isOpen: isOpenDel,
    onOpen: onOpenDel,
    onClose: onCloseDel,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();

  return (
    <>
      <Head>
        <title>Pacientes - Health Hub</title>
      </Head>
      <DeletePatientAlert
        isOpen={isOpenDel}
        onClose={onCloseDel}
        id={id}
        name={patient?.firstname as string}
      />
      <main className="flex flex-col gap-8 p-8">
        {patient ? (
          <>
            <EditPatientModal
              isOpen={isOpenEdit}
              onClose={onCloseEdit}
              patient={patient}
              mutate={mutate}
            />
            <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={`${patient.firstname} ${patient.lastname}`}
                    size="lg"
                  />
                  <h1 className="text-4xl font-bold">
                    {patient.firstname} {patient.lastname}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    leftIcon={<AiFillEdit />}
                    colorScheme="twitter"
                    onClick={onOpenEdit}
                  >
                    Editar Dados
                  </Button>
                  <Button
                    leftIcon={<AiOutlineUserDelete />}
                    colorScheme="red"
                    onClick={onOpenDel}
                  >
                    Deletar Paciente
                  </Button>
                </div>
              </div>
              <span className="text-xl font-bold">
                {moment(patient.dbo).fromNow(true)}
              </span>
              <span>{patient.email}</span>
            </div>
          </>
        ) : (
          <>
            <Skeleton height="140px" />
          </>
        )}
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-4xl font-bold">Todas as Consultas</h1>
          {appointments ? (
            <TableContainer className="mt-8">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Médico</Th>
                    <Th>Data e Hora</Th>
                    <Th isNumeric>Ações</Th>
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

Patient.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Patient;
