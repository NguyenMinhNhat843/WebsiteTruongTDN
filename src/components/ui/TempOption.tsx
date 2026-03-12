import React from "react";

export interface Option {
  label: string;
  value: string;
}

interface SelectOptionProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[]; // Nhận mảng object {label, slug}
  required?: boolean;
  placeholder?: string;
}

const SelectOption = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  placeholder,
}: SelectOptionProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          backgroundSize: "1rem",
        }}
      >
        <option value="">{placeholder || "-- Chọn một tùy chọn --"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectOption;
