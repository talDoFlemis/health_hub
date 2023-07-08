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
import {IAppointment, ICreateAppointment} from "@/types/appointment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/moment";

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
    reset,
    formState: { errors },
  } = useForm<ICreateAppointment>({ mode: "onBlur" });
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">Adicionar um novo paciente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="form"
              className="flex flex-col gap-4"
            >
              <FormControl isInvalid={!!errors.specialty} isRequired>
                <FormLabel className="text-description/70" mb={1}>

                </FormLabel>
                <Select
                  placeholder=""
                  {...register("specialty", { required: true })}
                />
                {!!errors.specialty && <FormError message="Nome é requerido" />}
              </FormControl>


              <FormControl isInvalid={!!errors.physicianId} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Médico
                </FormLabel>

                {!!errors.physicianId && (
                  <FormError message="Selecione um médico" />
                )}
              </FormControl>


              <FormControl isInvalid={!!errors.time} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Data(Match physician)
                </FormLabel>
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
