import { IPatient } from "./patient";
import { IPhysician } from "./physician";

export interface IAppointment {
  id: number;
  annotations: string;
  time: string;
  patient: IPatient;
  patientId: number;
  physician: IPhysician;
  physicianId: number;
}
