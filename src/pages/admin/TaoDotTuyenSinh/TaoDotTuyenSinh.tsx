import { CalendarDays, Plus } from "lucide-react";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import Input from "../../../components/ui/Form/Input";
import NganhTuyenSinhList from "./NganhTuyenSinhList";
import DieuKienXetTuyen from "./DieuKienXetTuyen";
import PageShell from "../../../components/ui/PageShell";
import ButtonAction from "../../../components/ui/ButtonAction";
import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const TaoDotTuyenSinh = () => {
  const [formData, setFormData] = useState<{
    nienKhoa: string;
    dotTuyenSinh: string;
    hocPhi: string;
    chinhSach: string;
    selectedMajor: unknown[];
    conditions: unknown[];
  }>({
    nienKhoa: "",
    dotTuyenSinh: "1",
    hocPhi: "",
    chinhSach: "",
    selectedMajor: [], // Danh sách ngành xét tuyển
    conditions: [], // Điều kiện xét tuyển
  });

  const handleSubmit = () => {
    console.log("Thông tin đợt tuyển sinh:", formData);
  };

  return (
    <PageShell
      title="Tạo đợt tuyển sinh"
      sub="Thiết lập thông tin và điều kiện cho đợt tuyển sinh mới"
      icon={CalendarDays}
      //   classNameIcon="bg-indigo-50 text-indigo-600"
      renderRight={
        <div>
          <ButtonAction
            label="Tạo đợt"
            icon={<Plus size={16} />}
            className="bg-slate-900 text-white hover:opacity-90"
            onClick={handleSubmit}
          />
        </div>
      }
    >
      {/* SECTION 1: THIẾT LẬP THỜI GIAN */}
      <section className="space-y-5 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Niên khóa"
            placeholder="VD: 2026 - 2028"
            require
            icon={CalendarDays}
            value={formData.nienKhoa}
            onChange={(e) =>
              setFormData({ ...formData, nienKhoa: e.target.value })
            }
          />
          <SelectOption
            label="Đợt tuyển sinh"
            require
            options={[
              { value: "1", label: "Đợt 1 (Tuyển sinh đầu năm)" },
              { value: "2", label: "Đợt 2 (Tuyển sinh bổ sung)" },
              { value: "3", label: "Đợt 3 (Hệ ngắn hạn)" },
            ]}
            value={formData.dotTuyenSinh}
            onChange={(e) =>
              setFormData({ ...formData, dotTuyenSinh: e.target.value })
            }
          />
        </div>
      </section>

      {/* SECTION 2: KHAI BÁO CHUYÊN MÔN */}
      <NganhTuyenSinhList
        selectedMajors={formData.selectedMajor as any}
        setSelectedMajors={(majors) =>
          setFormData({ ...formData, selectedMajor: majors })
        }
      />

      {/* SECTION 3: CẤU HÌNH ĐIỀU KIỆN & TÀI CHÍNH */}
      <DieuKienXetTuyen formData={formData} setFormData={setFormData} />
    </PageShell>
  );
};

export default TaoDotTuyenSinh;
