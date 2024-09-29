
import { customAlert, showToast } from "../sweetAlert.utils";
import { APIResponse } from "./api/api.constants";
import { alertTypes, ToastHeader } from './globalText.constants';

// Definición de la interfaz para los mensajes de error en español
interface ErrorMessages {
  [errorCode: number]: string;
}

// Objeto que mapea códigos de error a mensajes en español
const errorMessages: ErrorMessages = {
  100: "Ha ocurrido un error inesperado. Por favor, intente nuevamente.",
  110: "El nombre de usuario que intenta registrar ya está en uso. Por favor, elija otro.",
  120: "Este correo electrónico ya está registrado. ¿Olvidó su contraseña o desea intentar con otro?",
  130: "El VIN ingresado está en uso. Verifique y pruebe con otro VIN.",
  131: "El código ya está en uso. Verifique y pruebe con otro código.",
  140: "El VIN no corresponde al puesto asignado.",
  141: "No se puede gestionar el VIN en este puesto con la configuración actual.",
  150: "La contraseña ingresada es incorrecta o no coincide. Por favor, verifique y vuelva a intentarlo.",
  151: "La contraseña es demasiado corta (mínimo 8 caracteres). Por favor, verifique y vuelva a intentarlo.",
  152: "La contraseña debe contener una letra minúscula.",
  153: "La contraseña debe contener una letra mayúscula.",
  154: "La contraseña debe contener una letra y un número.",
  155: "La contraseña debe contener un carácter especial (ej: !@#$%^&*).",
  160: "Debe completar la orden actual antes de avanzar a la siguiente.",
  170: "El VIN proporcionado ya está siendo gestionado en otro puesto.",
  610: "No se puede eliminar porque tiene registros asociados.",
  630: "No se puede eliminar este registro porque está asociado a una orden.",
  640: "Las credenciales proporcionadas no son válidas. Por favor, verifique y vuelva a intentarlo.",
  650: "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
  660: "No se encontró un usuario o email con los datos proporcionados. Por favor, verifique y vuelva a intentarlo.",
  670: "La contraseña ingresada es incorrecta. Por favor, intente nuevamente.",
  690: "Este accesorio no puede deshabilitarse ya que está asociado a un modelo específico.",
  710: "Su sesión ha expirado. Por favor, acceda de nuevo para continuar.",
  1002:"Acceso denegado. No tiene permiso para realizar esta acción.",
};

// Función para manejar los errores de la API
export function handleApiError<T>(
  response: APIResponse<T>,
  modetoast?: boolean,
  time?: number
): void | string {
  const { innerCode } = response;
  let spanishErrorMessage = '';
  
  // Obtener el mensaje en español correspondiente desde el objeto errorMessages
  spanishErrorMessage = errorMessages[innerCode] || "Error desconocido";

  // Si lo quiero mostrar en un toast y no en u alert
  if (modetoast) {
    showToast(alertTypes.ERROR, ToastHeader.ERROR, spanishErrorMessage,time);
    return spanishErrorMessage;
  } else {
    // Mostrar el mensaje de error en español
    customAlert(spanishErrorMessage, alertTypes.ERROR);
  }
}

// Función de tipo guard para verificar si un objeto es de tipo APIResponse
export function isAPIResponse(obj: any): obj is APIResponse<unknown> {
  return "dataType" in obj && "succeeded" in obj && "innerCode" in obj;
}
