import { useEffect, useState, type ComponentProps } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EditableCellProps extends Omit<ComponentProps<"input">, "onChange"> {
  initialValue: any;
  rowIndex: number;
  columnId: string;
  updateCellData: (rowIndex: number, columnId: string, value: any) => void;
}

export const EditableCell = ({
  initialValue,
  rowIndex,
  columnId,
  updateCellData,
  className,
  type = "text",
  ...props
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Chỉ khi người dùng click ra ngoài (onBlur) mới đẩy data lên state tổng của cha
  const handleBlur = () => {
    let finalValue = value;
    if (type === "number") {
      finalValue = value === "" ? "" : Number(value);
    }
    updateCellData(rowIndex, columnId, finalValue);
  };

  return (
    <input
      {...props}
      type={type}
      className={`w-full bg-transparent px-1 py-0.5 border border-transparent hover:border-gray-300 
        focus:border-blue-500 focus:bg-white rounded outline-none ${className}`}
      value={value ?? ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};
