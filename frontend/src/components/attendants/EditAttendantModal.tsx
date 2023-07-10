import React from "react";
import {
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { API_URL } from "@/utils/constants";
import { IAttendant, IUpdateAttendant } from "@/types/attendant";
import { useSession } from "next-auth/react";
import useCustomToast from "@/hooks/useCustomToast";

interface EditAttendantModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: (args: any) => void;
  attendant: IAttendant;
  attendants: IAttendant[];
}

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const EditAttendantModal = ({
  isOpen,
  onClose,
  mutate,
  attendant,
  attendants,
}: EditAttendantModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdateAttendant>({ mode: "onBlur", defaultValues: attendant });

  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const firstNameValid = errors.firstname ? false : true;
  const lastNameValid = errors.lastname ? false : true;
  const emailValid = errors.email ? false : true;
  const birthDateValid = errors.dbo ? false : true;

  const inputStyle = "px-2 py-1 w-full text-description/70 rounded-lg";
  const validInput = "border border-primary focus:outline-primary";
  const invalidInput = "border border-accent focus:outline-accent";

  const filteredAttendants = (updatedId: number) => {
    return attendants.filter((attendant) => attendant.id != updatedId);
  };

  const onSubmit = async (data: IUpdateAttendant) => {
    const access = session?.user.access_token as string;
    try {
      const res = await fetch(
        `${API_URL}/api/attendant/update/${attendant.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          method: "PATCH",
          body: JSON.stringify(data),
        }
      );
      const updatedAttendant = await res.json();
      showSuccessToast("Atendente modificado  com sucesso");
      mutate([...filteredAttendants(attendant.id), updatedAttendant]);
      reset();
      onClose();
    } catch (error: any) {
      showErrorToast("Erro ao modificar atendente", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
      <ModalOverlay />
      <ModalContent py="1rem">
        <ModalHeader>
          <h2 className="text-xl font-bold text-description/70">
            Editar Atendente
          </h2>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            className="flex h-full flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isInvalid={!firstNameValid} isRequired>
              <FormLabel className="text-description/70" mb={1}>
                Primeiro Nome
              </FormLabel>
              <input
                className={
                  firstNameValid
                    ? `${inputStyle} ${validInput}`
                    : `${inputStyle} ${invalidInput}`
                }
                placeholder="Gabrigas"
                type="text"
                {...register("firstname", { required: true })}
              />
              {!firstNameValid && (
                <FormError message="O primeiro nome é necessario" />
              )}
            </FormControl>
            <FormControl isInvalid={!lastNameValid} isRequired>
              <FormLabel className="text-description/70" mb={1}>
                Último Nome
              </FormLabel>
              <input
                className={
                  lastNameValid
                    ? `${inputStyle} ${validInput}`
                    : `${inputStyle} ${invalidInput}`
                }
                placeholder="Nobre"
                type="text"
                {...register("lastname", { required: true })}
              />
              {!lastNameValid && (
                <FormError message="O último nome é necessario" />
              )}
            </FormControl>
            <FormControl isInvalid={!emailValid} isRequired>
              <FormLabel className="text-description/70" mb={1}>
                Email
              </FormLabel>
              <input
                className={
                  emailValid
                    ? `${inputStyle} ${validInput}`
                    : `${inputStyle} ${invalidInput}`
                }
                placeholder="example@example.com"
                type="email"
                {...register("email", { required: true })}
              />
              {!emailValid && (
                <FormError message="O email do atendente é necessario" />
              )}
            </FormControl>
            <FormControl isInvalid={birthDateValid} isRequired>
              <FormLabel className="text-description/70" mb={1}>
                Data de Nascimento
              </FormLabel>
              <input
                className={
                  birthDateValid
                    ? `${inputStyle} ${validInput}`
                    : `${inputStyle} ${invalidInput}`
                }
                type="date"
                {...register("dbo", { required: true })}
              />
              {!birthDateValid && (
                <FormError message="A data de nascimento é necessaria" />
              )}
            </FormControl>
            <div className="flex py-2 gap-3">
              <Button ml="auto" size="sm" colorScheme="red" onClick={onClose}>
                Fechar
              </Button>
              <Button size="sm" colorScheme="whatsapp" type="submit">
                Editar
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditAttendantModal;
