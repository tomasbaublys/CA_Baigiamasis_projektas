import { FormInputProps } from '../../../types';

type Props = Pick<
  FormInputProps,
  | 'inputType'
  | 'inputName'
  | 'inputId'
  | 'inputValue'
  | 'inputOnChange'
  | 'inputOnBlur'
  | 'inputPlaceholder'
> & {
  inputOnChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  inputOnBlur: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const Input = ({
  inputType,
  inputName,
  inputId,
  inputValue,
  inputOnChange,
  inputOnBlur,
  inputPlaceholder,
}: Props) => {
  return (
    <input
      type={inputType}
      name={inputName}
      id={inputId}
      value={inputValue}
      onChange={inputOnChange}
      onBlur={inputOnBlur}
      placeholder={inputPlaceholder}
    />
  );
};

export default Input;