import { FormInputProps } from '../../../types';

type Props = Pick<FormInputProps, 'labelHtmlFor' | 'labelText'>;

const Label = ({ labelHtmlFor, labelText }: Props) => {
  return <label htmlFor={labelHtmlFor}>{labelText}</label>;
};

export default Label;