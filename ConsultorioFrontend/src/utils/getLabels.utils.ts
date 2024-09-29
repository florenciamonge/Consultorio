//Return always string
// Input : 1 | true , [{value:1,label:"Activo"},{value:0,label:"Inactivo"}] => "Activo"

import { Option } from "react-multi-select-component";

// Input : 0 | false , [{value:1,label:"Activo"},{value:0,label:"Inactivo"}] => "Inactivo"
export const getLabelById = (
  id: number | boolean | number[] | undefined | null,
  arrOpts: { value: number; label: string }[]
) => {
  //Asegura que devuelva siempre un string en el return
  if(id === null) return "";
  // check if undefined
  if (typeof id === "undefined") {
    return "";
  }
  if (typeof id === "number") {
    const label = arrOpts.find(
      (option: { value: number; label: string }) => option?.value === id
    );
    return label ? label?.label : "";
  } else if (typeof id === "boolean") {
    const booleanId = id === true ? 1 : 0;
    const label = arrOpts.find(
      (option: { value: number; label: string }) => option?.value === booleanId
    );
    return label ? label?.label : "";
  }
  // Si es un array de numeros en
  return "";
};

export const getIdByLabel = (
  label: string,
  arrOpts: { value: number; label: string }[]
) => {
  // check if undefined
  if (typeof label === "undefined") {
    return 0;
  }
  const id = arrOpts.find(
    (option: { value: number; label: string }) => option?.label === label
  );
  return id ? id.value : 0;
};



/* Obtiene el array de los labels de los checkbox en true  */
export const getLabelByObj = (
  options: { value: number; label: string }[],
  propsCheck: Record<string, any>
): string[] => {
  const arrCheckprops = Object.keys(propsCheck);
  const arrCheckTrueLabel = arrCheckprops.filter(
    (checkOpt) => propsCheck[checkOpt]
  );
  const arrCheckTrueId = arrCheckTrueLabel.map((label) =>
    getIdByLabel(label, options)
  );
  const arrCheckTrueLabelOpts = arrCheckTrueId.map((id) =>
    getLabelById(id, options)
  );
  return arrCheckTrueLabelOpts;
};
/* Obtiene el array de los ids de los checkbox recibe el objeto con el nombre del checkbox y su value boolean y lo transforma y devuelve el id de ese checkbox en un array si esta   */
/* 
Input : ([{value: 1, label: 'Nissan'},{value: 2, label: 'Renault'}] ,{ nissan : true , renault : true })
Output : [1,2]

*/
export const getIdsByObj = (
  options: Option[],
  propsCheck: Record<string, boolean>
): number[] => {
  const arrCheckTrueLabels = Object.keys(propsCheck).filter(
    (checkOpt) => propsCheck[checkOpt]
  );

  const arrCheckTrueIds = arrCheckTrueLabels.map((label) =>
    options.find((option) => option.label.toLowerCase() === label)?.value
  );

  return arrCheckTrueIds.filter((id) => id !== undefined) as number[];
};
// Input : 
/* export const roleOptions = [
  { value: 1, label: "administrator" },
  { value: 2, label: "administrative" },
  { value: 3, label: "operator" },
];

export const roleESP = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Administrativo" },
  { value: 3, label: "Operador" },
] */

// Input : [1,2] ,  Output roleESP => ["Administrador","Administrativo"]
// Input : [1,2,3] ,Output roleESP => ["Administrador","Administrativo","Operador"]
// Input : [1,2,3,4] , Output roleESP => ["Administrador","Administrativo","Operador"]

export const getLabelByIds = ( ids: number[], arrOpts: { value: number; label: string }[]) => {
  const labels = ids.map(id => getLabelById(id,arrOpts))
  return labels

}

export const getIdByOpts = ( id: number, arrOpts: { value: number; label: string }[]) => {
  const valueId = arrOpts.find((option: { value: number; label: string }) => option?.value === id)
  return valueId ? valueId?.value : 0

}