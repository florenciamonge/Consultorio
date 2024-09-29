import { JSXElementConstructor, ReactElement } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";


type placePosition = "top" | "right" | "bottom" | "left";

interface Props {
  position: placePosition;
  description: string;
  descriptionBold?: string;

  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

function TooltipGeneric({
  position,
  description,
  descriptionBold,
  children,
}: Props) {
  return (
    <OverlayTrigger
      placement={position}
      overlay={
        <Tooltip id={`tooltip-${position}`}>
          {description} <strong>{descriptionBold}</strong>
        </Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  );
}

export default TooltipGeneric;
