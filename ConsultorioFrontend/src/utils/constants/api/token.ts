/* 
Redirect if response of peticion is Not renueved 
*/
import { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../store/auth";

import {
  ToastHeader,
  alertMessages,
  alertTypes,
} from "../globalText.constants";
import { APIResponse } from "./api.constants";
import { showToast } from '../../sweetAlert.utils';

export const checkSessionToken = async <T>(
  response: AxiosResponse<APIResponse<T>>
) => {
  try {
    const { innerCode ,tokenOutputDTO} = response?.data;

    if (innerCode === 710 ) {
      useAuthStore.getState().logout();
      Swal.close();
      setTimeout(() => {
        showToast(
          alertTypes.WARNING,
          ToastHeader.SUCCESS_REDIRECT,
          alertMessages.SESSION_EXPIRED
        );
      }, 500);
    } else {
      if (tokenOutputDTO?.renovated) {
        useAuthStore.getState().setToken(tokenOutputDTO?.value);
      } 
 
    }
  } catch (error) {
    console.log(error);
  }
};
