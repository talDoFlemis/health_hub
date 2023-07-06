import useCustomToast from "@/hooks/useCustomToast";
import { API_URL } from "@/utils/constants";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

interface IDeletePatientAlertProps {
  id: string;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeletePatientAlert = ({
  isOpen,
  onClose,
  id,
  name,
}: IDeletePatientAlertProps) => {
  const cancelRef = React.useRef(null);
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { data: session } = useSession();
  const router = useRouter();

  const deleteUser = async () => {
    try {
      await fetch(`${API_URL}/api/patient/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      });
      showSuccessToast("Sucesso ao deletar paciente");
      router.push("/patients");
      onClose();
    } catch (error: any) {
      showErrorToast("Erro ao deletar paciente", error.message);
    }
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Deletar Paciente
          </AlertDialogHeader>

          <AlertDialogBody>
            Tem certeza que deseja deletar o paciente{" "}
            <span className="font-bold">{name}</span>? Essa ação não pode ser
            desfeita.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="red" onClick={() => deleteUser()} mr={3}>
              Deletar
            </Button>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
export default DeletePatientAlert;
