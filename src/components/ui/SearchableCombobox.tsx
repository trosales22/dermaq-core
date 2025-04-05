import { FC, useState } from "react";
import { Combobox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface ComboboxItem {
  id: string;
  label: string;
}

interface SearchableComboboxProps {
  label: string;
  items: ComboboxItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  placeholder?: string;
}

const SearchableCombobox: FC<SearchableComboboxProps> = ({
  label,
  items,
  selectedId,
  onSelect,
  placeholder,
}) => {
  const selectedItem = items.find((i) => i.id === selectedId);
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? items
      : items.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <Combobox value={selectedId} onChange={onSelect}>
        <div className="relative">
          <Combobox.Input
            className="input input-bordered w-full"
            displayValue={() => selectedItem?.label || ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || "Search..."}
            autoComplete="off"
          />
          <Combobox.Button className="absolute inset-y-0 right-2 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Combobox.Button>

          {filtered.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
              {filtered.map((item) => (
                <Combobox.Option
                  key={item.id}
                  value={item.id}
                  className={({ active }) =>
                    clsx("px-4 py-2 cursor-pointer", {
                      "bg-blue-100 text-blue-900": active,
                    })
                  }
                >
                  {({ selected }) => (
                    <div className="flex justify-between items-center">
                      <span>{item.label}</span>
                      {selected && <Check className="w-4 h-4" />}
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
};

export default SearchableCombobox;