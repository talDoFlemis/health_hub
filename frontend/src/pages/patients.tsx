import DashboardLayout from "@/layouts/DashboardLayout";
import { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
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
import { AiFillEye, AiOutlineUserAdd } from "react-icons/ai";
import NextLink from "next/link";
import AddPatientModal from "@/components/patient/AddPatientModal";
import { Calendar, Messages, momentLocalizer } from "react-big-calendar";

const PatientRow = ({ patient }: { patient: IPatient }) => {
  const fullName = `${patient.firstname} ${patient.lastname}`;
  return (
    <Tr>
      <Td className="flex items-center space-x-4">
        <Avatar name={fullName} size="sm" />
        <span>{fullName}</span>
      </Td>
      <Td>{patient.email}</Td>
      <Td>{moment(patient.dbo).fromNow(true)}</Td>
      <Td>
        <NextLink href={`/patients/${patient.id}`}>
          <Button leftIcon={<AiFillEye />}>Ver</Button>
        </NextLink>
      </Td>
    </Tr>
  );
};

const Patients: NextPageWithLayout = () => {
  const { data: patients, mutate } =
    useCustomQuery<IPatient[]>("/api/patient/all");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Head>
        <title>Health Hub • Pacientes</title>
      </Head>
      <AddPatientModal
        isOpen={isOpen}
        onClose={onClose}
        mutate={mutate}
        patients={patients ?? []}
      />
      <main className="flex flex-col p-8">
        <div className="flex flex-col gap-4 rounded-lg bg-white p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Todos os Pacientes</h1>
            <Button
              leftIcon={<AiOutlineUserAdd />}
              colorScheme="green"
              onClick={onOpen}
            >
              Adicionar Paciente
            </Button>
          </div>
          {patients ? (
            <>
              <h3>
                <span className="font-bold">{patients?.length}</span> Pacientes
                cadastrados
              </h3>
              <TableContainer className="mt-8">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Nome</Th>
                      <Th>Email</Th>
                      <Th>Idade</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {patients?.map((pat) => (
                      <PatientRow key={pat.id} patient={pat} />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <Skeleton height="20px" />
              <Skeleton height="80px" />
            </>
          )}
        </div>
      </main>
    </>
  );
};

Patients.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Patients;
