export type EditHistory = {
  id: string;
  editorName: string;
  role: string;
  action: "create" | "update" | "delete";
  oldValue: string | number | null;
  newValue: string | number;
  timestamp: string;
  reason?: string;
};

export type StudentScore = {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  currentScore: number;
  trainingSystem: "9+" | "Trung cấp" | "Cao đẳng" | "Đại học liên kết";
  history: EditHistory[];
};

const tmp = {
  id: "1",
  studentName: "Nguyễn Văn A",
  studentId: "SV001",
  subject: "Lập trình Web",
  currentScore: 8.5,
  trainingSystem: "Cao đẳng",
  history: [
    {
      id: "h1",
      editorName: "Trần Thị B",
      role: "Giảng viên",
      action: "update",
      oldValue: 7.0,
      newValue: 8.5,
      timestamp: "07/04/2026 09:00",
      reason: "Chấm phúc khảo bài thi cuối kỳ",
    },
    {
      id: "h2",
      editorName: "Hệ thống",
      role: "Admin",
      action: "create",
      oldValue: null,
      newValue: 7.0,
      timestamp: "01/04/2026 14:20",
    },
  ],
} as StudentScore;

import { History, User, Clock, ArrowRight, X, ShieldCheck } from "lucide-react";

const LichSuThaoTac = ({
  student = tmp,
  onClose,
}: {
  student?: StudentScore;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Lịch sử chỉnh sửa
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {student.studentName} - {student.studentId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="relative border-l-2 border-blue-100 ml-3">
          {student.history.map((log) => (
            <div key={log.id} className="mb-8 ml-6 relative">
              {/* Timeline Dot */}
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-sm" />

              <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {log.editorName}
                      </p>
                      <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
                        {log.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-400 text-[12px]">
                    <Clock className="w-3 h-3 mr-1" />
                    {log.timestamp}
                  </div>
                </div>

                <div className="mt-3 py-2 px-3 bg-slate-50 rounded-lg flex items-center gap-3">
                  <span className="text-sm text-slate-400 line-through decoration-slate-300 font-medium">
                    {log.oldValue ?? "--"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                    {log.newValue}
                  </span>
                </div>

                {log.reason && (
                  <div className="mt-3 text-sm text-slate-600 italic bg-amber-50 p-2 rounded border-l-2 border-amber-200">
                    "{log.reason}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Dữ liệu được xác thực hệ thống
        </p>
      </div>
    </div>
  );
};

export default LichSuThaoTac;
