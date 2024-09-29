import React, { useEffect } from "react";
import { Image, InputGroup } from "react-bootstrap";
import {
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { miscDefault, profileDefault } from "../../../utils/constants/globalText.constants";
import { ImageContainer } from "./loadImage.styled.ts";

interface LoadImageProps<FormValues extends Record<string, any>> {
  handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: () => void;
  imageFile: string | null;
  setImageFile: (file: string | null) => void;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  fieldName: Path<FormValues>;
  profileMisc?: boolean;
}

const LoadImage = <FormValues extends Record<string, any>>({
  handleUploadImage,
  handleRemoveImage,
  imageFile,
  register,
  setValue,
  fieldName,
  profileMisc = false,
}: LoadImageProps<FormValues>) => {
  //Carga de imagen en el input para que lo detecte react-hook-form
  useEffect(() => {
    if (imageFile) {
      setValue(
        fieldName,
        imageFile as PathValue<FormValues, Path<FormValues>>,
        {
          shouldDirty: true,
        }
      );
    }
  }, [imageFile, setValue]);

  return (
    <ImageContainer>
      <InputGroup
        size="sm"
        className="input-image-upload d-flex justify-content-end align-self-center"
      >
        <div className="input-group-append">
          <label className="input-group-text" htmlFor="fileInput">
            <i className="bi bi-upload" />
          </label>
          {/* Enviar el campo image como null si es "" */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="d-none"
            {...register(fieldName)} // Registramos el campo image con el valor
            onChange={handleUploadImage}
          />
        </div>
      </InputGroup>
      <Image
        className="img-container shadow img-fluid"
        roundedCircle
        src={(imageFile || (profileMisc ? profileDefault : miscDefault))}
        alt="Vista previa"
      />
      <div className="input-image-delete ">

        <div className="shadow btn-delete"
          onClick={() => {
            handleRemoveImage();
            setValue(
              fieldName,
              null as PathValue<FormValues, Path<FormValues>>,
              {
                shouldDirty: true,
              }
            );
          }}
        >
          <i className="bi bi-x"></i>
        </div>

      </div>
    </ImageContainer>
  );
};

export default LoadImage;
