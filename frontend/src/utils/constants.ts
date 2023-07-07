export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export enum Roles {
  Admin = "ADMIN",
  Attendant = "ATTEDANT",
  Patient = "PATIENT",
  Physician = "PHYSICIAN",
}

export const SPECIALTIES = [
  "CARDIOLOGY",
  "DERMATOLOGY",
  "ENDOCRINOLOGY",
  "GASTROENTEROLOGY",
  "GERIATRICS",
  "GYNECOLOGY",
  "HEMATOLOGY",
  "NEPHROLOGY",
  "NEURORADIOLOGY",
  "OBSTETRICS",
  "PEDIATRICS",
  "PSYCHIATRY",
  "RHEUMATOLOGY",
  "UROLOGY",
];

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
