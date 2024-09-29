import { Dropdown, DropdownButton } from "react-bootstrap";
import { useAuthStore } from "../../store/auth";

interface Props {
  variant?: string | undefined;
  options: (string | number)[];
  title: string;
  textOption?: string | undefined;
  onSelectOption: (e: any) => void;
  size?: "sm" | "lg" | undefined;
  style?: any;
  menuVariant: string | undefined;
}

export function GenericDropDown({
  size,
  variant,
  title,
  options,
  textOption,
  onSelectOption,
  style,
  menuVariant,
}: Props) {
  const checkDateSession = useAuthStore((state) => state.checkDateSession);

  return (
    <Dropdown style={style} onSelect={onSelectOption}>
      <DropdownButton
        key={variant}
        id={`dropdown-split-variants-${variant}`}
        variant={variant}
        onClick={checkDateSession}
        title={title}
        size={size}
        menuVariant={menuVariant}
      >
        {options.map((opt) => (
          <Dropdown.Item key={opt as string} eventKey={opt as string}>
            {textOption} {opt}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Dropdown>
  );
}

export default GenericDropDown;
