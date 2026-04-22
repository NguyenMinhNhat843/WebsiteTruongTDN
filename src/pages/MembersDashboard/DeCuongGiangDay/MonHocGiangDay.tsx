import { useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  Layers,
  ChevronRight,
  FileText,
} from "lucide-react";
import clsx from "clsx";
import ButtonAction from "../../../components/ui/ButtonAction";
import PageShell from "../../../components/ui/PageShell";
import ReusableTable from "../../../components/ui/Table";

/* eslint-disable @typescript-eslint/no-explicit-any */
const MonHocGiangDay = () => {
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const printRef = useRef(null); // Tạo ref cho vùng cần in

  const handlePrint = () => {
    window.print();
  };

  // Data môn học GV đảm nhiệm
  const subjectCapabilities = [
    {
      id: "IT401",
      name: "Đảm bảo chất lượng & Kiểm thử phần mềm",
      credits: 3,
      sessions: 15,
      type: "Lý thuyết & Thực hành",
    },
    {
      id: "IT402",
      name: "Lập trình WWW (Java)",
      credits: 3,
      sessions: 12,
      type: "Thực hành",
    },
    {
      id: "ACC101",
      name: "Kế toán doanh nghiệp",
      credits: 4,
      sessions: 20,
      type: "Lý thuyết",
    },
  ];

  // Mock data đề cương chi tiết cho từng môn
  const syllabusDetails = {
    IT401: [
      {
        session: 1,
        topic: "Tổng quan Kiểm thử",
        content: "Khái niệm QA/QC, quy trình V-Model",
      },
      {
        session: 2,
        topic: "Kiểm thử hộp đen",
        content: "Phân vùng tương đương, giá trị biên",
      },
    ],
    ACC101: [
      {
        session: 1,
        topic: "Khung pháp lý kế toán",
        content: "Luật kế toán, chuẩn mực kế toán VN",
      },
      {
        session: 2,
        topic: "Kế toán vốn bằng tiền",
        content: "Kế toán tiền mặt, tiền gửi ngân hàng",
      },
    ],
  };

  const subjectColumns = [
    {
      key: "id",
      label: "Mã môn",
      width: "50px",
      className: "font-bold whitespace-nowrap",
    },
    {
      key: "name",
      label: "Tên môn học",
      render: (item: any) => (
        <span className="font-bold text-slate-700">{item.name}</span>
      ),
    },
    {
      key: "sessions",
      label: "Số buổi",
      className: "text-center whitespace-nowrap",
    },
    {
      key: "action",
      label: "",
      render: (item: any) => (
        <ButtonAction
          icon={<ChevronRight size={14} />}
          className={clsx(
            selectedSubject?.id === item.id
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 border-blue-100",
          )}
          onClick={() => setSelectedSubject(item)}
        />
      ),
    },
  ];

  return (
    <PageShell title="Quản lý Giáo trình" icon={BookOpen}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BÊN TRÁI: THÔNG TIN KHOA & DANH SÁCH MÔN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card Thông tin Khoa */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Building2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Đơn vị quản lý</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">
                  Khoa
                </p>
                <p className="text-sm font-bold text-slate-700">
                  Công nghệ Thông tin
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400">
                  Bộ môn
                </p>
                <p className="text-sm font-medium text-slate-600">
                  CN Phần mềm
                </p>
              </div>
            </div>
          </div>

          {/* Card Danh sách môn học */}
          <div>
            <div className="py-4 flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm uppercase">
                Môn học đảm nhiệm
              </h3>
            </div>
            <ReusableTable
              data={subjectCapabilities}
              columns={subjectColumns}
              rowKey="id"
            />
          </div>
        </div>

        {/* BÊN PHẢI: CHI TIẾT GIÁO TRÌNH (7 COLS) */}
        <div className="lg:col-span-8">
          {selectedSubject ? (
            <div
              id="printable-section"
              className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4"
            >
              <div className="p-5 bg-blue-600 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black">{selectedSubject.name}</h3>
                  <p className="text-xs opacity-80 uppercase tracking-wider">
                    Mã môn: {selectedSubject.id} | Tổng số{" "}
                    {selectedSubject.sessions} buổi
                  </p>
                </div>
                <ButtonAction
                  onClick={handlePrint}
                  icon={<FileText size={18} />}
                  className="bg-white/20 border-none text-white hover:bg-white/30"
                />
              </div>

              <div className="p-4">
                {/* Header của danh sách */}
                <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-100 mb-4 text-[11px] uppercase font-bold text-slate-400 tracking-wider px-2">
                  <div className="col-span-1 text-center">Buổi</div>
                  <div className="col-span-7">Nội dung giảng dạy</div>
                  <div className="col-span-4">Chuẩn đầu ra (CLOs)</div>
                </div>

                {/* Danh sách các buổi học */}
                <div className="space-y-3">
                  {(
                    syllabusDetails[
                      selectedSubject.id as keyof typeof syllabusDetails
                    ] || []
                  ).map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 items-start p-3 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                    >
                      {/* Cột 1: Buổi */}
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-blue-600 bg-blue-50 w-8 h-8 flex items-center justify-center rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {item.session}
                        </span>
                      </div>

                      {/* Cột 2: Nội dung */}
                      <div className="col-span-7">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">
                          {item.topic}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      {/* Cột 3: Đầu ra */}
                      <div className="col-span-4">
                        <div className="flex flex-wrap gap-1">
                          {/* Giả định dữ liệu có thêm mảng clos, nếu chưa có bạn có thể map tạm từ dữ liệu môn */}
                          Trình bày được, Giải thích được, Nhận diện được...
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-10 text-center">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <BookOpen size={48} className="opacity-20" />
              </div>
              <p className="font-bold text-slate-500 text-lg">
                Chưa chọn môn học
              </p>
              <p className="text-sm max-w-xs mt-2">
                Vui lòng bấm vào nút "Xem giáo trình" ở danh sách bên trái để
                hiển thị chi tiết các buổi dạy.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default MonHocGiangDay;
