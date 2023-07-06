export const SPECIALTIES = [
  "Cardiologista",
  "Dermatologista",
  "Endocrinologista",
  "Gastroenterologista",
  "Geriatra",
  "Ginecologista",
  "Hematologista",
  "Nefrologista",
  "Neuroradiologista",
  "Obstetra",
  "Pedriatra",
  "Psiquiatra",
  "Reumatologista",
  "Urologista",
]

export type Specialty =
  | "Cardiologista"
  | "Dermatologista"
  | "Endocrinologista"
  | "Gastroenterologista"
  | "Geriatra"
  | "Ginecologista"
  | "Hematologista"
  | "Nefrologista"
  | "Neuroradiologista"
  | "Obstetra"
  | "Pedriatra"
  | "Psiquiatra"
  | "Reumatologista"
  | "Urologista";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export enum Roles {
  Admin = "ADMIN",
  Attendant = "ATTEDANT",
  Patient = "PATIENT",
  Physician = "PHYSICIAN",
}

export const roleToName = (role: Roles) => {
  switch (role) {
    case Roles.Admin:
      return "Administrador";
    case Roles.Attendant:
      return "Atendente";
    case Roles.Patient:
      return "Paciente";
    case Roles.Physician:
      return "Médico";
    default:
      return "";
  }
};
