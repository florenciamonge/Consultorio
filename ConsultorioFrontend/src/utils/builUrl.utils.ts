import { QueryParams } from "./constants/api/api.constants";

export const buildUrl = (
  baseUrl: string,
  relativePath: string,
  queryParams?: Record<string, any>
): string => {
  // Crear una nueva URL a partir de la URL base
  const url = new URL(baseUrl);

  // Agregar la ruta relativa a la URL
  url.pathname = relativePath;

  // Obtener los parámetros de consulta actuales de la URL (si existen)
  const currentParams = queryStringToObject(url.toString());

  // Combinar los parámetros de consulta actuales con los nuevos queryParams
  const mergedParams = { ...currentParams, ...queryParams };

  // Agregar los parámetros de consulta a la URL
  const recursiveParams = (params: Record<string, any>, prefix = ""): void => {
    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (typeof value === "object") {
        recursiveParams(value, `${prefix}${key}.`);
      } else {
        url.searchParams.append(`${prefix}${key}`, value);
      }
    });
  };

  recursiveParams(mergedParams);

  return url.toString();
};

// De queryString a Objeto
export const queryStringToObject = (url: string) => {
  let search = "";
  try {
    search = new URL(url).search;
  } catch {
    return {};
  }

  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
};

//Agregar mi vin a mi filterParams si es que existe{vin: vin, ...filterParams}}
export const generateQueryParams = (filters: QueryParams) => {
  // if exist vin add to queryParams else return filterParams

  const searchQueryParam = {};
  const flattenedFilters: QueryParams = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Si es un array
      if (value.length > 0) {
        flattenedFilters[key] = value.join(",");
      }
    } else {
      flattenedFilters[key] = value;
    }
  });
  return { ...searchQueryParam, ...flattenedFilters };
};
