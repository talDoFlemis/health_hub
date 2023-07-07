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

interface IDeleteDoctorAlertProps {
  id: number;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteDoctorAlert = ({
  isOpen,
  onClose,
  id,
  name,
}: IDeleteDoctorAlertProps) => {
  const cancelRef = React.useRef(null);
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { data: session } = useSession();
  const router = useRouter();

  const deleteUser = async () => {
    try {
      await fetch(`${API_URL}/api/psysician/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      });
      showSuccessToast("Sucesso ao deletar o médico");
      router.push("/doctors");
      onClose();
    } catch (error: any) {
      showErrorToast("Erro ao deletar o médico", error.message);
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
          <AlertDialogHeader>
            <h2 className="text-xl font-bold text-description/70">
              Deletar médico
            </h2>
          </AlertDialogHeader>

          <AlertDialogBody>
            <p className="py-2 text-description/70">
              Tem certeza que deseja deletar o médico
              <span className="text-accent font-bold px-1">{name}</span>?
            </p>
            <p className=" text-accent font-bold">
              Essa ação não pode ser desfeita.
            </p>
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
export default DeleteDoctorAlert;
