import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Archive,
  Info,
  ArrowLeft,
  PlusIcon,
  CheckCheck,
} from "lucide-react";
import {
  useDotTuyenSinhContext,
  type ChiTietDotTuyenSinhDto,
  type StatusDotTuyenSinh,
} from "./DotTuyenSinhProvider";
import { useNavigate } from "react-router-dom";
import { useHoSoTuyenSinhContext } from "./HoSoTuyenSinhProvider";
import CreateHoSoModal from "./ModalCreateHoSoTuyenSinh";
import { HoSoTuyenSinhTable } from "./TableHoSotuyenSinh";
import PageShell from "../../components/ui/PageShell";
import { columns } from "./ColumnDotTuyenSinhOne";

const AdmissionDetail = () => {
  const {
    chiTietDotTuyenSinh: dotTuyenSinhOne,
    isLoadingChiTietDotTuyenSinh,
    approveDotTuyenSinh,
    isApprovingDotTuyenSinh,
  } = useDotTuyenSinhContext();
  const {
    setIsCreateHoSoModalOpen,
    isCreateHoSoModalOpen,
    hoSoTuyenSinhs,
    isLoadingHoSoTuyenSinhs,
  } = useHoSoTuyenSinhContext();
  const navigate = useNavigate();

  // 1. Tính toán tổng chỉ tiêu
  const totalQuota = useMemo(
    () =>
      dotTuyenSinhOne?.items?.reduce(
        (sum: number, item: ChiTietDotTuyenSinhDto) => sum + item.quota,
        0,
      ) || 0,
    [dotTuyenSinhOne],
  );

  // 3. Khởi tạo Instance của Table
  const table = useReactTable({
    data: dotTuyenSinhOne?.items || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoadingChiTietDotTuyenSinh) return <AdmissionSkeleton />;
  if (!dotTuyenSinhOne) return <EmptyState />;

  return (
    <PageShell
      title={
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {dotTuyenSinhOne.name}
          </h1>
          <StatusBadge status={dotTuyenSinhOne.status} />
        </div>
      }
      sub={
        <div className="flex flex-wrap gap-6 items-center">
          <TimeInfo
            label="Bắt đầu"
            date={dotTuyenSinhOne.startDate}
            icon={<Calendar className="text-indigo-500" size={18} />}
          />
          <TimeInfo
            label="Kết thúc"
            date={dotTuyenSinhOne.endDate}
            icon={<Clock className="text-pink-500" size={18} />}
          />
        </div>
      }
      renderRight={
        <div className="bg-indigo-600 px-8 py-5 rounded-2xl shadow-lg shadow-indigo-200 text-white flex flex-col items-center">
          <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">
            Tổng chỉ tiêu
          </span>
          <span className="text-4xl font-black">{totalQuota}</span>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto pb-8 bg-slate-50 min-h-screen font-sans">
        {/* Header Card với màu sắc Gradient nhấn mạnh */}
        <div className="pb-8">
          {/* button action */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate(-1)}
              className="mt-2 group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200 ease-in-out bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span>Quay lại</span>
            </button>
            <button
              onClick={() => setIsCreateHoSoModalOpen(true)}
              className="mt-2 ms-8 group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200 ease-in-out bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
            >
              <PlusIcon
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span>Thêm hồ sơ</span>
            </button>
            <button
              onClick={() =>
                approveDotTuyenSinh(
                  {
                    body: {
                      admissionId: dotTuyenSinhOne.id,
                    },
                  },
                  {
                    onSuccess: () => {
                      alert("Chốt đợt tuyển sinh thành công!");
                    },
                  },
                )
              }
              disabled={isApprovingDotTuyenSinh}
              className="mt-2 ms-8 group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200 ease-in-out bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
            >
              <CheckCheck
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-200"
              />
              <span>Chốt đợt xét tuyển</span>
            </button>
          </div>
        </div>

        {/* TanStack Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <BookOpen className="text-indigo-600" size={22} />
              Danh sách ngành tuyển sinh
            </h2>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {dotTuyenSinhOne.items?.length || 0} Ngành
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-slate-50 border-b border-slate-200"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider"
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
              <tbody className="divide-y divide-slate-100">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-indigo-50/40 transition-all group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="my-8">
          <h1 className="text-xl font-bold text-slate-800 leading-none pb-4">
            Hồ sơ tuyển sinh
          </h1>
          <HoSoTuyenSinhTable
            hoSoTuyenSinhs={hoSoTuyenSinhs}
            isLoadingHoSoTuyenSinh={isLoadingHoSoTuyenSinhs}
          />
        </div>

        <CreateHoSoModal
          isOpen={isCreateHoSoModalOpen}
          onClose={() => setIsCreateHoSoModalOpen(false)}
        />
      </div>
    </PageShell>
  );
};

// --- Sub-components để code gọn sạch hơn ---

const StatusBadge = ({ status }: { status: StatusDotTuyenSinh }) => {
  const config = {
    OPEN: {
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircle size={14} />,
    },
    CLOSE: {
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: <Clock size={14} />,
    },
    ARCHIVED: {
      color: "bg-slate-100 text-slate-700 border-slate-200",
      icon: <Archive size={14} />,
    },
  };

  const active = config[status] || config.ARCHIVED;
  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${active.color}`}
    >
      {active.icon} {status}
    </span>
  );
};

const TimeInfo = ({
  label,
  date,
  icon,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 group">
    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-700">
        {new Date(date).toLocaleDateString("vi-VN")}
      </span>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="p-20 text-center flex flex-col items-center justify-center">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
      <Info size={40} />
    </div>
    <h3 className="text-lg font-bold text-slate-800">Không tìm thấy dữ liệu</h3>
    <p className="text-slate-500 max-w-xs mx-auto mt-2">
      Dữ liệu đợt tuyển sinh không tồn tại hoặc đã bị xóa khỏi hệ thống.
    </p>
  </div>
);

const AdmissionSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
    <div className="h-40 bg-slate-200 rounded-2xl"></div>
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="h-14 bg-slate-100 border-b border-slate-200"></div>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-20 border-b border-slate-50 mx-6 my-2 bg-slate-50/50 rounded-xl"
        ></div>
      ))}
    </div>
  </div>
);

export default AdmissionDetail;
