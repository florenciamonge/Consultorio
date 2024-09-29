import axios from "axios";
import {
  APIResponse,
  APIURL,
} from "../../../utils/constants/api/api.constants";
import { getHeaderLogged } from "../../../utils/constants/api/headers.utils";
import { checkSessionToken } from "../../../utils/constants/api/token";
import { APIPatient, PostPatient } from "../interfaces/patient.interface";

export const getPatients = async () => {
  try {
    const response = await axios.get<APIPatient[]>(`${APIURL}/patients`);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los pacientes");
  }
};

export const getPatientById = async (id: number) => {
  try {
    const response = await axios.get(
      `${APIURL}/Patient/${id}`,
      {
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
    checkSessionToken<APIPatient>(response);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener el paciente por ID");
  }
};

export const createPatient = async (data: PostPatient) => {
  try {
    const response = await axios.post<APIResponse<PostPatient>>(
      `${APIURL}/Patient/insert`,
      data,
      {
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
    checkSessionToken<PostPatient>(response);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al crear el paciente");
  }
};

export const updatePatient = async <T>(data: T) => {
  try {
    const response = await axios.put<APIResponse<APIPatient>>(
      `${APIURL}/Patient/update`,
      data,
      {
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
 
    checkSessionToken<APIPatient>(response);
    response.headers = getHeaderLogged();

    return response.data;
  } catch (error) {
    throw new Error("Error al actualizar el paciente");
  }
};

export const deletePatient = async (id: number[] | number) => {
  try {
    const response = await axios.delete<APIResponse<APIPatient>>(
      `${APIURL}/Patient/delete`,
      {
        data: [id],
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
    checkSessionToken<APIPatient>(response);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar el paciente");
  }
};

export const canBeDeletedPatient = async (id: number[] | number) => {
  try {
    const response = await axios.get(
      `${APIURL}/Patient/canbedeleted?ids=${id}`,
      {
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
    checkSessionToken<APIPatient>(response);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar el paciente");
  }
};

export const searchPatient = async <T>(searchTerm: T) => {
  try {
    const response = await axios.get<APIResponse<APIPatient>>(
      `${APIURL}/Patient/search/filtering?search=${searchTerm}`,
      {
        headers: {
          ...getHeaderLogged(),
        },
      }
    );
    checkSessionToken<APIPatient>(response);
    response.headers = getHeaderLogged();
    return response.data;
  } catch (error) {
    throw new Error("Error al buscar el paciente");
  }
};
