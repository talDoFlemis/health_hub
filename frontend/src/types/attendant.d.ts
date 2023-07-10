export interface IAttendant {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  dbo: Date;
  age: integer;
}

export type ICreateAttendant = Omit<IAttendant, "id" | "age">;
export type IUpdateAttendant = ICreateAttendant;
