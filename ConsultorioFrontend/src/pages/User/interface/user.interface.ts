export interface TokenOutputDTO {
    id: number;
    value: string;
    status: number;
    validFrom: Date;
    validTo: Date;
    /* claims:    Claims; */
    action: number;
    toUpdate: string[];
  }