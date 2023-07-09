export interface IAttendant {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  dbo: Date;
  age: integer;
} 

export type ICreateAttendant = Omit<IAttendant, "id">;
export type IUpdateAttendant = ICreateAttendant;
