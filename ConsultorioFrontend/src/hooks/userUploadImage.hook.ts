import imageCompression from "browser-image-compression";
import { ChangeEvent, useState } from "react";

interface UseUploadImageResult {
  handleUploadImage: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => void;
  imageFile: string | null;
  setImageFile: (file: string | null) => void;
}

const useUploadImage = (initialValue: string | null): UseUploadImageResult => {
  const [imageFile, setImageFile] = useState<string | null>(initialValue);

  const handleUploadImage = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const compressedFile = await compressImage(files[0]);
      const base64 = await convertBase64(compressedFile);
      setImageFile(base64);
    } else {
      setImageFile(null);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Tamaño máximo permitido en megabytes
      maxWidthOrHeight: 800, // Ancho o altura máxima permitida
      useWebWorker: true, // Utilizar un worker web para comprimir la imagen en segundo plano (opcional)
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      throw new Error("Error al comprimir la imagen");
    }
  };

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error: ProgressEvent<FileReader>) => {
        reject(error);
      };
    });
  };
  //Funcion que remueve la imagen y setea el stado del hook a null
  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return {
    handleUploadImage,
    handleRemoveImage,
    imageFile,
    setImageFile,
  };
};

export default useUploadImage;
