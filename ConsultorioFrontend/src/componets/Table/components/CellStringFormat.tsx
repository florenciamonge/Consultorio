
import TooltipGeneric from "../../Tooltips/TooltipGeneric";
import { reduceString } from '../../../utils/reduceStringLarge';

interface Props {
  cell: string;
  showTooltip?: boolean;
  maxCharacter?: number;
}

const CellStringFormat = ({ cell, showTooltip, maxCharacter }: Props) => {
  return (
    <>
      {showTooltip ? (
        <TooltipGeneric position="top" description={cell}>
          <span style={{ fontSize: '13px' }}>{reduceString(cell, maxCharacter)}</span>
        </TooltipGeneric>
      ) : (
        <span style={{ fontSize: '13px' }}>{reduceString(cell, maxCharacter)}</span>
      )}
    </>
  );
};

export default CellStringFormat;
