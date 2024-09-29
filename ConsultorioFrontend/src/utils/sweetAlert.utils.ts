import Swal, { SweetAlertResult } from "sweetalert2";
import "./sweetAlert2.toast.css";

export function showToast(type: any, title: any, text: any,time?: number) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-right",
    iconColor: "white",
    customClass: {
      popup: "colored-toast",
      icon: `colored-toast swal2-icon-${type}`,
      title: "colored-toast",
      htmlContainer: "colored-toast",
    },
    showConfirmButton: false,
    timer: time || 2800,
    timerProgressBar: true,
  });

  return Toast.fire({
    icon: type,
    title: title,
    html: text,
  });
}

export interface Alert {
  title: string;
  text: string;
  icon: any;
  toast?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  cancelButtonText?: string;
  cancelButtonAriaLabel: string;
  reverseButtons?: boolean;
  msgConfirm: {
    title: string;
    description: string;
  };
  msgCancel: {
    title: string;
    description: string;
  };
}

/* Cuando cancelas devuelve otro alerta */
export const showAlertConfirm = (callback: () => void, opt: Alert) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      title: "fs-5",
      confirmButton: "btn btn-success m-1",
      cancelButton: "btn btn-danger m-1",
      icon: "fs-6",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      backdrop: false,
      title: opt.title,
      text: opt.text,
      icon: opt.icon,
      showCancelButton: opt.showCancelButton,
      confirmButtonText: opt.confirmButtonText,
      cancelButtonText: opt.cancelButtonText,
      reverseButtons: opt.reverseButtons,
    })
    .then((result: SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons
          .fire(opt.msgConfirm.title, opt.msgConfirm.description, "success")
          .then(() => {
            callback();
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          opt.msgCancel.title,
          opt.msgCancel.description,
          "error"
        );
      }
    });
};
/* Sin cartel de alerta al no confirmar */
export const showAlertExitConfirm = (
  callback: () => void,
  opt: Alert,
  callbackCancel?: () => void
) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      title: "fs-5",
      confirmButton:
        "text-align-center d-flex justify-content-center align-items-center btn btn-success m-1",
      cancelButton:
        "text-align-center d-flex justify-content-center align-items-center btn btn-danger m-1",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      toast: opt.toast,
      title: opt.title,
      text: opt.text,
      icon: opt.icon,
      showCancelButton: opt.showCancelButton,
      confirmButtonColor: opt.confirmButtonColor,
      cancelButtonColor: opt.cancelButtonColor,
      cancelButtonAriaLabel: opt.cancelButtonAriaLabel,
      cancelButtonText: opt.cancelButtonText,
      confirmButtonText: opt.confirmButtonText,
    })
    .then((result) => {
      if (result.isConfirmed) {
        callback();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        if (callbackCancel) {
          callbackCancel();
        }
      }
    });
};

export const customAlert = (msg: string, iconAlert: any) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      title: "fs-4",
      confirmButton: "btn btn-success m-1",
      cancelButton: "btn btn-danger m-1",
      icon: "fs-6",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons.fire({
    title: msg,
    icon: iconAlert,
  });
};
