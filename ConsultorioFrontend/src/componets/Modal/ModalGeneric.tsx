import { Modal } from "react-bootstrap";
import styled from "styled-components";
import { theme } from "../../styles";

interface OptionsModal {
  title: string;
  btnTextClose?: string;
  onHide: () => void; // La ejecuta el children para cerrar el modal
  show: boolean;
  keyboard?: boolean;
  backdrop?: boolean | "static" | undefined;
  optSize: "sm" | "lg" | "xl" | undefined;
  children: JSX.Element | JSX.Element[];
}

export const ModalContainerStyles = styled.div`
  .m-title,
  .m-body,
  .m-footer {
    background: ${theme.bgAlpha};
    color: ${theme.text};
    transition: all 0.3s;
    border: none;
    margin: 0;
    
  }
  .m-header, .m-title{
    background: ${theme.bg3};
    color: ${theme.text};
  }
`;

export const ModalGeneric = ({
  children,
  show,
  onHide,
  title,
  keyboard=false,
  backdrop="static",
  optSize,
}: OptionsModal) => {
  return (
    <Modal
      className="modal custom"
      backdrop={backdrop}
      keyboard={keyboard}
      size={optSize}
      aria-labelledby="contained-modal-title-center"
      centered
      show={show}
      onHide={onHide}
      variant={"primary"}
    >
      <ModalContainerStyles>
        <Modal.Header className="m-header" closeButton closeVariant={undefined}>
          <Modal.Title className="m-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="m-body">{children}</Modal.Body>
        {/*    <Modal.Footer className="m-footer">
          <Button variant={theme === "light" ? "secondary": "primary"}  onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer> */}
      </ModalContainerStyles>
    </Modal>
  );
};
