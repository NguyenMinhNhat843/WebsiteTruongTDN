import {
  Search,
  User,
  Phone,
  Fingerprint,
  GraduationCap,
  Clock,
} from "lucide-react";
import { useHocphisContext } from "../HocPhiProvider";
import { StudentTuitionTable } from "./StudentTuitionTable";
import { BadgeStudentStatus } from "../../../components/enum/StudentStatusBadge";
import LichSuThanhToan from "./LichSuThanhToan";
import { useState } from "react";

export const ThuHocPhiPage = () => {
  const [studentCode, setStudentCode] = useState("");
  const {
    getStudentTuitionInfo,
    isPendingGetStudentTuitionInfo,
    studentTuitionInfoData,
  } = useHocphisContext();

  const handleSearch = () => {
    getStudentTuitionInfo({
      params: {
        query: {
          studentCode: studentCode,
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Nhập mã sinh viên (VD: SV2026...)"
            value={studentCode}
            onChange={(e) => {
              return setStudentCode(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isPendingGetStudentTuitionInfo}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95 disabled:bg-indigo-300"
        >
          {isPendingGetStudentTuitionInfo ? (
            <Clock className="animate-spin" size={18} />
          ) : (
            <Search size={18} />
          )}
          Tìm kiếm
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* CỘT TRÁI: THÔNG TIN SINH VIÊN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {studentTuitionInfoData ? (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full">
              <div className="bg-indigo-600 h-24 w-full relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                    {studentTuitionInfoData.avatarUrl ? (
                      <img
                        src={studentTuitionInfoData.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-16 p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">
                    {studentTuitionInfoData.fullName}
                  </h2>
                  <p className="text-indigo-600 font-medium text-sm">
                    Sinh viên
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Fingerprint size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      MSSV: {studentTuitionInfoData.studentCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Fingerprint size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      ID: {studentTuitionInfoData.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={18} className="text-slate-400" />
                    <span className="text-sm">
                      {studentTuitionInfoData.phone || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <GraduationCap size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">
                      {studentTuitionInfoData.batch?.batchName}
                    </span>
                  </div>
                  <div>
                    <BadgeStudentStatus
                      status={studentTuitionInfoData.status}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <GraduationCap size={18} className="text-slate-400" />
                    <span className="text-sm font-medium">
                      {studentTuitionInfoData?.classId || "Chưa phân lớp"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Ngành học
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    {studentTuitionInfoData?.batch?.major?.majorName || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center text-center text-slate-400">
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Search size={32} />
              </div>
              <p className="font-medium">
                Vui lòng nhập mã sinh viên để hiển thị thông tin
              </p>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: DANH MỤC KHOẢN PHÍ */}
        <StudentTuitionTable />
      </div>
      {/* Lịch sử thanh toán */}
      <LichSuThanhToan />
    </div>
  );
};
