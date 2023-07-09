import React from "react";
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

interface DeleteAttendantAlertProps {
  id: number;
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAttendantAlert = ({ id, name, isOpen, onClose }: DeleteAttendantAlertProps) => {
  const cancelRef = React.useRef(null);
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const { data: session } = useSession();
  const router = useRouter();

  const deleteAttendant = async () => {
    try {
      await fetch(`${API_URL}/api/attendant/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.access_token as string}`,
        },
      });
      showSuccessToast("Sucesso ao deletar o atendente");
      router.push("/attendants");
      onClose();
    } catch (error: any) {
      showErrorToast("Erro ao deletar o atendente", error.message);
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
              Deletar atendente 
            </h2>
          </AlertDialogHeader>

          <AlertDialogBody>
            <p className="py-2 text-description/70">
              Tem certeza que deseja deletar o atendente 
              <span className="text-accent font-bold px-1">{name}</span>?
            </p>
            <p className=" text-accent font-bold">
              Essa ação não pode ser desfeita.
            </p>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="red" onClick={() => deleteAttendant()} mr={3}>
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
}

export default DeleteAttendantAlert;
