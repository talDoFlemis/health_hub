export interface IPhysician {
  id: number;
  name: string;
  email: string;
  specialty: Specialty;
}

export enum Specialty {
  CARDIOLOGY = "Cardiologista",
  DERMATOLOGY = "Dermatologista",
  ENDOCRINOLOGY = "Endocrinologista",
  GASTROENTEROLOGY = "Gastroenterologista",
  GERIATRICS = "Geriatra",
  GYNECOLOGY = "Ginecologista",
  HEMATOLOGY = "Hematologista",
  NEPHROLOGY = "Nefrologista",
  NEURORADIOLOGY = "Neurorradiologista",
  OBSTETRICS = "Obstetra",
  PEDIATRICS = "Pediatra",
  PSYCHIATRY = "Psiquiatra",
  RHEUMATOLOGY = "Reumatologista",
  UROLOGY = "Urologista",
}
