// Convierte la fecha ->  Milisegundos a dd / mm / yyyy hh:mm:ss am-pm
export function formatMiliToDate(fecha: number): string {
    if (fecha === 0 || typeof fecha === "undefined" || fecha === undefined)
      return "";
    const date = new Date(fecha);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
  
    hours %= 12;
    hours = hours || 12;
  
    return `${padZero(day)}/${padZero(month)}/${year} ${padZero(hours)}:${padZero(
      minutes
    )}:${padZero(seconds)} ${ampm}`;
  }
  
  function padZero(num: number): string {
    return num.toString().padStart(2, "0");
  }
  
  /* Convierte dd / mm / yyyy hh:mm:ss am-pm a Milisegundos */
  export function parseDateToMili(fechaHora: string): number {
    if (!fechaHora) return 0;
    const [fechaPart, horaPart] = fechaHora.split(" ");
    const [day, month, year] = fechaPart.split("/");
    const [hora, minutos, segundos] = horaPart.split(":");
    const ampm = horaPart.slice(-2);
  
    let hours = parseInt(hora, 10);
    hours = ampm.toLowerCase() === "pm" ? hours + 12 : hours;
  
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      hours,
      parseInt(minutos, 10),
      parseInt(segundos, 10)
    );
  
    return date.getTime();
  }
  
  export const dateTimeStringToMilliseconds = (
    dateTimeString: string
  ): number => {
    const dateParts = dateTimeString.split("T"); // Separar la fecha y la hora (si está presente)
  
    let dateObject: Date;
    if (dateParts.length === 2) {
      // Si hay fecha y hora, utilizar ambas  
      dateObject = new Date(dateTimeString);
    } else if (dateParts.length === 1) {
      // Si solo hay fecha y no hora, asumir la hora predeterminada (00:00:00)
      dateObject = new Date(`${dateTimeString}T00:00:00`);
    } else {
      throw new Error("Formato de fecha y hora incorrecto");
    }
  
    return dateObject.getTime();
  };
  
  
  // Funcion que convierte una fecha en milisegundos (number) la separa en fecha dd/mm/yyyy y hora hh/mm/ss y la retorna en un objeto
  export const parseDateToMiliObject = (fechaHora: number): any => {
    if (!fechaHora) return 0;
    const date = new Date(fechaHora);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "pm" : "am";
  
    hours %= 12;
    hours = hours || 12;
  
    return {
      fecha: `${padZero(day)}/${padZero(month)}/${year}`,
      hora: `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)} ${ampm}`,
    };
  }
  
  // Funcion que recibe Date y devuelve la hora de esa fecha en milisegundos 
  export const dateToMili = (date: Date): number => {
    return date.getTime();
  }
  
  
  
  // date a dd/mm/yyyy MM:ss segun la localizacion 
  export const dateToLocale = (date: Date): string => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  
  };
  