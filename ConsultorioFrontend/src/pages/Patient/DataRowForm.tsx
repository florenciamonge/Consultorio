import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useForm } from "react-hook-form";


import {
  Actions,
  ToastHeader,
  alertTypes,
  buttonsTexts,
  changesStateFieldConfirmation,
  modalHeader,
  saveChangesConfirmation
} from "../../utils/constants/globalText.constants";
import { getLabelById } from "../../utils/getLabels.utils";


import {
  patientColumnsAndLabelTexts,
  alertCustomMessages,
  defaultValuesForm,
} from "./constants/patient.constants";

import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectSchema } from "yup";

import useFetch from "../../hooks/useFetch.hook";
import { useAuthStore } from "../../store/auth";
import { APIURL } from "../../utils/constants/api/api.constants";
import {
  handleApiError,
  isAPIResponse,
} from "../../utils/constants/errors-handler.constants";
import { activeOptions } from "../../utils/constants/selectValues.constants";

import { FormSchema } from "./constants/fieldSchema.constants";
import Divider from '../../../layout/Header/Divider';
import { ModalGeneric } from '../../componets/Modal/ModalGeneric';
import { showAlertExitConfirm, customAlert, showToast } from '../../utils/sweetAlert.utils';
import { getEnviromentOptions, EnviromentKeys, APIEnviroments } from '../../utils/enviroment.utils';
import { createPatient, updatePatient } from './Service/patient.service';
import { getChangedFields, getChangedData } from '../../utils/getChangesFiels';
import LoadImage from '../../componets/Inputs/LoadImage/loadImage';
import SelectGroup from '../../componets/Inputs/Select/Select';
import useUploadImage from '../../hooks/userUploadImage.hook';
import {
  PostPatient,
  PutPatient,
  TypeActions,
} from "./interfaces/patient.interface";


export type FormData = PutPatient | PostPatient;

interface Props {
  refresh: () => void;
  onHandleCloseModal: () => void;
  data: PutPatient | PostPatient;
  type: TypeActions;
  show: boolean;
}

