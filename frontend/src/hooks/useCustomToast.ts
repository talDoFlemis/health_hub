import { useToast } from "@chakra-ui/react";

// Hook que retorna o componente toast, consiste em uma notificação
// para o usuário a respeito do sucesso ou falha de uma ação.
const useCustomToast = () => {
  const toast = useToast();

  const showErrorToast = (err: string, title: string) => {
    toast({
      title: title,
      description: `Erro: ${err}`,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  };

  const showSuccessToast = (title: string, description?: string) => {
    toast({
      title: title,
      description: description,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return {
    showErrorToast,
    showSuccessToast,
  };
};

export default useCustomToast;
