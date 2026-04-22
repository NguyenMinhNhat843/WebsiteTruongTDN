import {
  BookOpen,
  FileText,
  Upload,
  Download,
  CheckCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import PageShell from "../../../components/ui/PageShell";
import ButtonAction from "../../../components/ui/ButtonAction";
import ReusableTable from "../../../components/ui/Table";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DeCuongGiangDay = () => {
  // Dữ liệu mẫu đề cương
  const syllabusData = [
    {
      session: 1,
      topic: "Tổng quan về kiểm thử phần mềm",
      content: "Các khái niệm cơ bản, quy trình kiểm thử, vai trò của QA/QC.",
      method: "Lý thuyết",
      materials: [{ name: "Slide_Chuong1.pdf", link: "#" }],
      isCompleted: true,
    },
    {
      session: 2,
      topic: "Kiểm thử hộp đen (Black-box Testing)",
      content:
        "Phân vùng tương đương, phân tích giá trị biên, bảng quyết định.",
      method: "Lý thuyết + Bài tập",
      materials: [
        { name: "Slide_Chuong2.pdf", link: "#" },
        { name: "BaiTap_Blackbox.docx", link: "#" },
      ],
      isCompleted: false,
    },
    {
      session: 3,
      topic: "Kiểm thử hộp trắng (White-box Testing)",
      content: "Kiểm thử dòng điều khiển, dòng dữ liệu, độ bao phủ mã nguồn.",
      method: "Thực hành tại Lab",
      materials: [],
      isCompleted: false,
    },
  ];

  const columns = [
    {
      key: "session",
      label: "Buổi",
      width: "80px",
      className: "font-bold text-center text-blue-600",
    },
    {
      key: "topic",
      label: "Chương / Chủ đề",
      width: "250px",
      render: (item: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{item.topic}</span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {item.method}
          </span>
        </div>
      ),
    },
    {
      key: "content",
      label: "Nội dung chi tiết",
      render: (item: any) => (
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
          {item.content}
        </p>
      ),
    },
    {
      key: "materials",
      label: "Học liệu",
      width: "200px",
      render: (item: any) => (
        <div className="flex flex-wrap gap-1">
          {item.materials.length > 0 ? (
            item.materials.map((file: any, idx: number) => (
              <a
                key={idx}
                href={file.link}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <FileText size={10} />
                {file.name}
              </a>
            ))
          ) : (
            <span className="text-[10px] text-slate-300 italic">
              Chưa có tài liệu
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      width: "120px",
      render: (item: any) => (
        <div className="flex gap-1">
          <ButtonAction
            icon={<Upload size={14} />}
            title="Tải lên tài liệu"
            className="bg-white text-slate-600 border-slate-200"
          />
          <ButtonAction
            icon={
              item.isCompleted ? (
                <CheckCircle size={14} />
              ) : (
                <ExternalLink size={14} />
              )
            }
            title={item.isCompleted ? "Đã dạy" : "Đánh dấu hoàn thành"}
            className={
              item.isCompleted
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-white text-blue-600 border-blue-100"
            }
          />
        </div>
      ),
    },
  ];

  return (
    <PageShell
      title="Đề cương giảng dạy"
      sub="Môn học: Đảm bảo chất lượng và Kiểm thử phần mềm (DHKTPM17A)"
      icon={BookOpen}
      renderRight={
        <ButtonAction
          label="Xuất PDF Đề cương"
          icon={<Download size={18} />}
          className="bg-slate-800 text-white border-none"
        />
      }
    >
      {/* Thông tin tổng quan nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
          <div className="text-xs opacity-80 uppercase font-bold mb-1">
            Tổng số tiết
          </div>
          <div className="text-2xl font-black">45 Tiết</div>
          <div className="text-[10px] mt-2 bg-white/20 w-fit px-2 py-0.5 rounded">
            30 LT / 15 TH
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">
              Tiến độ dạy
            </div>
            <div className="text-xl font-black text-slate-700">
              08 / 15 Buổi
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Info size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">
              Hình thức thi
            </div>
            <div className="text-xl font-black text-slate-700">Trắc nghiệm</div>
          </div>
        </div>
      </div>

      {/* Bảng nội dung chi tiết */}
      <ReusableTable data={syllabusData} columns={columns} rowKey="session" />
    </PageShell>
  );
};

export default DeCuongGiangDay;
