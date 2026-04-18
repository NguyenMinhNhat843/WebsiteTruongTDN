import { CheckCircle, HeartPulse } from "lucide-react";
import SectionWrapper from "../../../../../components/ui/SectionWrapper";

const SectionThongTinSucKhoe = () => {
  return (
    <SectionWrapper title="Thông tin sức khỏe" Icon={HeartPulse}>
      {/* Chỉ số cơ bản */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Chiều cao
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {"168"}
            <span className="text-sm font-normal text-gray-400 ml-1">cm</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Cân nặng
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {"55"}
            <span className="text-sm font-normal text-gray-400 ml-1">kg</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Nhóm máu
          </p>
          <p className="text-2xl font-bold text-gray-800">{"—"}</p>
        </div>
      </div>

      {/* Ghi chú bệnh lý */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Ghi chú bệnh lý / dị ứng
        </p>
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-sm text-green-700">Không có ghi chú bệnh lý</p>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default SectionThongTinSucKhoe;
