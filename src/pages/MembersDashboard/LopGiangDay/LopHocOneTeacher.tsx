import { useMemo, useState } from "react";
import {
  User,
  GraduationCap,
  BookOpen,
  Users,
  ArrowLeft,
  Calendar,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TableDanhSachHocSinh from "../../admin/LopDanhNghia/LopHocOne/TabHocSinh";
import Tabs from "../../../components/ui/Tabs";
import TabMonHoc from "../../admin/LopDanhNghia/LopHocOne/TabMonHoc";
import Breadcrumb from "../../../components/ui/Breadcrum";
import ButtonAction from "../../../components/ui/ButtonAction";
import { LopHocOneProvider, useLopHocOneContext } from "../../admin/LopDanhNghia/LopHocOne/LopHocOneProvider";
import { downloadFromBlob } from "../../../util/download";
import { useAppContext } from "../../../AppProvider";
import { LoadingWrapper } from "../../../components/ui/LoadingWrapper";

const LopHocOneTeacher = () => {
  return (
    <LopHocOneProvider>
      <Inner />
    </LopHocOneProvider>
  );
};

const Inner = () => {
  const { hocKysData } = useAppContext();
  const {
    exportExcel,
    isExportingExcel,
    classSubjects,
    selectedSemesterId,
    LopHocDetail,
    isLoadingLopHocDetail,
    studentsInLopHoc,
    isLoadingStudentsInLopHoc,
  } = useLopHocOneContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"hoc-sinh" | "mon-hoc" >("mon-hoc");
  const hocKySelected = hocKysData?.find((hk) => hk.id === selectedSemesterId);

  // 1. Chuẩn hóa dữ liệu thông tin cơ bản
  const dataHienThi = useMemo(
    () => ({
      tenLop: LopHocDetail?.className || "N/A",
      maLop: LopHocDetail?.classCode || "N/A",
      nganhHoc: LopHocDetail?.major?.majorName || "N/A",
      giaoVien: LopHocDetail?.formTeacher?.fullName || "Chưa phân bổ",
      siSo: studentsInLopHoc?.total || 0,
      maxStudent: LopHocDetail?.maxStudents || 0,
      hocKyBatDau: LopHocDetail?.batch?.startYear,
      hocKyKetThuc: LopHocDetail?.batch?.endYear,
    }),
    [LopHocDetail, studentsInLopHoc],
  );

  return (
    <div className="mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={[
            {
              label: "Danh sách lớp học",
              link: "/teacher/lop-hoc",
            },
            {
              label: `Lớp ${LopHocDetail?.className}`,
            },
          ]}
        />
        <button
          onClick={() => {
            navigate("/teacher/lop-hoc");
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors group py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Quay về danh sách</span>
        </button>
      </div>

      <LoadingWrapper
        isLoading={isLoadingLopHocDetail || isLoadingStudentsInLopHoc}
      >
        <div className="space-y-4">
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

              <div className="flex items-center gap-2 self-start sm:self-center w-full sm:w-auto">
                <ButtonAction
                  variant="export"
                  label="Xuất bảng điểm học kỳ"
                  icon={<FileText className="h-4 w-4" />}
                  loading={isExportingExcel}
                  onClick={() => {
                    return exportExcel(
                      {
                        parseAs: "blob",
                        body: {
                          classSubjectIds:
                            classSubjects?.map((cs) => cs.id) || [],
                          haveTongKetSheet: true,
                        },
                      },
                      {
                        onSuccess: (blob) => {
                          downloadFromBlob(
                            blob as never,
                            `${LopHocDetail?.className} - ${hocKySelected?.name} - BangDiem.xlsx`,
                            ".xlsx",
                          );
                        },
                      },
                    );
                  }}
                />
              </div>
            </div>

            {/* Phần thông tin chi tiết */}
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

              {/* 2. Giáo viên chủ nhiệm (Chỉ hiển thị text) */}
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
        
        {/* Tab chuyển đổi môn học / học sinh */}
        <Tabs
          tabs={[
            { value: "mon-hoc", label: "Môn học" },
            { value: "hoc-sinh", label: "Học sinh" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === "hoc-sinh" ? (
          <TableDanhSachHocSinh />
        ) : activeTab === "mon-hoc" ? (
          <TabMonHoc />
        ) : null}
      </LoadingWrapper>
    </div>
  );
};

export default LopHocOneTeacher;
