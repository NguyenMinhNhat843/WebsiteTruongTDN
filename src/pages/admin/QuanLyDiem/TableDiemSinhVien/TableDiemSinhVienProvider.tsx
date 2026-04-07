import { useState } from "react";
import { createContextProvider } from "../../../../util/createContextProvider";
import type { DiemField, DiemSinhVien, TrangThai } from "../type";
import { INITIAL_DATA } from "./DataTest";
import type { EditBuffer } from "./type";
import { clampScore, isTrangThai } from "./helpers";

export const [TableDiemSinhVienProvider, useTableDiemSinhVienContext] =
  createContextProvider(() => {
    const [data, setData] = useState<DiemSinhVien[]>(INITIAL_DATA);
    const [isEditingAll, setIsEditingAll] = useState<boolean>(false);
    const [editBuffer, setEditBuffer] = useState<EditBuffer>({});
    const [saved, setSaved] = useState<boolean>(false);

    // ── Bắt đầu chỉnh sửa ────────────────────────────────────────────────────
    const handleStartEdit = (): void => {
      const buf: EditBuffer = {};
      data.forEach((row) => {
        buf[row.id] = {
          chuyenCan: String(row.chuyenCan),
          thuongKy: String(row.thuongKy),
          gk: String(row.gk),
          ck: String(row.ck),
          trangThai: row.trangThai,
        };
      });
      setEditBuffer(buf);
      setIsEditingAll(true);
    };

    // ── Cập nhật buffer score (DiemField) ────────────────────────────────────
    const handleScoreChange = (
      id: DiemSinhVien["id"],
      field: DiemField,
      value: string,
    ): void => {
      setEditBuffer((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    };

    // ── Cập nhật buffer trạng thái ────────────────────────────────────────────
    const handleTrangThaiChange = (
      id: DiemSinhVien["id"],
      value: string,
    ): void => {
      if (!isTrangThai(value)) return;
      setEditBuffer((prev) => ({
        ...prev,
        [id]: { ...prev[id], trangThai: value },
      }));
    };

    // ── Hủy ──────────────────────────────────────────────────────────────────
    const handleCancel = (): void => {
      setEditBuffer({});
      setIsEditingAll(false);
    };

    // ── Lưu ──────────────────────────────────────────────────────────────────
    const handleSave = (): void => {
      const updatedData: DiemSinhVien[] = data.map((row) => {
        const patch = editBuffer[row.id];
        if (!patch) return row;
        return {
          ...row,
          chuyenCan: clampScore(patch.chuyenCan),
          thuongKy: clampScore(patch.thuongKy),
          gk: clampScore(patch.gk),
          ck: clampScore(patch.ck),
          trangThai: patch.trangThai,
        };
      });

      console.log("📋 [GradeTable] Data mới sau khi lưu:", updatedData);

      const changed: DiemSinhVien[] = updatedData.filter((row) => {
        const orig = data.find((r) => r.id === row.id);
        return JSON.stringify(orig) !== JSON.stringify(row);
      });

      if (changed.length > 0) {
        console.log("✏️  [GradeTable] Các dòng thay đổi:", changed);
      } else {
        console.log("ℹ️  [GradeTable] Không có thay đổi.");
      }

      setData(updatedData);
      setEditBuffer({});
      setIsEditingAll(false);

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    };

    // ── Chốt điểm tất cả ─────────────────────────────────────────────────────
    const handleChotDiemAll = (): void => {
      const updated: DiemSinhVien[] = data.map((row) =>
        row.daChot
          ? row
          : { ...row, daChot: true, trangThai: "Đã khóa" as TrangThai },
      );
      console.log("🔒 [GradeTable] Chốt điểm tất cả:", updated);
      setData(updated);
    };

    // ── Chốt điểm từng dòng ──────────────────────────────────────────────────
    const handleChotDiemRow = (id: DiemSinhVien["id"]): void => {
      const updated: DiemSinhVien[] = data.map((row) =>
        row.id === id
          ? { ...row, daChot: true, trangThai: "Đã khóa" as TrangThai }
          : row,
      );
      const target = updated.find((r) => r.id === id);
      if (target) {
        console.log(
          `🔒 [GradeTable] Chốt điểm sinh viên ${target.mssv}:`,
          target,
        );
      }
      setData(updated);
    };

    const allLocked: boolean = data.every((r) => r.daChot);

    return {
      allLocked,
      handleChotDiemRow,
      handleChotDiemAll,
      handleStartEdit,
      handleScoreChange,
      handleTrangThaiChange,
      handleCancel,
      handleSave,
      data,
      setData,
      isEditingAll,
      setIsEditingAll,
      editBuffer,
      setEditBuffer,
      saved,
      setSaved,
    };
  });
