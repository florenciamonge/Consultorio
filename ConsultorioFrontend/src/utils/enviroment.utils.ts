import { Option } from "react-multi-select-component";
import { APIPatient } from '../pages/Patient/interfaces/patient.interface';



export interface APIEnviroments {
  [key: string]:
    | APIEnviromentOpts[]
    | APIPatient[]
}
// Keys: workOrderFinalStatus, userStatus, boxStatus, market, pickupTrademark, workOrderStatus, alternativeStatus
export enum EnviromentKeys {
  userStatus = "userStatus",
  patientStatus = "patientStatus",
}

export interface APIEnviromentOpts {
  propertyId: number;
  propertyValueId: number;
  name: string;
  type: string;
  code: string;
  propertyCode: string;
  valueString: string;
  valueDateTime: Date;
  valueInt: number;
  valueFloat: number;
  textES: string;
  textEN: string;
  textPT: string;
  propertyValueDescription: null;
  action: number;
  toUpdate: string[];
}

export const getEnviromentOptions = <T extends Record<string, any>>(
  data: T[],
  selectedKey: string,
  textKey: string,
  valueKey: string
): Option[] => {
  const output: Option[] = [];

  if (!data) return output;

  data.forEach((env) => {
    if (Object.prototype.hasOwnProperty.call(env, selectedKey)) {
      const properties = env[selectedKey];

      const labels: string[] = properties.map(
        (property: Record<string, any>) => property[textKey]
      );
      const values: number[] = properties.map(
        (property: Record<string, any>) => property[valueKey]
      );

      output.push(
        ...values.map((value, index) => ({ value, label: labels[index] }))
      );
    }
  });

  return output;
};

// Carga la data de los multiselect de los list.
// Input: data: T[] = []  devuelve un array de objetos con de tipo [{value: number, label: string}]
// Output: [{value: number, label: string}, {value: number, label: string}, {value: number, label: string}]
// No se puede repetir el value ni el label

// agregar un parametro que diga por que propiedad se va a filtrar  del array de data
export const getOptionsList = <T, K extends keyof T>(
  data: T[],
  idSelected: K = "id" as K, // por defecto se usa la propiedad id
  selectedLabel: K = "name" as K // por defecto se usa la propiedad name
): Option[] => {
  const uniqueLabels = new Set(data.map((item) => item[selectedLabel]));

  const uniqueData = Array.from(uniqueLabels).map((label) => {
    return data.find((item) => item[selectedLabel] === label);
  });

  const filteredData = uniqueData.filter(
    (item): item is T => item !== undefined
  );

  return filteredData.map((item) => ({
    value: item[idSelected],
    label: item[selectedLabel] as string,
  }));
};
