import { useState } from "react";
import { SUBJECTS } from "../TaoChuongTrinhKhungProvider";

export const SemesterManager = ({
  curriculum,
  addSubject,
  moveSubject,
  addSemester,
}) => {
  return (
    <div className="space-y-4">
      {" "}
      {/* Chuyển thành layout dọc với space-y */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-bold text-gray-700 uppercase tracking-wider">
          Cấu trúc các học kỳ
        </h3>
      </div>
      <div className="space-y-4">
        {curriculum.semesters.map((semester) => (
          <SemesterRow
            key={semester.id}
            semester={semester}
            addSubject={addSubject}
            moveSubject={moveSubject}
          />
        ))}
      </div>
    </div>
  );
};

// ================= SEMESTER ROW (Chuyển từ Column sang Row) =================
const SemesterRow = ({ semester, addSubject, moveSubject }) => {
  const [selected, setSelected] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text"));
    moveSubject(data.from, semester.id, data.subjectId);
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Header gọn gàng giống style Form */}
      <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center bg-editorial-ink text-white rounded-lg text-[13px] font-bold">
            {semester.id}
          </span>
          <h4 className="font-bold text-gray-700 text-[15px]">
            Học kỳ {semester.id}
          </h4>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-medium text-gray-500">
            {semester.subjects.length} môn học
          </span>
          <div className="h-4 w-[1px] bg-gray-200"></div>
          <span className="text-[12px] font-bold text-blue-600">
            {semester.subjects.reduce((sum, s) => sum + s.credits, 0)} Tín chỉ
          </span>
        </div>
      </div>

      {/* Danh sách môn học - Dàn hàng ngang hoặc lưới nhẹ trong Row */}
      {/* Danh sách môn học dạng Table */}
      <div className="p-0 bg-white">
        {" "}
        {/* Loại bỏ padding để bảng tràn viền nếu cần */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="pl-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider w-20">
                  Mã
                </th>
                <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Tên môn học / mô đun
                </th>
                <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-16">
                  TC
                </th>
                <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-16 text-gray-400/60">
                  LT
                </th>
                <th className="py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center w-16 text-gray-400/60">
                  TH
                </th>
                <th className="pr-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right w-24">
                  Loại
                </th>
              </tr>
            </thead>
            <tbody>
              {semester.subjects.map((sub) => (
                <SubjectRow
                  key={sub.id}
                  subject={sub}
                  semesterId={semester.id}
                />
              ))}
            </tbody>
          </table>
        </div>
        {semester.subjects.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-[12px] text-gray-400 italic">
              Chưa có môn học trong học kỳ này
            </p>
          </div>
        )}
      </div>

      {/* Footer để thêm môn nhanh */}
      <div className="px-4 py-3 bg-gray-50/30 border-t border-gray-50 flex gap-3 items-center">
        <div className="relative flex-1">
          <select
            className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 appearance-none transition-all cursor-pointer"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">
              + Chọn môn học để thêm vào học kỳ {semester.id}...
            </option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.credits} TC)
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
            ▼
          </div>
        </div>

        <button
          disabled={!selected}
          onClick={() => {
            const subject = SUBJECTS.find((s) => s.id === Number(selected));
            if (subject) {
              addSubject(semester.id, subject);
              setSelected("");
            }
          }}
          className={`px-4 py-2 rounded-lg font-bold text-[12px] uppercase tracking-wider transition-all ${
            selected
              ? "bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Thêm môn
        </button>
      </div>
    </div>
  );
};

// ================= SUBJECT CARD =================
const SubjectRow = ({ subject, semesterId }) => {
  return (
    <tr
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text",
          JSON.stringify({ subjectId: subject.id, from: semesterId }),
        );
      }}
      className="group border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-grab active:cursor-grabbing"
    >
      {/* Mã môn học */}
      <td className="pl-5 py-4">
        <span className="text-[12px] font-bold text-blue-600 tracking-tight">
          {subject.code || `MĐ${subject.id.toString().padStart(2, "0")}`}
        </span>
      </td>

      {/* Tên môn học + Badge Trọng tâm */}
      <td className="py-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
            {subject.name}
          </span>
          {subject.isMain && (
            <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded-full border border-orange-100 uppercase">
              Trọng tâm
            </span>
          )}
        </div>
      </td>

      {/* Tín chỉ (Số in đậm) */}
      <td className="py-4 text-center">
        <span className="text-[15px] font-bold text-gray-800">
          {subject.credits}
        </span>
      </td>

      {/* Lý thuyết */}
      <td className="py-4 text-center">
        <span className="text-[13px] text-gray-400">
          {subject.theoryHours || 0}
        </span>
      </td>

      {/* Thực hành */}
      <td className="py-4 text-center">
        <span className="text-[13px] text-gray-400">
          {subject.practiceHours || 0}
        </span>
      </td>

      {/* Loại môn học (Badge xám/vàng) */}
      <td className="pr-5 py-4 text-right">
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
            subject.type === "Thực hành"
              ? "bg-orange-50 text-orange-600 border border-orange-100"
              : "bg-gray-100 text-gray-500 border border-gray-200"
          }`}
        >
          {subject.type || "Môn chung"}
        </span>
      </td>
    </tr>
  );
};
