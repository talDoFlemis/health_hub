import { IPatient } from "./patient";
import { IPhysician } from "./physician";
import { Specialty } from "./physician";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

export interface IAppointment {
  id: number;
  annotations: string;
  time: string;
  patient: IPatient;
  patientId: number;
  physician: IPhysician;
  physicianId: number;
}

export interface InputToCreateAppointment extends Omit<
  IAppointment, "id" | "physician" | "patient" | "time"
> {
  specialty: Specialty;
  appointmentDay: Date;
  appointHour: number;
  annotations: string;
}

interface AppSpeciality {
  specialty: Specialty
}

export type ICreateAppointment = Omit<IAppointment, "id" | "physician" | "patient"> & AppSpeciality;