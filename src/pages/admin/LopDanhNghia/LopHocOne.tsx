import React, { useMemo } from "react";
import { useLopHocContext } from "./LopHocProvider";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  User,
  GraduationCap,
  BookOpen,
  Users,
  Loader2,
  Plus,
  ArrowLeft,
  Calendar,
  Layers,
} from "lucide-react";
import ModelThemHocSinh from "./ModelThemHocSinh";
import { useNavigate } from "react-router-dom";
import ModalSinhLopHocPhan from "./ModalSinhLopHocPhan";

const LopHocOne = () => {
  const {
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
    LopHocDetail,
    isLoadingLopHocDetail,
    isOpenModalAddStudent,
    setIsOpenModalAddStudent,
    isOpenModalSinhLopHocPhan,
    setIsOpenModalSinhLopHocPhan,
  } = useLopHocContext();
  const navigate = useNavigate();

  // 1. Chuẩn hóa dữ liệu thông tin cơ bản
  const dataHienThi = useMemo(
    () => ({
      tenLop: LopHocDetail?.className || "N/A",
      maLop: LopHocDetail?.classCode || "N/A",
      nganhHoc: LopHocDetail?.major?.majorName || "N/A",
      giaoVien: LopHocDetail?.formTeacher?.fullName || "Chưa phân bổ",
      siSo: studentsInLopHoc?.length || 0,
      maxStudent: LopHocDetail?.maxStudents || 0,
      hocKyBatDau: LopHocDetail?.batch?.startYear,
      hocKyKetThuc: LopHocDetail?.batch?.endYear,
    }),
    [LopHocDetail, studentsInLopHoc],
  );

  // 2. Chuẩn hóa dữ liệu danh sách học sinh cho TanStack Table
  const dataDanhSachHocSinh = useMemo(() => {
    return (studentsInLopHoc || []).map((student, index) => ({
      stt: index + 1,
      id: student.id,
      tenHocSinh: student.fullName || "Chưa cập nhật",
      maSinhVien: student.studentCode || "N/A",
      dob: student.dob
        ? new Date(student.dob).toLocaleDateString("vi-VN")
        : "N/A",
    }));
  }, [studentsInLopHoc]);

  // 3. Định nghĩa các cột cho TanStack Table
  const columns = useMemo<ColumnDef<(typeof dataDanhSachHocSinh)[0]>[]>(
    () => [
      {
        header: "STT",
        accessorKey: "stt",
      },
      {
        header: "Mã Sinh Viên",
        accessorKey: "maSinhVien",
        cell: (info) => (
          <span className="font-semibold text-gray-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Họ và Tên",
        accessorKey: "tenHocSinh",
        cell: (info) => (
          <span className="font-medium text-gray-900">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        header: "Ngày sinh",
        accessorKey: "dob",
      },
    ],
    [],
  );

  // 4. Khởi tạo TanStack Table
  const table = useReactTable({
    data: dataDanhSachHocSinh,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Trạng thái Loading toàn trang
  if (isLoadingLopHocDetail || isLoadingStudentsInLopHoc) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-gray-500">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span>Đang tải dữ liệu lớp học...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 space-y-8">
      {/* --- PHẦN 1: THÔNG TIN CƠ BẢN (INFO CARDS) --- */}
      <div className="space-y-4">
        {/* Nút Quay về đặt độc lập phía trên Card để tạo khoảng thoáng */}
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors group py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Quay về danh sách</span>
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {/* Phần tiêu đề chính */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-6">
            {/* Cụm thông tin bên trái */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {dataHienThi.tenLop}
                </h1>
                <p className="text-sm text-gray-500">
                  Mã lớp: {dataHienThi.maLop}
                </p>
              </div>
            </div>

            {/* Cụm nút hành động ở góc phải trên */}
            <div className="flex items-center gap-2 self-start sm:self-center w-full sm:w-auto">
              {/* Nút "Sinh lớp học phần" mới thêm */}
              <button
                onClick={() => {
                  setIsOpenModalSinhLopHocPhan(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98]"
              >
                <Layers className="h-4 w-4 text-gray-500" />
                <span>Sinh lớp học phần</span>
              </button>

              {/* Nút "Thêm học sinh" */}
              <button
                onClick={() => {
                  setIsOpenModalAddStudent(true);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-blue-100 transition-all active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm học sinh</span>
              </button>
            </div>
          </div>

          {/* Phần grid thông tin bên dưới giữ nguyên */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* 1. Ngành học */}
            <div className="flex items-start gap-3 col-span-2 md:col-span-1">
              <BookOpen className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Ngành học
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  {dataHienThi.nganhHoc}
                </p>
              </div>
            </div>

            {/* 2. Giáo viên chủ nhiệm */}
            <div className="flex items-start gap-3 col-span-2 md:col-span-1">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Giáo viên chủ nhiệm
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  {dataHienThi.giaoVien}
                </p>
              </div>
            </div>

            {/* 3. Sĩ số lớp */}
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Sĩ số lớp
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  <span className="text-blue-600 font-bold">
                    {dataHienThi.siSo} / {dataHienThi.maxStudent}
                  </span>{" "}
                  học sinh
                </p>
              </div>
            </div>

            {/* 4. Niên khóa */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Niên khóa
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  {dataHienThi.hocKyBatDau
                    ? `HK1 - ${dataHienThi.hocKyBatDau}`
                    : "N/A"}
                  <span className="text-gray-300 mx-1.5">→</span>
                  {dataHienThi.hocKyKetThuc
                    ? `HK1 - ${dataHienThi.hocKyKetThuc}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- PHẦN 2: DANH SÁCH HỌC SINH (TANSTACK TABLE) --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-800 text-lg">
            Danh sách học sinh
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-100 bg-gray-50/70"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dataDanhSachHocSinh.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    Lớp học này chưa có học sinh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModelThemHocSinh
        isOpen={isOpenModalAddStudent}
        onClose={() => setIsOpenModalAddStudent(false)}
      />

      <ModalSinhLopHocPhan
        isOpen={isOpenModalSinhLopHocPhan}
        onClose={() => setIsOpenModalSinhLopHocPhan(false)}
      />
    </div>
  );
};

export default LopHocOne;
