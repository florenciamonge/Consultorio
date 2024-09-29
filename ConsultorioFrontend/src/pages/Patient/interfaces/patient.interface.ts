export interface APIPatient {
    id: number;
    action?:number;
    marketId:number;
    marketTextESP:string;
    marketTextBRA:string;
    marketTextENG:string;
    name: string;
    image:string | null
    description:string | null;
    code: string | null;
    enabled: boolean;
    toUpdate?: string[];
  }
  export interface APIPatientFront{
    id: number;
    name: string;
    marketId:number;
    marketTextESP:string;
    marketTextBRA:string;
    marketTextENG:string;
    image?:string;
    description?:string;
    code?: string;
    enabled: boolean;
    toUpdate?: string[];
  }
  
  export interface PutPatient {
    id: number;
    action:number;
    name: string;
    marketId:number;
    image?:string | null
    description?:string | null;
    code?: string | null;
    enabled: boolean;
    toUpdate?: string[];
  }
  
  export interface PutWithToUpdatePatient {
    id: number;
    action: number;
    toUpdate: string[];
  }
  
  export interface PostPatient {
    action: number;
    name: string | null;
    image?:string | null
    description?:string | null;
    code?: string | null;
    marketId:number;
    enabled: boolean;
  }
  
  export interface DeletePatient {
    id: number;
  }
  
  export type TypeActions = "PUT" | "DELETE" | "POST" | "NONE";
  