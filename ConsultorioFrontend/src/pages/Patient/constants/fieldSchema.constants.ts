import * as yup from "yup";

export const FormSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string().required("El nombre es requerido"),
      surname: yup.string().nullable(),
      phone: yup.string().required("El telefono es requerido"),
      dni: yup.string().required("El DNI es requerido"),
      healthInsurance: yup.bool(),
      email: yup.string().email().nullable(),
      statusId: yup.number().required("El ID del estado es requerido"),
    })
    .required();
}