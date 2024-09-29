import { AES, enc } from "crypto-js";
import Swal from "sweetalert2";
import { create } from "zustand";
import { PersistStorage, persist } from "zustand/middleware";


import {
  ToastHeader,
  alertMessages,
  alertTypes,
} from "../utils/constants/globalText.constants";

import { showToast } from '../utils/sweetAlert.utils';
import { dateTimeStringToMilliseconds } from '../utils/date-format.utils';
import { TokenOutputDTO } from '../pages/User/interface/user.interface';



/* 
auth.ts
- Permite guardar el token en el localstorage con persist 
*/

// Define la clave secreta para encriptar y desencriptar datos
const secretKey = "authStore";

export interface UserProfile {
  action: number;
  toUpdate?: string[];
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  avatar?: string | null;
  administrative: boolean;
  administrator: boolean;
  operator: boolean;
  status: number;
  statusId: number;
  statusText: string;
  lastConnection: number;
  tokenOutputDTO?: TokenOutputDTO;
  collaboratorId?: number | null;
  collaborator?: string[];
  boxId: number;
  boxName: string;
}

export const defaultValuesProfile: UserProfile = {
  id: 0,
  action: 1,
  name: "",
  surname: "",
  username: "",
  email: "",
  avatar: null,
  administrative: false,
  administrator: false,
  operator: false,
  status: 0,
  statusId: 0,
  statusText: "",
  lastConnection: 0,
  collaboratorId: 0,
  collaborator: [],
  boxId: 0,
  boxName: "",
};

type State = {
  token: string;
  profile: null | UserProfile;
  isAuth: boolean;
  lastDateUpdate: number;
};

type Actions = {
  setToken: (token: string) => void;
  setProfile: (profile: UserProfile) => void;
  logout: () => void;
  setLastDateUpdate: () => void;
  checkDateSession: () => void;
  setEncryptedState: (state: State) => void;
  loadAndDecryptState: () => void;
};

const initialState: State = {
  token: "",
  profile: defaultValuesProfile,
  isAuth: false,
  lastDateUpdate: 0,
};

const customStorage: PersistStorage<State & Actions> = {
  getItem: (key) => {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      return JSON.parse(
        AES.decrypt(encryptedData, secretKey).toString(enc.Utf8)
      );
    }
    return null;
  },
  setItem: (key, value) => {
    const encryptedData = AES.encrypt(
      JSON.stringify(value),
      secretKey
    ).toString();
    localStorage.setItem(key, encryptedData);
  },
  removeItem: (key) => localStorage.removeItem(key),
};

export const useAuthStore = create(
  persist<State & Actions>(
    (set) => ({
      ...initialState,
      setToken: (token: string) =>
        set(() => ({
          token,
          isAuth: true,
        })),
      /* Actualiza los datos del perfil del usuario */
      setProfile: (profile: UserProfile) =>
        set(() => ({
          profile,
        })),
      logout: () =>
        set((state) => {
          Swal.close(); // Cierra todas las alertas abiertas
          state.checkDateSession();
          /* Navigate to login */
         
          return {
            token: "",
            profile: defaultValuesProfile,
            isAuth: false,
            lastDateUpdate: 0,
          };
        }),
      setLastDateUpdate: () =>
        set(() => ({
          lastDateUpdate: dateTimeStringToMilliseconds(
            new Date().toISOString()
          ),
        })),
      // Funcion que  valida si currentDate - lastDateUpdate > 60 seconds execute logout  las fechas estan en milisegundos
      checkDateSession: () =>
        set((state) => {
          const currentDate = dateTimeStringToMilliseconds(
            new Date().toISOString()
          );
          const diff = (currentDate - state.lastDateUpdate) / 1000; // Dividir por 1000 para convertir a segundos

          // Verificar si han pasado más de 1 hora
          if (diff > 3600 && state.lastDateUpdate !== 0) {
            setTimeout(() => {
              showToast(
                alertTypes.WARNING,
                ToastHeader.SUCCESS_REDIRECT,
                alertMessages.SESSION_EXPIRED
              );
            }, 50);

            return {
              token: "",
              profile: defaultValuesProfile, // Restablecer el perfil del usuario
              isAuth: false, // Establecer el estado de autenticación en falso
              lastDateUpdate: 0, // Restablecer la última fecha de actualización
            };
          } else {
            // Actualiza lastDateUpdate para que no se cierre la sesión debido a la fecha
            state.lastDateUpdate = currentDate;
            return {
              lastDateUpdate: currentDate,
            };
          }
        }),
      setEncryptedState: (state: State) => {
        // Encripta el estado y devuelve el resultado en forma de string
        const encryptedState = AES.encrypt(
          JSON.stringify(state),
          secretKey
        ).toString();

        return encryptedState;
      },
      loadAndDecryptState: () => {
        // Carga el estado encriptado desde el localStorage y lo desencripta
        const encryptedState = localStorage.getItem("auth");
        if (encryptedState) {
          // Desencripta los datos y devuelve el estado como objeto
          const decryptedState = AES.decrypt(
            encryptedState,
            secretKey
          ).toString(enc.Utf8);
          const state: State = JSON.parse(decryptedState);
          return state;
        }
        // Si no hay datos encriptados, devuelve el estado inicial
        return initialState;
      },
    }),
    {
      name: "auth",
      storage: customStorage,
    }
  )
);
