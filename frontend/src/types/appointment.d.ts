import { IPatient } from "./patient";
import { IPhysician } from "./physician";
import { Specialty } from "./physician";

export interface IAppointment {
  id: number;
  annotations: string;
  time: string;
  patient: IPatient;
  patientId: number;
  physician: IPhysician;
  physicianId: number;
}

interface ISpecialty {
  specialty: Specialty
}



export type ICreateAppointment= Omit<IAppointment, "id" | "physician" | "patient" | "patientId"> & ISpecialty;