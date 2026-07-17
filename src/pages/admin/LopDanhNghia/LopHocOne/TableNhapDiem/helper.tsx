import type { GradeRow } from "./NhapDiemTable";

export const calculateGrades = (
  row: Partial<GradeRow>,
): Pick<GradeRow, "diemTB" | "diemTongKet1" | "diemTongKet2"> => {
  let totalScore = 0;
  let totalWeight = 0;

  const txFields: (keyof GradeRow)[] = ["kttx1", "kttx2", "kttx3"];
  txFields.forEach((field) => {
    const val = row[field];
    if (typeof val === "number" && !isNaN(val)) {
      totalScore += val * 1;
      totalWeight += 1;
    }
  });

  const dkFields: (keyof GradeRow)[] = ["ktdk1", "ktdk2", "ktdk3", "ktdk4"];
  dkFields.forEach((field) => {
    const val = row[field];
    if (typeof val === "number" && !isNaN(val)) {
      totalScore += val * 2;
      totalWeight += 2;
    }
  });

  const diemTB =
    totalWeight > 0 ? Math.round((totalScore / totalWeight) * 10) / 10 : null;

  let diemTongKet1: number | null = null;
  if (
    diemTB !== null &&
    typeof row.diemKiemTra1 === "number" &&
    !isNaN(row.diemKiemTra1)
  ) {
    diemTongKet1 =
      Math.round((diemTB * 0.4 + row.diemKiemTra1 * 0.6) * 10) / 10;
  }

  let diemTongKet2: number | null = null;
  if (
    diemTB !== null &&
    typeof row.diemKiemTra2 === "number" &&
    !isNaN(row.diemKiemTra2)
  ) {
    diemTongKet2 =
      Math.round((diemTB * 0.4 + row.diemKiemTra2 * 0.6) * 10) / 10;
  }

  return { diemTB, diemTongKet1, diemTongKet2 };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTableSectionElement>,
  table: any,
) => {
  const target = e.target as HTMLInputElement;

  // Chỉ xử lý nếu phím bấm xuất phát từ một thẻ input/textarea
  if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") return;

  const activeKey = e.key;
  const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!arrowKeys.includes(activeKey)) return;

  // Tìm ô `td` cha gần nhất chứa input đang focus
  const currentTd = target.closest("td");
  if (!currentTd) return;

  // Lấy vị trí dòng hiện tại và ID của cột hiện tại thông qua thuộc tính data đã gán ở Bước 1
  const currentRowIdx = parseInt(
    currentTd.getAttribute("data-row-index") || "0",
    10,
  );
  const currentColId = currentTd.getAttribute("data-col-index");

  // Lấy danh sách tất cả các dòng hữu hình của Table từ TanStack
  const rows = table.getRowModel().rows;
  // Lấy danh sách ID của tất cả các cột đang hiển thị theo đúng thứ tự từ trái qua phải
  const visibleColIds = table.getVisibleFlatColumns().map((col: any) => col.id);
  const currentColIdx = visibleColIds.indexOf(currentColId || "");

  let nextRowIdx = currentRowIdx;
  let nextColIdx = currentColIdx;

  // Tính toán tọa độ ô tiếp theo dựa vào phím bấm
  switch (activeKey) {
    case "ArrowUp":
      nextRowIdx = Math.max(0, currentRowIdx - 1);
      break;
    case "ArrowDown":
      nextRowIdx = Math.min(rows.length - 1, currentRowIdx + 1);
      break;
    case "ArrowLeft":
      nextColIdx = Math.max(0, currentColIdx - 1);
      break;
    case "ArrowRight":
      nextColIdx = Math.min(visibleColIds.length - 1, currentColIdx + 1);
      break;
    default:
      return;
  }

  // Nếu tọa độ không đổi (ví dụ chạm biên trên cùng/dưới cùng), không cần làm gì
  if (nextRowIdx === currentRowIdx && nextColIdx === currentColIdx) return;

  // Ngăn chặn hành vi cuộn trang mặc định của trình duyệt khi bấm phím mũi tên
  e.preventDefault();

  // Tìm ID của cột đích tiếp theo
  const nextColId = visibleColIds[nextColIdx];

  // Truy vấn trực tiếp DOM để tìm ra ô input ở tọa độ mới và focus vào nó
  setTimeout(() => {
    const nextInput = document.querySelector(
      `td[data-row-index="${nextRowIdx}"][data-col-index="${nextColId}"] input`,
    ) as HTMLInputElement | null;

    if (nextInput) {
      nextInput.focus();
      // Tự động bôi đen toàn bộ chữ/số trong ô mới để tiện đè dữ liệu mới (giống Excel)
      nextInput.select();
    }
  }, 0);
};

export const getStickyClass = (
  headerId: string,
  groupIndex: number,
  placeholderId?: string,
) => {
  const targetId = placeholderId || headerId;
  const isFirstRow = groupIndex === 0;

  if (targetId === "stt") {
    return `sticky left-0 ${isFirstRow ? "z-40" : "z-30"} bg-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-[60px] min-w-[60px]`;
  }
  if (targetId === "tenHs") {
    return `sticky left-[60px] ${isFirstRow ? "z-40" : "z-30"} bg-slate-100 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.15)] min-w-[180px] max-w-[240px]`;
  }

  return isFirstRow ? "z-20" : "z-10";
};
