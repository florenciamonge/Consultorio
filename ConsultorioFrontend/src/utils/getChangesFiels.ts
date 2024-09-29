// Funcion que devuelve un array de los campos que cambiaron en mi formulario Ej: [ 'Name', 'Description', 'Price' ]

export const getChangedFields = <T extends Record<string, any>>(
    originalData: T,
    changedData: T
  ): (keyof T)[] => {
    const changedFields: (keyof T)[] = [];
    // originalData es undefined o vacio no hacer nada y salir de la funcion
    if (originalData === undefined || Object.keys(originalData).length === 0) {
      return changedFields;
    }
    // Comparar los campos de originalData con los de changedData y agregarlos a changedFields
    for (const key in originalData) {
      if (
        typeof key === "string" &&
        key in originalData &&
        originalData[key as keyof T] !== changedData[key as keyof T]
      ) {
        changedFields.push(key as keyof T);
      }
    }
  
    // Action y Update  no deben estar en el array de campos que cambiaron
    const index = changedFields.indexOf("action");
    if (index > -1) {
      changedFields.splice(index, 1);
    }
    const index2 = changedFields.indexOf("toUpdate");
    if (index2 > -1) {
      changedFields.splice(index2, 1);
    }
  
    // Pasar a mayuscular la primer letra de cada campo
    const changedFieldsUpper = changedFields
      .map((field) =>
        // Si el campo contiene OutputDTO  eliminar OutPutDTO de la palabra  y dejar el resto ademas que quede en mayuscula ej  accessoryOutputDTO => Accessory
  
        field.toString().includes("OutputDTO")
          ? field.toString().replace("OutputDTO", "")
          : field.toString()
      )
      //Verifica si el accessory es un array vacio si es asi eliminar el campo del array Accessory  por que no se va a actualizar ese campo
      .map((field) =>
        field.toString().includes("[]")
          ? field.toString().replace("[]", "")
          : field.toString()
      )
      //Verifica si el accessory es undefined si es asi eliminar el campo del array Accessory  por que no se va a actualizar ese campo
      .map((field) =>
        field.toString().includes("Undefined")
          ? field.toString().replace("Undefined", "")
          : field.toString()
      )
      .map((field) => field.charAt(0).toUpperCase() + field.slice(1));
  
    // Si algun campo no cambia no mandarlo en el ToUpdate
    if (changedFieldsUpper.includes("ToUpdate")) {
      const index = changedFieldsUpper.indexOf("ToUpdate");
      if (index > -1) {
        changedFieldsUpper.splice(index, 1);
      }
    }
    // Si algun campo es [] o undefined no mandarlo en el ToUpdate
    if (changedFieldsUpper.includes("[]")) {
      const index = changedFieldsUpper.indexOf("[]");
      if (index > -1) {
        changedFieldsUpper.splice(index, 1);
      }
    }
    if (changedFieldsUpper.includes("Undefined")) {
      const index = changedFieldsUpper.indexOf("Undefined");
      if (index > -1) {
        changedFieldsUpper.splice(index, 1);
      }
    }
  
    // Filtrar los campos que cambiaron y agregarlos a changedFieldsUpperFiltered
    const changedFieldsUpperFiltered = changedFieldsUpper.filter((field) =>
      typeof field === "string" ? field.length > 0 : field
    );
  
    return changedFieldsUpperFiltered;
  };
  
  // Funcion que devuelve un objeto con los campos que cambiaron en mi formulario Ej: { name: 'Nombre', description: 'Descripcion', price: 100 }
  export const getChangedData = <T extends Record<string, any>>(
    changedFields: (keyof T)[],
    data: T
  ): Partial<T> => {
    const changedData: Partial<T> = {};
  
    // Convertir las claves de changedFields a lowercase para que coincidan con las claves de data
    const changedFieldsLower = changedFields.map((field) =>
      typeof field === "string" ? field.toLowerCase() : field
    );
  
    // Filtrar los campos que han cambiado y agregarlos a changedData
    for (const key in data) {
      if (
        Object.prototype.hasOwnProperty.call(data, key) &&
        typeof key === "string" &&
        changedFieldsLower.includes(key.toLowerCase())
      ) {
        changedData[key as keyof T] = data[key as keyof T];
      }
      // Si algun campo tiene el valor undefined no agregarlo a changedData y sacarlo de changedFields
      if (changedData[key as keyof T] === undefined) {
        const index = changedFields.indexOf(key);
        if (index > -1) {
          changedFields.splice(index, 1);
        }
      }
    }
  
    return changedData;
  };
  