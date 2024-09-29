import * as yup from "yup";

export const FormSchema = () => {
  return yup
    .object()
    .shape({
      name: yup.string().required("El nombre es requerido"),
      description: yup.string().nullable(),
      image: yup.string().nullable(),
      code: yup
        .string()
        .nullable(),
      marketId: yup.number().required("El ID del mercado es requerido"),
    })
    .required();
}