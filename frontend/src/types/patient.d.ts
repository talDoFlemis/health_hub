export interface IPatient {
  id: number;
  firstname: string;
  lastname: string;
  dbo: string;
  email: string;
}

export type ICreatePatient = Omit<IPatient, "id">;
export type IUpdatePatient = ICreatePatient;
