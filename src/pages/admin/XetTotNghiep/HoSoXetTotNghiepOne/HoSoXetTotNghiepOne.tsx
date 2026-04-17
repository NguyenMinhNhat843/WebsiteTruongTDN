import React, { useState } from "react";

type Certificate = {
  id: string;
  name: string;
  required: boolean;
  submitted: boolean;
};

type CourseResult = {
  subject: string;
  credits: number;
  score: number;
};

type StudentProfile = {
  fullName: string;
  studentId: string;
  dateOfBirth: string;
  major: string;
  program: string;
  academicYear: string;
  gpa: number;
  conduct: string;
  status: "pending" | "approved" | "rejected";
  certificates: Certificate[];
  results: CourseResult[];
};

const mockData: StudentProfile = {
  fullName: "Nguyễn Văn A",
  studentId: "SV001234",
  dateOfBirth: "2002-05-10",
  major: "Công nghệ thông tin",
  program: "Đại học chính quy",
  academicYear: "2020 - 2024",
  gpa: 3.25,
  conduct: "Tốt",
  status: "pending",
  certificates: [
    { id: "1", name: "Chứng chỉ TOEIC ≥ 500", required: true, submitted: true },
    { id: "2", name: "Chứng chỉ Tin học", required: true, submitted: false },
  ],
  results: [
    { subject: "Lập trình Java", credits: 3, score: 8.5 },
    { subject: "Cấu trúc dữ liệu", credits: 3, score: 7.8 },
  ],
};

const StatusBadge = ({ status }: { status: StudentProfile["status"] }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const label = {
    pending: "Chờ xét",
    approved: "Đã duyệt",
    rejected: "Bị từ chối",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${map[status]}`}
    >
      {label[status]}
    </span>
  );
};

const HoSoXetTotNghiepOne = () => {
  const [data] = useState<StudentProfile>(mockData);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hồ sơ xét tốt nghiệp</h1>
        <StatusBadge status={data.status} />
      </div>

      {/* Thông tin sinh viên */}
      <div className="bg-white border rounded-xl p-4 grid grid-cols-2 gap-4">
        <Info label="Họ tên" value={data.fullName} />
        <Info label="Mã sinh viên" value={data.studentId} />
        <Info label="Ngày sinh" value={data.dateOfBirth} />
        <Info label="Ngành học" value={data.major} />
        <Info label="Chương trình" value={data.program} />
        <Info label="Niên khóa" value={data.academicYear} />
        <Info label="GPA" value={data.gpa.toFixed(2)} />
        <Info label="Hạnh kiểm" value={data.conduct} />
      </div>

      {/* Kết quả học tập */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Kết quả học tập</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Môn học</th>
              <th>Tín chỉ</th>
              <th>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{r.subject}</td>
                <td>{r.credits}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chứng chỉ */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Chứng chỉ bắt buộc</h2>
        <div className="space-y-2">
          {data.certificates.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border p-2 rounded-lg"
            >
              <span>{c.name}</span>
              <span
                className={`text-sm font-medium ${
                  c.submitted ? "text-green-600" : "text-red-500"
                }`}
              >
                {c.submitted ? "Đã nộp" : "Chưa nộp"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Điều kiện tốt nghiệp */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Điều kiện tốt nghiệp</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Hoàn thành tất cả môn học</li>
          <li>GPA ≥ 2.0</li>
          <li>Không nợ học phí</li>
          <li>Đủ chứng chỉ yêu cầu</li>
        </ul>
      </div>

      {/* Ghi chú */}
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Ghi chú</h2>
        <textarea
          className="w-full border rounded-lg p-2 text-sm"
          placeholder="Nhập ghi chú..."
        />
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default HoSoXetTotNghiepOne;
