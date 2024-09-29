import { Badge } from "react-bootstrap";
import { getLabelById } from '../../utils/getLabels.utils';


interface Props {
  idSelected: number;
  options: { value: number; label: string }[];
}

const StatusList = ({ idSelected, options }: Props) => {
  const statusLabel = getLabelById(idSelected, options);

  return (
    <div className="m-0 h-100 p-0 d-flex align-items-center justify-content-center">
      <Badge
        pill
        style={{ fontSize: "10px" }}
        className={
          statusLabel === "Activo"
            ? "bg-gradient bg-success text-white"
            : "bg-gradient bg-danger text-white"
          /*   : statusLabel === "Pendiente de Validación"
            ? "bg-gradient bg-warning text-white bg-opacity-90"
            : "bg-gradient bg-danger text-white bg-opacity-75" */
        }
        bg={
          statusLabel === "Activo"
            ? "success"
            : "danger"
           /*  : statusLabel === "Pendiente de Validación"
            ? "warning"
            : "danger" */
        }
      >
        <div className="text-wrap p-1">
          {statusLabel === "" ? "S/E" : statusLabel}
        </div>
      </Badge>
    </div>
  );
};

export default StatusList;
