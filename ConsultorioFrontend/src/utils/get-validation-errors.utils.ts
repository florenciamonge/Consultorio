import { TypeWithKey } from './interfaces/type-with-key';
/* Manejador de errores de peticiones 
- Maneja desde el interceptor las peticiones con errores y toma su code error para darle un mensaje personalizado.
*/



export const getValidationError = (errorCode: string)=>{
    const codeMatcher:TypeWithKey<string> = {
        ERR_NETWORK: "Error de red",
        ERR_CANCELED: "Petición duplicada",
        ERR_BAD_REQUEST: `Petición fallida de tipo: ${errorCode} `
    }

    return codeMatcher[errorCode]
}   