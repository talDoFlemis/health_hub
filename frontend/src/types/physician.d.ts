export interface IPhysician {
  id: number;
  name: string;
  email: string;
  specialty: Specialty;
}

export type ICreatePhysician = Omit<IPhysician, "id">
export type IUpdatePhysician = ICreatePhysician


export enum Specialty {
  CARDIOLOGY = "CARDIOLOGY",
  DERMATOLOGY = "DERMATOLOGY",
  ENDOCRINOLOGY = "ENDOCRINOLOGY",
  GASTROENTEROLOGY = "GASTROENTEROLOGY",
  GERIATRICS = "GERIATRICS",
  GYNECOLOGY = "GYNECOLOGY",
  HEMATOLOGY = "HEMATOLOGY",
  NEPHROLOGY = "NEPHROLOGY",
  NEURORADIOLOGY = "NEURORADIOLOGY",
  OBSTETRICS = "OBSTETRICS",
  PEDIATRICS = "PEDIATRICS",
  PSYCHIATRY = "PSYCHIATRY",
  RHEUMATOLOGY = "RHEUMATOLOGY",
  UROLOGY = "UROLOGY",
}
