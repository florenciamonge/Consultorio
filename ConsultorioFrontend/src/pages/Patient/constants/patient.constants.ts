/* Textos */

import { PostPatient } from "../interfaces/patient.interface";

export const titleABM = "Pacientes";
export const sectionPatient = {
  PATIENT: "paciente",
};

export const patientColumnsAndLabelTexts = {
  /* Table Columns Headers */
  HEADER_ID: "#",
  HEADER_NAME: "Nombre",
  HEADER_IMAGE: "Imagen",
  HEADER_CODE: "Código",
  HEADER_MARKET: "Mercado",
  HEADER_DESCRIPTION: "Descripción",
  HEADER_STATE: "Estado",
  HEADER_ACTIONS: "Acciones",
};

/* Alert custom */
export const alertCustomMessages = {
  ACCESSORY_DELETE: "Ha ocurrido un error al intentar eliminar el paciente",
  ACCESSORY_CAN_BE_DELETED:
    "No se puede eliminar este registro por que esta vinculado.",
  ACCESSORY_UPDATE: "Paciente actualizado con éxito",
  ACCESSORY_CREATE: "Paciente creado con éxito",
  INFO: "Se guardó correctamente",
  DELETE: "Se eliminó correctamente el paciente",
};

/* Form */
// Default values form

export const defaultValuesForm: PostPatient = {
  action: 1,
  name: null,
  description: null,
  code: null,
  image: null,
  marketId: 1, //Argentina
  enabled: true,
};
