import { useCallback, useMemo, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
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
  AccessoryUrls,
  QueryParams,
} from "../../utils/constants/api/api.constants";
import {
  Actions,
  ActionsText,
  ToastHeader,
  alertMessages,
  alertTypes,
  deleteConfirmation,
  maxCharacter,
  miscDefault
} from "../../utils/constants/globalText.constants";


import {
  patientColumnsAndLabelTexts,
  alertCustomMessages,
  defaultValuesForm,
  sectionPatient,
  titleABM,
} from "./constants/patient.constants";
import {
  APIPatient,
  PostPatient,
  PutPatient,
  TypeActions,
} from "./interfaces/patient.interface";


import { useAuthStore } from "../../store/auth";
import TooltipGeneric from "../../componets/Tooltips/TooltipGeneric";
import Divider from '../../../layout/Header/Divider';
import ErrorBoundary from '../../../layout/Header/ErrorBoundary';
import Search from '../../../layout/Header/Search';
import PageHeader from '../../../layout/Header/PageHeader';
import { deletePatient, canBeDeletedPatient } from './Service/patient.service';
import { buildUrl } from '../../utils/builUrl.utils';
import { ModalGeneric } from '../../componets/Modal/ModalGeneric';
import { activeOptions } from '../../utils/constants/selectValues.constants';
import { Table } from '../../componets/Table/Table';
import StatusList from '../../componets/Lists/StatusList';
import CellStringFormat from '../../componets/Table/components/CellStringFormat';
import { DataRowForm } from "./DataRowForm";

const PatientPage = () => {
  const checkDateSession = useAuthStore((state) => state.checkDateSession);
  const [showModalImage, setShowModalImage] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    APIPatient | null
  >(null);
  const [action, setAction] = useState<TypeActions>(Actions.NONE); //1 NUEVO // 2 EDIT // NONE GRILLA
  const [showModalForm, setShowModalForm] = useState(false);
  const [dataRow, setDataRow] = useState<
    PutPatient | PostPatient | APIPatient | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  const url = useMemo(() => {
    if (searchTerm) {
      const searchUrl = AccessoryUrls.filtering; // Acceso a la propiedad en minúsculas
      const relativePath = searchUrl.relativePath;
      const queryParams: QueryParams = searchUrl.qParams || {}; // queryParams ahora es opcional, inicializado como un objeto vacío si no existe
      queryParams.search = searchTerm;
      return buildUrl(APIURL, relativePath, queryParams);
    } else {
      const allUrl = AccessoryUrls.all; // Acceso a la propiedad en minúsculas
      const relativePath = allUrl.relativePath;
      return buildUrl(APIURL, relativePath);
    }
  }, [searchTerm]);

  const { data, error, refresh } = useFetch<
    APIResponse<APIPatient[]> | APIPatient[]
  >(url);

  /* Handlers */
  const handleRefresh = () => {
    if (refresh) {
      refresh();
    }
  };
  const handleCloseModalImage = () => {
    checkDateSession();
    setSelectedRow(null);
    setShowModalImage(false);
  };

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
      Header: patientColumnsAndLabelTexts.HEADER_MARKET,
      accessor: "marketTextESP",
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
      Header: patientColumnsAndLabelTexts.HEADER_CODE,
      accessor: "code",
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
      Header: patientColumnsAndLabelTexts.HEADER_STATE,
      accessor: "enabled",
      width: 20,
      minWidth: 90,
      maxWidth: 2,
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      Cell: (row: CellProps<APIPatient>) => (
        <StatusList idSelected={row.cell.value} options={activeOptions} />
      ),
    },
    {
      Header: patientColumnsAndLabelTexts.HEADER_IMAGE,
      accessor: "image",
      headerClassNameAlignText: "text-center",
      rowClassNameAlignText: "text-center",
      width: 25,
      disableSortBy: true,
      minWidth: 100,
      maxWidth: 3,
      Cell: (row: CellProps<APIPatient>) => {
        return (
          <>

            <Image
              src={row.row.original.image || miscDefault}
              alt={miscDefault}
              width={"80%"}
              height={40}
              className="border border-1 border-gray rounded-3"

              style={{
                cursor: "pointer",
                objectFit: "cover",


              }}
              onClick={() => {
                setSelectedRow(row.row.original);
                setShowModalImage(true);
              }}
            />


            <ModalGeneric
              show={showModalImage}
              onHide={handleCloseModalImage}
              title={`${selectedRow?.name}`}
              keyboard={true}
              backdrop={true}
              optSize="lg"
              key={row.row.original.id.toString()}
            >
              <Image
                id={selectedRow?.id.toString()}
                src={selectedRow?.image || miscDefault}
                alt={miscDefault || selectedRow?.name}

                style={{
                  cursor: "pointer",
                  objectFit: "cover",
                  aspectRatio: " 16/9",
                  width: "100%",
                  height: "100%",
                  maxHeight: "100%",
                  maxWidth: "100%",
                  margin: "auto",
                  display: "block",
                }}
              />

            </ModalGeneric>
          </>

        )
      }
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
    <ErrorBoundary resetCondition={dataGrid} error={error}>
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
    </ErrorBoundary>
  );
};

export default PatientPage;
