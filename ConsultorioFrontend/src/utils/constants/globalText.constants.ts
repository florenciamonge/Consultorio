import { Alert } from '../sweetAlert.utils';


/* Images */
export const profileDefault = "/assets/images/profile_default.jpg";
export const miscDefault = "/assets/images/misc-default.jpg";
export const imageLoginCar = "/assets/images/login_car.jpg";
export const logo = "/assets/images/nissan.svg";
export const efalcomLogo = "/assets/images/efalcom-logo.png";

/* Search Empty States */
export const labelNotAvailable = "Sin información";
export const labelVinNotFound =
  " No se encontraron datos con el VIN ingresado.";
export const labelVinToSearch = "Ingrese un VIN o consulte su orden actual/siguiente.";
export const labelCurrentOrderNotFound = "No hay una orden en curso.";
export const labelNextOrderNotFound = "No hay una orden siguiente.";


/* Alertas generales */

export const alertTypes = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
};
export const ToastHeader = {
  SUCCESS_CREATE: "Creado",
  SUCCESS_CANCEL: "Cancelado",
  SUCCESS_UPDATE: "Actualizado",
  SUCCESS_DELETE: "Eliminado",
  SUCCESS_SEND: "Enviado",
  SUCCESS_START: "Inicializado",
  SUCCESS_REDIRECT: "Redireccionado",
  ERROR: "Error",
};
export const alertMessages = {
  SUCCESS: "Se guardó correctamente",
  WARNING: "Se guardó correctamente",
  SEND: "Se envio correctamente",
  ERROR: "Ha ocurrido un error",
  INFO: "Se guardó correctamente",
  DELETE: "Se eliminó correctamente",
  NOT_FOUND: "No se encontro el registro solicitado",
  SESSION_EXPIRED: "Su sesión ha expirado",
};

export const changesStateFieldConfirmation = {
  title: 'Al cambiar el estado del accesorio, se desasociará de los modelos. ¿Está seguro de que desea hacerlo?',
  text: "",
  icon: "question",
  showCancelButton: true,
  confirmButtonText: "SI",
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  cancelButtonText: "NO",
  cancelButtonAriaLabel: "NO",
  msgConfirm: {
    title: "Cambios guardados",
    description: "Se guardaron con éxito!",
  },
  msgCancel: {
    title: "Cambios descartados",
    description: "Se descartaron con éxito!",
  },
};


export const deleteConfirmation: Alert = {
  title: `¿Está seguro que desea eliminar el registro?`,
  text: ``,
  icon: "question",
  toast: false,
  showCancelButton: true,
  confirmButtonText: "CONFIRMAR",
  cancelButtonText: "CANCELAR",
  cancelButtonAriaLabel: "CANCELAR",
  msgConfirm: {
    title: "Registro Eliminado",
    description: "Se eliminó con éxito!",
  },
  msgCancel: {
    title: "",
    description: "",
  },
};

export const saveChangesConfirmation: Alert = {
  title: `¿Desea guardar los cambios antes de salir?`,

  text: "",
  icon: "question",

  showCancelButton: true,
  confirmButtonText: "GUARDAR",
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  cancelButtonText: "CANCELAR",
  cancelButtonAriaLabel: "CANCELAR",
  msgConfirm: {
    title: "Cambios eliminados",
    description: "CANCELAR",
  },
  msgCancel: {
    title: "El usuario no se elimino",
    description: "",
  },
};

export const subTitles = {
  PICKUP: "MODELO",
  ARMED: "ARMADO",
  REVISION: "REVISIÓN",
  RECTIFICATION: "RECTIFICACIÓN",
} as const;

// Estados
export enum Actions {
  NONE = "NONE",
  UPDATE = "PUT",
  NEW = "POST",
  DELETE = "DELETE",
  RESET_PASSWORD = "RESET_PASSWORD",
}

// Estados de Operación
export enum WorkOrderStates {
  PENDING = "Pendiente",
  ON_ASSEMBLED = "Armado",
  REVISION = "Revisión",
  REWORK = "Rectificación",
  DELIVERY = "Completo",
}
export const ActionsText = {
  NONE: "Ninguno",
  UPDATE: "Guardar",
  EDIT: "Editar",
  NEW: "Crear",
  DELETE: "Eliminar",
  RESEND: "Reenviar",
  BLOCK: "Bloquear",
  VIEW: "Ver",
  CANCEL: "Cancelar",
  RESET_PASSWORD: "Restablecer contraseña",
  SEARCH: "Buscar",
  SEND: "Enviar",
  GET_INTO: "Ingresar",
  GET_NEXT: "Siguiente",
  GET_CURRENT: "Actual",
};

/* Buttons Text */
export const buttonsTexts = {
  ADD: "AGREGAR",
  NEW: "CREAR",
  EDIT: "EDITAR",
  DELETE: "ELIMINAR",
  CANCEL: "CANCELAR",
  SAVE: "GUARDAR",
  RECTIFICATION: "RECTIFICAR",
  REVISION: "REVISAR",
  CLOSE_ORDER: "TERMINAR",
  GET_INTO: "INGRESAR",
};
/* Texto modal */

export const modalHeader = {
  EDIT: "EDITAR",
  ADD: "AGREGAR",
};

/* Table */
export const textPaginator = {
  PAGINE: "Página",
  TOTAL_REGISTER: "Total de registros:",
  SHOW: "Mostrar",
};

/* MAX CHARACTER */

export const maxCharacter = {
  ID: 3,
  DESCRIPTION: 30,
  CODE: 10,
  COLOR:12,
  NAME: 45,
  EMAIL: 25,
  MARKET: 20,
  USERNAME: 20,
  TRADEMARK: 20,
  BOX_ASSEMBLY: 10,
  BOX_REVISION: 10,
  BOX_RECTIFICATION: 10,
  PICKUP: 10,
  DATE: 10,
  VIN: 6,
};
