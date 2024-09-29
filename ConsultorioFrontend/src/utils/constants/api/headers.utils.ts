// Este archivo obtiene los headers del usuario logueado

import { useAuthStore } from "../../../store/auth";



export const getHeaderLogged = () => {
  // Desencriptar los headers
  const desencriptedHeaders = useAuthStore.getState().loadAndDecryptState();
  const { state } = desencriptedHeaders as any;
  const headersP = {
    Authorization: `${state.token}`,
    userID: state.profile?.id as number,
    boxID: state.profile?.boxId as number,
    collaboratorID: state.profile?.collaboratorId as number,
    operator: state.profile?.operator as boolean,
    administrator: state.profile?.administrator as boolean,
    administrative: state.profile?.administrative as boolean,
  };

  return headersP;
};
