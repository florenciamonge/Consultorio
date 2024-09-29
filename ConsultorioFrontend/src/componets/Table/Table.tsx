import { useCallback, useMemo } from "react";
import { Table as BTable, Col, Row } from "react-bootstrap";

import {
  TableOptions,
  TableState,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";


import { useAuthStore } from "../../store/auth";
import { v } from "../../styles";
import { textPaginator } from "../../utils/constants/globalText.constants";

import Divider from '../../../layout/Header/Divider';
import GenericDropDown from '../Dropdown/Dropdown';

interface Props {
  columns: any;
  data: any;
  hideFooter?: boolean;
  showAllRecords?: boolean;
  onRowClick?: (row: any) => void;
  enableRowClick?: boolean;
}

interface CustomTableState<T extends object> extends TableState<T> {
  pageSize: number;
}

// Be sure to pass our updateMyData and the skipPageReset option
export const Table = ({
  columns,
  data,
  hideFooter /* skipPageReset */,
  showAllRecords,
  onRowClick,
  enableRowClick,
}: Props) => {
  const checkDateSession = useAuthStore((state) => state.checkDateSession);
  const columnsMemo = useMemo(() => [...columns], [columns]);
  const defaultColumn = useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200, // maxWidth is only used as a limit for resizing
    }),
    []
  );
  const initialState: Partial<CustomTableState<any>> = {
    pageSize: showAllRecords && data ? data.length : 10,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,

    state: { pageIndex, pageSize },
  }: any = useTable<any>(
    {
      columns: columnsMemo,
      data,
      defaultColumn,
      initialState,
    } as TableOptions<any>,
    useSortBy,
    usePagination,
    useRowSelect,
    useFlexLayout,
    useResizeColumns
  );

  const handleGoToPage = useCallback(() => {
    checkDateSession();
    gotoPage(0);
  }, [gotoPage]);
  const handlePreviousPage = useCallback(() => {
    checkDateSession();
    previousPage();
  }, [previousPage]);
  const handleNextPage = useCallback(() => {
    checkDateSession();
    nextPage();
  }, [nextPage]);
  const handleGoToPage2 = useCallback(() => {
    checkDateSession();
    gotoPage(pageCount - 1);
  }, [gotoPage, pageCount]);

  return (
    <>
      <BTable
        hover
        bordered
        striped
        className="p-0 m-0"
        responsive
        style={{ boxShadow: v.shadowMd }}
        variant={"light"}
        size="xm"
        {...getTableProps()}
      >
        <thead
          style={{
            fontSize: "14px",
          }}
          onClick={checkDateSession}
        >
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  className={column.headerClassNameAlignText}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {/* Resizing */}

                  {/* Add a sort direction indicator */}
                  <span onClick={checkDateSession}>
                    {column.isSorted &&
                      (column.isSortedDesc ? (
                        <i className="bi bi-arrow-down-short"></i>
                      ) : (
                        <i className="bi bi-arrow-up-short"></i>
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {!data ||
          (data.length === 0 && (
            <tbody className="h-100">
              <tr>
                <td colSpan={data.length}>
                  <div className="text-start text-md-center p-1">
                    <i className="bi bi-exclamation-circle p-1"></i>
                    <span className="text-danger">No hay resultados</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ))}

        <tbody
          {...getTableBodyProps()}
          style={{ cursor: enableRowClick ? `pointer` : `auto` }}
        >
          {page.map((row: any) => {
            prepareRow(row);
            return (
              // Agregar cursor pointer sin afecatar a los headers de la tabla

              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any, idx: number) => {
                  return (
                    <td
                      onClick={() => onRowClick && onRowClick(row.original)}
                      {...cell.getCellProps()}
                      className={row.cells[idx].column.rowClassNameAlignText}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      {!hideFooter && <Divider />}
      <Row
        className={
          hideFooter
            ? `d-none`
            : `d-flex justify-content-between align-items-center gap-1 gap-md-0 p-1`
        }
        style={{ fontSize: "12px" }}
      >
        <Col
          md={4}
          lg={4}
          className="d-flex justify-content-center align-items-center justify-content-md-start "
        >
          {pageOptions.length > 0 && (
            <span>
              {textPaginator.PAGINE}
              <strong className="ms-1">
                {pageIndex + 1} / {pageOptions.length}
              </strong>{" "}
              -
            </span>
          )}
          {textPaginator.TOTAL_REGISTER}{" "}
          <strong className="ms-1">{pageOptions.length}</strong>
        </Col>
        <Col
          md={4}
          lg={4}
          className="d-flex gap-1 justify-content-center align-items-center justify-content-sm-center justify-content-md-center"
        >
          <button
            className="btn btn-sm btn-secondary"
            style={{ padding: "0 5px", height: "25px" }}
            onClick={handleGoToPage}
            disabled={!canPreviousPage}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            style={{ padding: "0 5px", height: "25px" }}
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            style={{ padding: "0 5px", height: "25px" }}
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            style={{ padding: "0 5px", height: "25px" }}
            onClick={handleGoToPage2}
            disabled={!canNextPage}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
        </Col>
        <Col
          md={4}
          lg={4}
          className="d-flex justify-content-center align-items-center  justify-content-md-end"
        >
          <GenericDropDown
            onSelectOption={(e) => {
              setPageSize(Number(e));
            }}
            variant={"secondary"}
            title={`${textPaginator.SHOW} ${pageSize}`}
            menuVariant={"dark"}
            textOption={textPaginator.SHOW}
            size={"sm"}
            options={[10, 20, 30, 40, 50]}
          />
        </Col>
      </Row>
    </>
  );
};
