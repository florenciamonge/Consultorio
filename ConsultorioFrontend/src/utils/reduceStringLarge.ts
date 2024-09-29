export const reduceString = (text : string, maxChar = 60):string => {
    if (!text) return "";
    const totalLarge =  text.length; 
    if(totalLarge > maxChar) {
        return `${text.substring(0, maxChar)}... `;
    }
    return text;
}