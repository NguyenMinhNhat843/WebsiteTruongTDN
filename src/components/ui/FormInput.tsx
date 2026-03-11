/**
 * FormInput
 * Component input tái sử dụng cho form (text, email, tel).
 */

import React from "react";

/**
 * Props for FormInput component
 */
export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}

/**
 * Component FormInput
 * Hiển thị label và input/textarea với styles nhất quán.
 */
export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
}: FormInputProps) {
  return (
    <label className="block text-sm">
      <span className="text-slate-700 font-medium mb-1 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
          rows={3}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition"
        />
      )}
    </label>
  );
}
