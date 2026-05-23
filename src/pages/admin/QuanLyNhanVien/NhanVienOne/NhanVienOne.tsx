import { BookOpen } from "lucide-react";
import Breadcrumb from "../../../../components/ui/Breadcrum";
import { formatDate } from "../../../../util/formatDate";
import { useQuanLyNguoiDungContext } from "../QuanLyNguoiDungContext";
import ButtonAction from "../../../../components/ui/ButtonAction";
import ModalMonHocGiangDay from "./ModalThemMonHoc";

const NhanVienOne = () => {
  const {
    staffDetail,
    isLoadingStaffDetail,
    allSubjects,
    registerSubjectsForTeacher,
    isOpenModalMonHoc,
    setIsOpenModalMonHoc,
  } = useQuanLyNguoiDungContext();
  console.log("asdjasdlkjasdl", isOpenModalMonHoc);

  if (isLoadingStaffDetail)
    return (
      <div className="flex items-center justify-center min-h-100 text-slate-500 font-medium">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mr-3"></div>
        Đang tải thông tin nhân viên...
      </div>
    );

  if (!staffDetail || !staffDetail.id || staffDetail.id === undefined)
    return (
      <div className="p-6 text-center bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
        Không tìm thấy thông tin chi tiết của nhân viên này hoặc dữ liệu không
        tồn tại.
      </div>
    );

  const {
    fullName,
    staffCode,
    avatarUrl,
    id,
    dob,
    gender,
    identityNumber,
    phone,
    address,
    departmentId,
    contractType,
    salaryCoefficient,
    hireDate,
    EmployeeRole,
    user,
    email,
  } = staffDetail;

  const personalInfo = [
    { label: "Ngày sinh", value: formatDate(dob) },
    {
      label: "Giới tính",
      value: gender === true ? "Nam" : gender === false ? "Nữ" : "-",
    },
    { label: "Số CCCD / CMND", value: identityNumber ?? "-" },
    { label: "Số điện thoại", value: phone ?? "-" },
  ];

  const jobInfo = [
    { label: "Phòng ban (ID)", value: departmentId ?? "-" },
    { label: "Loại hợp đồng", value: contractType ?? "-" },
    { label: "Hệ số lương", value: salaryCoefficient ?? "-" },
    { label: "Ngày vào làm", value: formatDate(hireDate) },
    {
      label: "Vai trò",
      value: EmployeeRole === "TEACHER" ? "Giáo viên" : "Nhân viên hành chính",
    },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Hồ sơ giáo viên", link: "/admin/users" },
          { label: `${fullName} - ${staffCode}` },
        ]}
      />

      {/* HEADER PROFILE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-slate-400">
              {fullName?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-center md:text-left space-y-2 flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{fullName}</h1>
            <div className="flex gap-2 justify-center md:justify-start font-semibold text-xs">
              {staffCode && (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  {staffCode}
                </span>
              )}
              {EmployeeRole && (
                <span
                  className={`px-3 py-1 rounded-full border ${EmployeeRole === "TEACHER" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                >
                  {EmployeeRole}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-500">Mã định danh hệ thống: #{id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* THÔNG TIN CÁ NHÂN */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {personalInfo.map((info, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    {info.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {info.value}
                  </span>
                </div>
              ))}
              <div className="md:col-span-2">
                <span className="block text-xs font-medium text-slate-400 uppercase">
                  Địa chỉ liên hệ
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {address ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* DANH SÁCH MÔN GIẢNG DẠY */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Danh sách môn đăng ký giảng dạy
              </h2>
              <ButtonAction
                label="Đăng ký môn học giảng dạy"
                onClick={() => setIsOpenModalMonHoc(true)}
              />
            </div>

            {/* Content Section */}
            {staffDetail?.teacherSubjects?.length ? (
              <div className="flex flex-wrap gap-2">
                {staffDetail.teacherSubjects.map((ts) => (
                  <div
                    key={ts.id}
                    className="px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-medium text-indigo-900 flex items-center gap-2"
                  >
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      {ts.subject?.subjectCode}
                    </span>
                    <span>{ts.subject?.subjectName}</span>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State Section */
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 transition-all hover:bg-slate-50/90">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 mb-3 text-slate-400">
                  <BookOpen className="w-6 h-6 stroke-[1.75]" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Chưa có thông tin đăng ký giảng dạy
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* THÔNG TIN CÔNG VIỆC */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Thông tin công việc
            </h2>
            <div className="space-y-4">
              {jobInfo.map((info, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    {info.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* TÀI KHOẢN LIÊN KẾT */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Tài khoản liên kết
            </h2>
            {user ? (
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Tên tài khoản
                  </span>
                  <span className="text-sm font-mono font-bold text-blue-600">
                    {user.username}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Email liên kết
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {email}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400 uppercase">
                    Trạng thái
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-bold rounded ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    {user.isActive ? "Hoạt động" : "Đang khóa"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-100">
                Nhân viên này hiện chưa được kích hoạt hoặc liên kết với tài
                khoản người dùng hệ thống.
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalMonHocGiangDay
        data={allSubjects ?? []}
        onSubmit={(subjectIds, onSuccess) => {
          registerSubjectsForTeacher(
            {
              body: {
                teacherId: staffDetail.id!,
                subjectIds,
              },
            },
            {
              onSuccess: () => {
                onSuccess();
              },
            },
          );
        }}
        isOpen={isOpenModalMonHoc}
        setIsOpen={setIsOpenModalMonHoc}
      />
    </div>
  );
};

export default NhanVienOne;
