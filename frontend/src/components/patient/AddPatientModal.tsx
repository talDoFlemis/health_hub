import useCustomToast from "@/hooks/useCustomToast";
import { ICreatePatient, IPatient } from "@/types/patient";
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
  ModalOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

interface ICreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: (args: any) => void;
  patients: IPatient[];
}

const FormError = ({ message }: { message: string }) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const AddPatientModal = ({
  isOpen,
  onClose,
  patients,
  mutate,
}: ICreatePatientModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePatient>({ mode: "onBlur" });
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const onSubmit = async (pat: ICreatePatient) => {
    const access = session?.user.access_token as string;
    try {
      const res = await fetch(`${API_URL}/api/patient/create`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        method: "POST",
        body: JSON.stringify(pat),
      });
      const newPat = await res.json();
      showSuccessToast("Paciente criado com sucesso");
      mutate([...patients, newPat]);
      closeAndClear();
    } catch (error: any) {
      showErrorToast("Erro ao criar paciente", error.message);
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
              <FormControl isInvalid={!!errors.firstname} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Nome
                </FormLabel>
                <Input
                  placeholder="Antonio"
                  type="text"
                  {...register("firstname", { required: true })}
                />
                {!!errors.firstname && <FormError message="Nome é requerido" />}
              </FormControl>
              <FormControl isInvalid={!!errors.lastname} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Nome
                </FormLabel>
                <Input
                  placeholder="Carmo Rego"
                  type="text"
                  {...register("lastname", { required: true })}
                />
                {!!errors.lastname && (
                  <FormError message="Sobrenome é requerido" />
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Email
                </FormLabel>
                <Input
                  placeholder="andre@health.com"
                  type="email"
                  {...register("email", { required: true })}
                />
                {!!errors.email && <FormError message="Email é requerido" />}
              </FormControl>
              <FormControl isInvalid={!!errors.dbo} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Data de Nascimento
                </FormLabel>
                <Input
                  placeholder="31/02/1999"
                  type="dbo"
                  {...register("dbo", { required: true })}
                />
                {!!errors.dbo && (
                  <FormError message="Data de nascimento é requerido" />
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
export default AddPatientModal;
