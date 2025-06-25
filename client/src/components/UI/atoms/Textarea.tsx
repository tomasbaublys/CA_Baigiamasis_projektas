type Props = {
  name: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
};

const Textarea = ({ name, id, value, onChange, onBlur, placeholder, rows = 4 }: Props) => {
  return (
    <textarea
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

export default Textarea;