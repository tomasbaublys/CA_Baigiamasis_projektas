import { FormInputProps } from '../../../types';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import Textarea from '../atoms/Textarea';

type Props = Omit<FormInputProps, 'labelHtmlFor'> & {
  inputOnChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputOnBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  as?: 'input' | 'textarea';
  rows?: number;
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
  as = 'input',
  rows,
}: Props) => {
  return (
    <div>
      <Label labelHtmlFor={inputId} labelText={labelText} />
      {as === 'textarea' ? (
        <Textarea
          name={inputName}
          id={inputId}
          value={inputValue}
          onChange={inputOnChange}
          onBlur={inputOnBlur}
          placeholder={inputPlaceholder}
          rows={rows}
        />
      ) : (
        <Input
          inputType={inputType}
          inputName={inputName}
          inputId={inputId}
          inputValue={inputValue}
          inputOnChange={inputOnChange}
          inputOnBlur={inputOnBlur}
          inputPlaceholder={inputPlaceholder}
        />
      )}
      {errors && touched && <p className="error">{errors}</p>}
    </div>
  );
};

export default InputField;