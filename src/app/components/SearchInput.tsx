import { InputText } from "primereact/inputtext";

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

export default function SearchInput({ placeholder, onSearch }: SearchInputProps) {
  return (
    <span className="p-input-icon-left p-2">
      <i className="pi pi-search" />
      <InputText
        className="p-inputtext p-component"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
      />
    </span>
  );
}
