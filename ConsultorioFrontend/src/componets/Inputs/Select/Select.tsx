import { useController, UseControllerProps } from "react-hook-form";
import { Form } from "react-bootstrap";
import { FieldValues, Path, PathValue } from "react-hook-form";

interface SelectOptions {
  value: number | string | boolean;
  label: string;
  disabled?: boolean;
}

interface SelectGroupProps<T extends FieldValues = FieldValues> extends Omit<UseControllerProps<T>, 'defaultValue'> {
  options: SelectOptions[];
  defaultValue?: PathValue<T, Path<T>>;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  value?: PathValue<T, Path<T>>;
}

const SelectGroup = <T extends FieldValues>({
  options,
  name,
  control,
  defaultValue,
  onChange,
  disabled,
  value,
}: SelectGroupProps<T>) => {
  const {
    field: { ref, ...selectProps },
  } = useController({ name, control, rules: {}, defaultValue });

  return (
    <>
      <Form.Select
        style={{ maxHeight: "1.5rem"  }}     
        as="select"
        {...selectProps}
        value={value as string | number | undefined}
        onChange={(e) => {
          selectProps.onChange(e); // Actualiza el valor del campo en el formulario
          if (onChange) {
            onChange(e); // Ejecuta la función onChange personalizada
          }
        }}
        disabled={disabled}
      >
        {defaultValue && <option disabled>{String(defaultValue)}</option>}
        {options.map((option) => (
          <option
            style = {{ maxHeight: "1.5rem"  }}
            key={String(option.value)}
            value={String(option.value)}
            disabled={option?.disabled}
          >
            {option.label}
          </option>
        ))}
      </Form.Select>
    </>
  );
};

export default SelectGroup;
