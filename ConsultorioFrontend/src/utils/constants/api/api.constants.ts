import axios from "axios";

/* export const baseURL =
  import.meta.env.VITE_MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:3031";

  console.log(baseURL,'baseURL') */

export const APIURL =
  import.meta.env.VITE_MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5260";


export const api = axios.create({
  baseURL: APIURL,
  headers: {
    "Content-Type": "application/json",
  },
});
export interface TokenOutPutDTO {
  action:                number;
  toUpdate:              string[];
  id:                    number;
  value:                 string;
  status:                number;
  validFrom:             Date;
  validTo:               Date;
  maximumExpirationTime: Date;
  claims:                Claims;
  renovated:             boolean;
  error:                 string;
}

export interface Claims {
[claim: string]: string | number | boolean | Date | null;
}
export interface APIResponse<T> {
  dataType: string;
  succeeded: boolean;
  innerCode: number;
  innerMessage: string;
  transaction: string;
  executeStarted: Date;
  executeFinished: Date;
  tokenOutputDTO: TokenOutPutDTO;
  timeInSeconds: number;
  error: string;
  debug: string;
  data: T | null;
}

export type QueryParams = {
  [key: string]:
    | string
    | number
    | string[]
    | number[]
    | undefined
    | null
    | boolean
    | Date;
};
type AlternativeUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
type PatientUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
type PickupUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
type BoxUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
type UserUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
type WorkOrderUrls = {
  [key: string]: {
    relativePath: string;
    qParams?: QueryParams; // Los queryParams son ahora opcionales para mayor flexibilidad
  };
};
/* Patient */
export const PatientUrls: PatientUrls = {
  all: { relativePath: "Patient/all" },
  list: { relativePath: "Patient/list" },
  filtering: {
    relativePath: "Patient/filtering",
    qParams: { search: "search" },
  },
  // ... otros endpoints
};

/* Pickup */
export const PickupUrls: PickupUrls = {
  all: { relativePath: "Pickup/all" },
  list: { relativePath: "Pickup/list" },
  getPickupsByTrademark: { relativePath: "Pickup/GetPickupsByTrademark" },

  get: {
    relativePath: "Pickup/get",
    qParams: { id: "id" },
  },
  filtering: {
    relativePath: "Pickup/filtering",
    qParams: { search: "search" },
  },
};

export const BoxUrls: BoxUrls = {
  all: { relativePath: "Box/all" },
  list: { relativePath: "Box/list" },
  canbedeleted: { relativePath: "Box/canbedeleted" },
  filtering: {
    relativePath: "Box/filtering",
    qParams: { search: "search" },
  },
  getBoxClassification: {
    relativePath: "Box/GetBoxClassificationList",
  },
};

export const UserUrls: UserUrls = {
  all: { relativePath: "User/all" },
  get: { relativePath: "User/get", qParams: { id: "id" } },
  list: { relativePath: "User/list", qParams: { opcion: "opcion" } },
  filtering: {
    relativePath: "User/filtering",
    qParams: { search: "search" },
  },
};

export const AlternativeUrls: AlternativeUrls = {
  all: { relativePath: "Alternative/all" },
  list: { relativePath: "Alternative/list" },
  canbedeleted: {
    relativePath: "Alternative/canbedeleted",
  },
  filtering: {
    relativePath: "Alternative/filtering",
    qParams: { search: "search" },
  },
};

/* WorkOrder */
export const WorkOrderUrls: WorkOrderUrls = {
  getNext: {
    relativePath: "WorkOrder/getNext",
  },
  getCurrent: {
    relativePath: "WorkOrder/getCurrent",
  },
  getByVIN: {
    relativePath: "WorkOrder/getByVIN",
    qParams: {},
  },
  getReportByVIN: {
    relativePath: "WorkOrder/getReportByVIN",
    qParams: {},
  },
  query: { relativePath: "WorkOrder/query" },
  getWorkOrderStatus: { relativePath: "WorkOrder/GetWorkOrderStatus" },
};

/* Enviroment */
export const EnvironmentUrl = {
  getPropertiesForSelect: {
    relativePath: "Environment/GetPropertiesForSelect",
  },
};
