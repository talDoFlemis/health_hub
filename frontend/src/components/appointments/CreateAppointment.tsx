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
import { IAppointment, ICreateAppointment } from "@/types/appointment";
import { SPECIALTIES, CLIENT_SPECIALITES } from "@/utils/constants";
import DoctorsPanel, {DoctorsSearchBar} from "@/components/doctors/DoctorsPanel"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment/moment";
import {useState} from "react";
import {IPhysician, Specialty} from "@/types/physician";
import PickPhysician from "@/components/doctors/PickPhysician";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;
import {useCustomQuery} from "@/hooks/useCustomQuery";
import DoctorsList from "@/components/doctors/DoctorsList";

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
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading},
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



  const [selectedPhysicianId, setSelectedPhysicianId] = useState<number | undefined>(undefined)
  const makeURL = (specialty: string | null, name: string | null) => (
    "/api/physician" +
    (specialty ? `?specialty=${specialty}` : "") +
    (name ? `?name=${name}` : ""));

  const [URL, setURL] = useState(makeURL("", ""));
  const {data: doctors, mutate} = useCustomQuery<IPhysician[]>(URL);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">Marcar Consulta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="form"
              className="flex flex-col gap-4"
            >
              <FormControl isInvalid={!!errors.specialty} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Para qual especialidade você busca atendimento?
                </FormLabel>

                <Select
                  placeholder="Escolha a especialidade do médico"
                  {...register("specialty", { required: true,
                    onChange: event => {
                      setURL(
                        makeURL(
                          event.target.value, null
                        )
                      )
                    }
                  })}
                >
                  {
                    SPECIALTIES.map((specialityFromMap, index) => {
                      const key = specialityFromMap + "_id_" + index.toString()
                      return (
                        <option key={key} value={specialityFromMap}>
                          {CLIENT_SPECIALITES.get(specialityFromMap) ?? specialityFromMap}
                        </option>
                      )
                    })
                  }
                </Select>

                {!!errors.specialty && <FormError message="É preciso escolher uma especialidade" />}
              </FormControl>


              <FormControl isInvalid={!!errors.physicianId} isRequired>
                <FormLabel className="text-description/70" mb={1}>
                  Escolha o médico de sua preferência
                </FormLabel>

                  <PickPhysician
                    setSelectedPhysicianId={(id: number) => {
                      setSelectedPhysicianId(id);
                      setValue('physicianId', id);
                    }}
                    physicians={getValues("specialty") ? (doctors as []) : [] }
                    notFoundMsg={!getValues("specialty") ? "É preciso escolher uma especialidade" : undefined}
                  />

                {!!errors.physicianId && (
                  <FormError message="É preciso escolher um médico prosseguir"/>
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