const DataRowForm: React.FC<Props> = ({
  refresh,
  onHandleCloseModal,
  data,
  /* dataGrid, */
  type,
  show,
}) => {
  // Si es la default tambien mandar null
  const checkDateSession = useAuthStore((state) => state.checkDateSession);
  const schema = FormSchema();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isDirty, defaultValues, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: yupResolver(schema as ObjectSchema<FormData>),
    defaultValues:
      type === Actions.UPDATE ? (data as FormData) : defaultValuesForm,
  });
  // Si es profileDefault, mandar null para q no la envie al backend
  const imageUrl = data?.image ?? null;
  /* Carga de Select */
  const { data: multiSelectEnviroment } = useFetch<APIEnviroments[]>(
    `${APIURL}/Environment/GetPropertiesForSelect`
  );

  const { handleUploadImage, handleRemoveImage, imageFile, setImageFile } =
    useUploadImage(imageUrl);

  // Reset de datos en el formulario cuando se abre el modal
  useEffect(() => {
    if (type === Actions.UPDATE) {
      setImageFile(imageUrl);
      reset(data);
    } else {
      setImageFile(null);
      reset(defaultValuesForm);
    }
  }, [type, reset, data, setImageFile, imageUrl]);

  const resetInputs = () => {
    setImageFile(imageUrl);
    reset();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setValue(name as keyof FormData, value);
  };

  // Lanza el alerta de confirmación para el cierre del modal.
  const handleOnCloseModalConfirmation = () => {
    if (isDirty) {
      showAlertExitConfirm(
        () => {
          saveChanges();
          resetInputs();
        },
        saveChangesConfirmation,
        () => {
          resetInputs();
        }
      );
    } else {
      onHandleCloseModal();
    }
  };

  const handleModalStateConfirmation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const select = Boolean(+e.target.value);

    if (dirtyFields.enabled && type === Actions.UPDATE) {
      showAlertExitConfirm(
        () => {
          setValue("enabled", select,
            { shouldDirty: true }
          );
        },
        changesStateFieldConfirmation,
        () => {
          reset(type === Actions.UPDATE ? (data as FormData) : defaultValuesForm);
        }
      );
    } else {
      setValue("enabled", select, {
        shouldDirty: watch("enabled"),
      });
    }
  };

  function addEnabled(changedFields: string[]): string[] {
    // Verifica si "Enabled" ya está en el array
    if (!changedFields.includes('Enabled')) {
      // Si no está, agrega "Enabled" al inicio del array
      return ['Enabled', ...changedFields];
    }

    // Si "Enabled" ya está en el array, simplemente devuelve el array original
    return changedFields;
  }

  const onSubmit = async (data: FormData) => {
    checkDateSession();
    if (type === Actions.UPDATE) {
      const changedFields = getChangedFields(
        defaultValues as PutPatient,
        data
      );
      const changedData = getChangedData(changedFields, data as PutPatient);

      const updatedPatient = {
        action: 2,
        id: (data as PutPatient).id,
        toUpdate: addEnabled(changedFields),
        image: imageFile ? imageFile : null,
        enabled: (data as PutPatient).enabled,
        ...changedData,
      };

      await updatePatient(updatedPatient)
        .then((ok) => {
          if (!ok.succeeded) {
            throw ok;
          } else {
            showToast(
              alertTypes.INFO,
              ToastHeader.SUCCESS_UPDATE,
              alertCustomMessages.ACCESSORY_UPDATE
            );
            refresh();
            onHandleCloseModal();
            resetInputs();
          }
        })
        .catch((error) => {
          if (isAPIResponse(error)) {
            // Handle API errors using the new function
            handleApiError(error, true);
          } else {
            // Handle other errors
            customAlert(error.message, alertTypes.ERROR);
          }
        });


    } else {
      const { name, marketId, enabled, code, description } =
        data as PostPatient;
      const newAccessory: PostPatient = {
        name: name,
        marketId: marketId,
        enabled,
        code: code,
        description: description,
        image: imageFile ? imageFile : null,
        action: 1,
      };

      await createPatient(newAccessory)
        .then((ok) => {
          if (!ok.succeeded) {
            throw ok;
          } 
          else {
            showToast(
              alertTypes.SUCCESS,
              ToastHeader.SUCCESS_CREATE,
              alertCustomMessages.ACCESSORY_CREATE
            );
            refresh();
            onHandleCloseModal();
            resetInputs();
          }
        })
        .catch((error) => {
          if (isAPIResponse(error)) {
            // Handle API errors using the new function
            handleApiError(error, true);
          } else {
            // Handle other errors
            customAlert(error.message, alertTypes.ERROR);
          }
        });
    }
  };

  const saveChanges = () => {
    checkDateSession();
    handleSubmit(onSubmit)();
  };
  return (
    <ModalGeneric
      optSize={"lg"}
      title={type === Actions.UPDATE ? modalHeader.EDIT : modalHeader.ADD}
      show={show}
      onHide={/* onHandleCloseModal */ handleOnCloseModalConfirmation}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Row className="h-100 d-flex d-flex justify-content-start align-items-center">
            <Col
              className="align-self-end"
              xs={{ order: "last" }}
              lg={{ order: "first" }}
            >
              <Row>
                <Col sm={12} md={6} lg={6} className="my-3">
                  <Form.Group>
                    <FloatingLabel
                      controlId={"name"}
                      label={patientColumnsAndLabelTexts.HEADER_NAME}
                      className={errors["name"] ? "is-invalid" : ""}
                    >
                      <Form.Control
                        type="text"
                        placeholder={patientColumnsAndLabelTexts.HEADER_NAME}
                        {...register("name")}
                      />
                    </FloatingLabel>
                    <ErrorMessage
                      errors={errors}
                      name={"name"}
                      render={({ message }) => (
                        <Form.Control.Feedback type="invalid">
                          {message}
                        </Form.Control.Feedback>
                      )}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} md={6} lg={6} className="my-3">
                  <Form.Group>
                    <FloatingLabel
                      controlId={"code"}
                      label={patientColumnsAndLabelTexts.HEADER_CODE}
                      className={errors["code"] ? "is-invalid" : ""}
                    >
                      <Form.Control
                        type="text"
                        placeholder={patientColumnsAndLabelTexts.HEADER_CODE}
                        {...register("code", {
                          onChange: (e) =>
                            (e.target.value = e.target.value.toUpperCase()),
                        })}
                      />
                    </FloatingLabel>
                    <ErrorMessage
                      errors={errors}
                      name={"code"}
                      render={({ message }) => (
                        <Form.Control.Feedback type="invalid">
                          {message}
                        </Form.Control.Feedback>
                      )}
                    />
                  </Form.Group>
                </Col>
              </Row>
          
            </Col>
            <Col className="align-self-center" xs={{ order: "first" }} lg={4}>
              <Form.Group>
                <FloatingLabel
                  controlId={"image"}
                  label={""}
                  className={errors["image"] ? "is-invalid" : ""}
                >
                  <LoadImage
                    handleUploadImage={handleUploadImage}
                    handleRemoveImage={handleRemoveImage}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    register={register}
                    setValue={setValue}
                    fieldName="image"
                    profileMisc={false}
                  />
                </FloatingLabel>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Col sm={12} md={12} lg={12} className="my-3">
                <Form.Group>
                  <FloatingLabel
                    controlId={"description"}
                    label={patientColumnsAndLabelTexts.HEADER_DESCRIPTION}
                    className={errors["description"] ? "is-invalid" : ""}
                  >
                    <Form.Control
                      type="text"
                      placeholder={
                        patientColumnsAndLabelTexts.HEADER_DESCRIPTION
                      }
                      {...register("description")}
                    />
                  </FloatingLabel>
                  <ErrorMessage
                    errors={errors}
                    name={"description"}
                    render={({ message }) => (
                      <Form.Control.Feedback type="invalid">
                        {message}
                      </Form.Control.Feedback>
                    )}
                  />
                </Form.Group>
              </Col>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col className="d-flex justify-content-end p-0">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                style={{ fontSize: "13px" }}
              >
                {type === Actions.UPDATE ? (isSubmitting ? <><Spinner size="sm" /> {buttonsTexts.SAVE}</> : buttonsTexts.SAVE) : (isSubmitting ? <><Spinner size="sm" /> {buttonsTexts.NEW}</> : buttonsTexts.NEW)}
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </ModalGeneric>
  );
};

const MemoizedDataRowForm = React.memo(DataRowForm);
export { MemoizedDataRowForm as DataRowForm };

