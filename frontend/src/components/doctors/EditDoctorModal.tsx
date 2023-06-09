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
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { IPhysician, IUpdatePhysician } from "@/types/physician";
import { SPECIALTIES, API_URL } from "@/utils/constants";
import useCustomToast from "@/hooks/useCustomToast";
import { useSession } from "next-auth/react";

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: (args: any) => void;
  doctor: IPhysician;
  doctors: IPhysician[];
}

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  isOpen,
  onClose,
  doctor,
  doctors,
  mutate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUpdatePhysician>({ mode: "onBlur", defaultValues: doctor });
  const { data: session } = useSession();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const nameValid = errors.name ? false : true;
  const emailValid = errors.email ? false : true;
  const specialtyValid = errors.specialty ? false : true;
  const inputStyle = "px-2 py-1 w-full text-description/70 rounded-lg";
  const validInput = "border border-primary focus:outline-primary";
  const invalidInput = "border border-accent focus:outline-accent";

  const filteredDoctors = (updatedId: number) => {
    return doctors.filter((doctor) => doctor.id !== updatedId);
  };

  const onSubmit = async (updatedDoctor: IUpdatePhysician) => {
    const access = session?.user.access_token as string;
    try {
      const res = await fetch(`${API_URL}/api/physician/${doctor.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        method: "PATCH",
        body: JSON.stringify(updatedDoctor),
      });
      const data = await res.json();
      mutate([...filteredDoctors(doctor.id), data]);
      showSuccessToast("Médico modificado com sucesso");
      reset();
      onClose();
    } catch (error: any) {
      showErrorToast("Erro ao modificar médico", error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md" }}>
      <ModalOverlay />
      <ModalContent py="1rem">
        <ModalHeader>
          <h2 className="text-xl font-bold text-description/70">
            Editar Médico
          </h2>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            className="flex h-full flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl isInvalid={!nameValid} isRequired>
              <FormLabel className="text-description/70" mb={1}>
                Nome
              </FormLabel>
              <input
                className={
                  nameValid
                    ? `${inputStyle} ${validInput}`
                    : `${inputStyle} ${invalidInput}`
                }
                placeholder="Gabrigas"
                type="text"
                {...register("name", { required: true })}
              />
              {!nameValid && (
                <FormError message="O nome do médico é necessario" />
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
                <FormError message="O email do médico é necessario" />
              )}
            </FormControl>
            <FormControl py="0.5rem" isInvalid={!specialtyValid} isRequired>
              <Select
                placeholder="especialidade"
                {...register("specialty", { required: true })}
              >
                {SPECIALTIES.map((item, index) => {
                  return (
                    <option key={item + index} value={item}>
                      {item.toLowerCase()}
                    </option>
                  );
                })}
              </Select>
              {!specialtyValid && (
                <FormError message="A especialidade do médico é necessária" />
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

export default EditDoctorModal;
