import { useCallback, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { CellProps } from "react-table";


import useFetch from "../../hooks/useFetch.hook";

import {
  customAlert,
  showAlertExitConfirm,
  showToast,
} from "../../utils/sweetAlert.utils";

import {
  APIResponse,
  APIURL,
  PatientUrls,
  QueryParams,
} from "../../utils/constants/api/api.constants";
import {
  Actions,
  ActionsText,
  ToastHeader,
  alertMessages,
  alertTypes,
  deleteConfirmation,
  maxCharacter
} from "../../utils/constants/globalText.constants";


import {
  alertCustomMessages,
  defaultValuesForm,
  patientColumnsAndLabelTexts,
  sectionPatient,
  titleABM,
} from "./constants/patient.constants";
import {
  APIPatient,
  PostPatient,
  PutPatient,
  TypeActions,
} from "./interfaces/patient.interface";


import TooltipGeneric from "../../componets/Tooltips/TooltipGeneric";
import { useAuthStore } from "../../store/auth";



import { buildUrl } from '../../utils/builUrl.utils';
import { canBeDeletedPatient, deletePatient } from './Service/patient.service';
/* import { ModalGeneric } from '../../componets/Modal/ModalGeneric';
import { activeOptions } from '../../utils/constants/selectValues.constants'; */
import { Table } from '../../componets/Table/Table';

import CellStringFormat from '../../componets/Table/components/CellStringFormat';
import Search from "../../Header/Search";
import Divider from "../../layout/Header/Divider";
import PageHeader from "../../layout/Header/PageHeader";
import { DataRowForm } from "./DataRowForm";

const PatientPage = () => {
  const checkDateSession = useAuthStore((state) => state.checkDateSession);
  /*   const [showModalImage, setShowModalImage] = useState(false);
    const [selectedRow, setSelectedRow] = useState<
      APIPatient | null
    >(null); */
  const [action, setAction] = useState<TypeActions>(Actions.NONE); //1 NUEVO // 2 EDIT // NONE GRILLA
  const [showModalForm, setShowModalForm] = useState(false);
  const [dataRow, setDataRow] = useState<
    PutPatient | PostPatient | APIPatient | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* ESTO ARMA LA URL SI ES POR BUSQUEDA O POR GETALL DE LA TABLA */
  const url = useMemo(() => {
    if (searchTerm) {
      /* SEARCH FILTERING */
      const searchUrl = PatientUrls.filtering; // Acceso a la propiedad en minúsculas
      const relativePath = searchUrl.relativePath;
      const queryParams: QueryParams = searchUrl.qParams || {}; // queryParams ahora es opcional, inicializado como un objeto vacío si no existe
      queryParams.search = searchTerm;
      return buildUrl(APIURL, relativePath, queryParams);
    } else {
      /* GET ALL */
      const allUrl = PatientUrls.all; // Acceso a la propiedad en minúsculas
      const relativePath = allUrl.relativePath;
      return buildUrl(APIURL, relativePath);
    }
  }, [searchTerm]);

  /* GET ALL URL O SEARCH */
  const { data, error, refresh } = useFetch<
    APIResponse<APIPatient[]> | APIPatient[]
  >(url);//Patien/all

/* SIGUIENTE PASO VER DATA */
console.log(data,'Patient/all')
  /* Handlers */
  const handleRefresh = () => {
    if (refresh) {
      refresh();
    }
  };
  /*   const handleCloseModalImage = () => {
      checkDateSession();
      setSelectedRow(null);
      setShowModalImage(false);
    }; */

  const handleShow = () => {
    checkDateSession();
    setShowModalForm(true);
  };
  const handleClose = () => {
    checkDateSession();
    setShowModalForm(false);
  };

  const onAddDataRow = () => {
    checkDateSession();
    setAction(Actions.NEW);
    setDataRow(defaultValuesForm);
    handleShow();
  };

  const onEditDataRow = useCallback((dataRow: PutPatient) => {
    checkDateSession();
    setAction(Actions.UPDATE);
    setDataRow(dataRow);
    setShowModalForm(true);
  }, []);

  const onDeleteDataRow = async (dataRowId: number) => {
    await deletePatient(dataRowId)
      .then((res) => {
        if (res !== undefined) {
          showToast(
            alertTypes.SUCCESS,
            ToastHeader.SUCCESS_DELETE,
            alertCustomMessages.DELETE
          );
          handleRefresh();
        }
      })
      .catch(() => {
        customAlert(alertCustomMessages.ACCESSORY_DELETE, alertTypes.ERROR);
      });
  };

  const onCanBeDeleted = async (dataRowId: number) => {
    try {
      const response = await canBeDeletedPatient(dataRowId);
      const responseData = response?.data;

      if (Array.isArray(responseData[dataRowId])) {
        const canBeDeleted = responseData[dataRowId].every(
          (item: { succeeded: boolean }) => item.succeeded
        );

        if (canBeDeleted) {
          showAlertExitConfirm(
            () => {
              onDeleteDataRow(dataRowId);
            },
            deleteConfirmation,
            checkDateSession
          );

        } else {
          customAlert(alertCustomMessages.ACCESSORY_CAN_BE_DELETED, alertTypes.WARNING)
        }
      } else {
        customAlert(alertMessages.NOT_FOUND, alertTypes.ERROR);
      }
    } catch (error) {
      console.log(error)
      customAlert(alertMessages.ERROR, alertTypes.ERROR);
    }
  };

  /* Search */
  const onHandlerSearch = (term: string) => {
    setSearchTerm(term);
    checkDateSession();
  };

  /* Table */
  const dataGrid = useMemo(() => (data ? data.data : []), [data]);
  const columns = [
    {
      Header: patientColumnsAndLabelTexts.HEADER_ID,
      accessor: "id",
      width: 12,
      minWidth: 50,
      maxWidth: 1,
      headerClassNameAlignText: "text-end",
      rowClassNameAlignText: "text-end",
      Cell: ({ row }: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={String(row?.original?.id)}
          showTooltip={true}
          maxCharacter={maxCharacter.ID}
        />
      ),
    },

    {
      Header: patientColumnsAndLabelTexts.HEADER_NAME,
      accessor: "name",
      headerClassNameAlignText: "text-start",
      rowClassNameAlignText: "text-start",
      width: 10,
      minWidth: 250,
      maxWidth: 50,
      Cell: (row: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={row?.cell?.value}
          showTooltip={true}
          maxCharacter={maxCharacter.NAME}
        />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_SURNAME,
      accessor: "surname",
      width: 10,
      minWidth: 100,
      maxWidth: 3,
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      Cell: (row: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={row?.cell?.value}
          showTooltip={true}
          maxCharacter={maxCharacter.MARKET}
        />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_DNI,
      accessor: "dni",
      width: 10,
      minWidth: 100,
      maxWidth: maxCharacter.CODE,
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      Cell: (row: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={row?.cell?.value}
          showTooltip={true}
          maxCharacter={maxCharacter.CODE}
        />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_EMAIL,
      accessor: "mail",
      width: 20,
      minWidth: 90,
      maxWidth: 2,
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      Cell: (row: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={row?.cell?.value}
          showTooltip={true}
          maxCharacter={maxCharacter.CODE}
        />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_HEALTHINSURANCE,
      accessor: "healthInsurance",
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      width: 25,
      disableSortBy: true,
      minWidth: 100,
      maxWidth: 3,
      Cell: (row: CellProps<APIPatient>) => (
        <CellStringFormat
          cell={row?.cell?.value}
          showTooltip={true}
          maxCharacter={maxCharacter.CODE}
        />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_ACTIONS,
      width: 60,
      minWidth: 90,
      maxWidth: 1,
      Cell: (row: CellProps<PutPatient>) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TooltipGeneric
            position="top"
            description={`${ActionsText.UPDATE}`}
            descriptionBold={`${sectionPatient.PATIENT}`}
          >
            <Button
              size="sm"
              onClick={() => onEditDataRow({ ...row.row.original })}
              className="btn btn-primary mx-1"
            >
              <i className="bi bi-pencil"></i>
            </Button>
          </TooltipGeneric>
          <TooltipGeneric
            position="top"
            description={`${ActionsText.DELETE}`}
            descriptionBold={`${sectionPatient.PATIENT}`}
          >
            <Button
              size="sm"
              onClick={() => {
                checkDateSession();
                onCanBeDeleted(row.row.original.id);
              }}
              className="btn btn-danger mx-1"
            >
              <i className="bi-solid bi-trash"></i>
            </Button>
          </TooltipGeneric>
        </div>
      ),
    },
  ];

  if (error) showToast(alertTypes.ERROR, ToastHeader.ERROR, error.message);

  return (

    <>
      <PageHeader title={titleABM}>
        <Button
          variant="success"
          onClick={onAddDataRow}
          className="btn btn-success mx-1"
          style={{ fontSize: "13px" }}
        >
          <i className="bi bi-plus-lg"></i>
        </Button>

        <Search onSearch={onHandlerSearch} />
      </PageHeader>
      <Divider />
      {/* GET ALL */}
      <Row>
        <Col style={{ width: "100px" }}>
          <Table columns={columns} data={dataGrid} />
        </Col>
      </Row>
      <DataRowForm
        show={showModalForm}
        onHandleCloseModal={handleClose}
        type={action}
        /* dataGrid={dataGrid as APIAccessory[]} */
        data={
          action === Actions.UPDATE
            ? (dataRow as PutPatient)
            : (dataRow as PostPatient)
        }
        refresh={handleRefresh}
      />

    </>
  );
};

export default PatientPage;
