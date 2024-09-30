
/* INTERFACE GET ALL DE TODOS LOS PACIENTES DEL SWAGGER */
export interface APIPatient {
    id: number;
    name: string;
    surname: string;
    dni:string;
    statusId:number;
    statusTextESP:string;
    healthInsurance:boolean;
    mail:string;
    phone:string;
    action?:number;
    toUpdate?: string[]; 
   /*  action?:number;
    marketId:number ;
     marketTextESP:string;
    marketTextBRA:string;
    marketTextENG:string;
    name: string;
    image:string | null
    description:string | null;
    code: string | null;
    enabled: boolean;
    toUpdate?: string[]; */
  }

  export interface PutPatient {
    id: number;
    action:number;
    name: string;
    surname: string;
    dni:string;
    statusId:number;
    statusTextESP:string;
    healthInsurance:boolean;
    mail:string;
    phone:string;
    toUpdate?: string[];
  }
  
  export interface PutWithToUpdatePatient {
    id: number;
    action: number;
    toUpdate: string[];
  }
  
  export interface PostPatient {
    action: number;
    name: string;
    surname: string;
    dni:string;
    statusId:number;
    statusTextESP:string;
    healthInsurance:boolean;
    mail:string;
    phone:string;
  }
  
  export interface DeletePatient {
    id: number;
  }
  
  export type TypeActions = "PUT" | "DELETE" | "POST" | "NONE";
  