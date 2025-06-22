import { FormInputProps } from '../../../types';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

type Props = Omit<FormInputProps, 'labelHtmlFor'> & {
  inputOnChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  inputOnBlur: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const InputField = ({
  labelText,
  inputType,
  inputName,
  inputId,
  inputValue,
  inputOnChange,
  inputOnBlur,
  errors,
  touched,
  inputPlaceholder,
}: Props) => {
  return (
    <div>
      <div>
        <Label labelHtmlFor={inputId} labelText={labelText} />
        <Input
          inputType={inputType}
          inputName={inputName}
          inputId={inputId}
          inputValue={inputValue}
          inputOnChange={inputOnChange}
          inputOnBlur={inputOnBlur}
          inputPlaceholder={inputPlaceholder}
        />
      </div>
      {errors && touched && <p className="error">{errors}</p>}
    </div>
  );
};

export default InputField;