import { useMemo, useState } from "react";
import { useLopHocContext } from "../LopHocProvider";

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
import ModelThemHocSinh from "../ModelThemHocSinh";
import { useNavigate } from "react-router-dom";
import ModalSinhLopHocPhan from "../ModalSinhLopHocPhan";
import TableDanhSachHocSinh from "./TabHocSinh";
import Tabs from "../../../../components/ui/Tabs";
import TabMonHoc from "./TabMonHoc";
import TabChuongTrinhHoc from "./TabChuongTrinhHoc";
import { LopHocOneProvider } from "./LopHocOneProvider";

const LopHocOne = () => {
  return (
    <LopHocOneProvider>
      <Inner />
    </LopHocOneProvider>
  );
};

const Inner = () => {
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
  const [activeTab, setActiveTab] = useState<
    "hoc-sinh" | "mon-hoc" | "chuong-trinh-hoc"
  >("hoc-sinh");

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
      <Tabs
        tabs={[
          { value: "hoc-sinh", label: "Học sinh" },
          { value: "mon-hoc", label: "Môn học" },
          { value: "chuong-trinh-hoc", label: "Chương trình học" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === "hoc-sinh" ? (
        <TableDanhSachHocSinh />
      ) : activeTab === "mon-hoc" ? (
        <TabMonHoc />
      ) : (
        <TabChuongTrinhHoc />
      )}

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
