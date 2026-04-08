import { Plus } from "lucide-react";
import { STATUS_LABELS, TRAINING_SYSTEM_LABELS } from "../constants";
import { useTuyenSinhContext } from "../TuyenSinhProvider";
import type { AdmissionStatus, TrainingSystem } from "../type";

const ToolBar = () => {
  const {
    setStatusFilter,
    setSystemFilter,
    statusFilter,
    systemFilter,
    setOpenFormCreate,
  } = useTuyenSinhContext();
  return (
    <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 rounded-2xl border border-gray-200/60 p-3 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {/* Left: Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="relative group">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as AdmissionStatus | "all")
            }
            className="appearance-none pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            {(Object.entries(STATUS_LABELS) as [AdmissionStatus, string][]).map(
              ([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ),
            )}
          </select>
          {/* Custom Icon for Select */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Training System Filter */}
        <div className="relative group">
          <select
            value={systemFilter}
            onChange={(e) =>
              setSystemFilter(e.target.value as TrainingSystem | "all")
            }
            className="appearance-none pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer"
          >
            <option value="all">Hệ đào tạo</option>
            {(
              Object.entries(TRAINING_SYSTEM_LABELS) as [
                TrainingSystem,
                string,
              ][]
            ).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <button
        onClick={() => setOpenFormCreate(true)}
        className="group px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all duration-200 shadow-lg shadow-gray-200 hover:shadow-blue-200 flex items-center gap-2"
      >
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        Tạo đợt mới
      </button>
    </div>
  );
};

export default ToolBar;
