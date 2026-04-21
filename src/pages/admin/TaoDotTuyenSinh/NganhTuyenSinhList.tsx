import { useState, type FunctionComponent } from "react";
import { Layers, Target, Plus, Trash2, GraduationCap } from "lucide-react";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import Input from "../../../components/ui/Form/Input";
import ButtonAction from "../../../components/ui/ButtonAction";

interface NganhTuyenSinh {
  id: string;
  nganhId: string;
  nganhLabel: string;
  heDaoTao: string;
  chiTieu: number;
}

interface NganhTuyenSinhListProps {
  selectedMajors: NganhTuyenSinh[];
  setSelectedMajors: (majors: NganhTuyenSinh[]) => void;
}

const NganhTuyenSinhList: FunctionComponent<NganhTuyenSinhListProps> = ({
  selectedMajors,
  setSelectedMajors,
}) => {
  // 1. State cho hàng nhập liệu hiện tại
  const [currentEntry, setCurrentEntry] = useState({
    nganh: "",
    he: "tc",
    chiTieu: "",
  });

  // Các tùy chọn ngành (thực tế có thể lấy từ API)
  const nganhOptions = [
    { value: "cntt", label: "Công nghệ thông tin" },
    { value: "oto", label: "Công nghệ Ô tô" },
    { value: "kt", label: "Kế toán doanh nghiệp" },
    { value: "dl", label: "Hướng dẫn du lịch" },
  ];

  // 3. Hàm thêm ngành vào danh sách
  const handleAddMajor = () => {
    if (!currentEntry.nganh || !currentEntry.chiTieu) return;

    const selectedNganh = nganhOptions.find(
      (o) => o.value === currentEntry.nganh,
    );

    const newEntry: NganhTuyenSinh = {
      id: Math.random().toString(36).substr(2, 9),
      nganhId: currentEntry.nganh,
      nganhLabel: selectedNganh?.label || "",
      heDaoTao: currentEntry.he,
      chiTieu: parseInt(currentEntry.chiTieu),
    };

    setSelectedMajors([...selectedMajors, newEntry]);

    // Reset chỉ field ngành và chỉ tiêu, giữ lại hệ đào tạo cho lần nhập sau
    setCurrentEntry({ ...currentEntry, nganh: "", chiTieu: "" });
  };

  // 4. Hàm xóa ngành
  const handleRemoveMajor = (id: string) => {
    setSelectedMajors(selectedMajors.filter((m) => m.id !== id));
  };

  return (
    <section className="space-y-5">
      {/* Header Section */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Layers size={18} />
        </div>
        <h3 className="font-bold text-slate-700 uppercase text-[13px] tracking-wider">
          Khai báo Ngành & Chỉ tiêu tuyển sinh
        </h3>
      </div>

      {/* Input Row: Hàng nhập liệu */}
      <div className="bg-slate-50/50 p-5 rounded-[24px] border border-dashed border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <SelectOption
              label="Chọn ngành học"
              options={nganhOptions}
              value={currentEntry.nganh}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, nganh: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-3">
            <SelectOption
              label="Hệ đào tạo"
              options={[
                { value: "9+", label: "Hệ 9+" },
                { value: "tc", label: "Trung cấp nghề" },
                { value: "sc", label: "Sơ cấp" },
              ]}
              value={currentEntry.he}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, he: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-3">
            <Input
              label="Chỉ tiêu"
              type="number"
              placeholder="VD: 50"
              icon={Target}
              value={currentEntry.chiTieu}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, chiTieu: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <ButtonAction
              label="Thêm ngành"
              icon={<Plus size={18} />}
              onClick={handleAddMajor}
              className="w-full py-3 rounded-xl shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* List Section: Danh sách các ngành đã chọn */}
      <div className="space-y-3">
        {selectedMajors.length > 0 ? (
          selectedMajors.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[15px]">
                    {item.nganhLabel}
                  </h4>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      Hệ: {item.heDaoTao}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-tight">
                      Chỉ tiêu: {item.chiTieu} học sinh
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemoveMajor(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-10 border-2 border-dashed border-slate-100 rounded-[24px] flex flex-col items-center justify-center text-slate-400">
            <p className="text-[13px] font-medium">
              Chưa có ngành nào được chọn
            </p>
          </div>
        )}
      </div>

      {/* Tổng cộng nhanh */}
      {selectedMajors.length > 0 && (
        <div className="flex justify-end px-4">
          <p className="text-[13px] font-bold text-slate-500">
            Tổng chỉ tiêu đợt này:{" "}
            <span className="text-slate-800 text-lg">
              {selectedMajors.reduce((acc, cur) => acc + cur.chiTieu, 0)}
            </span>{" "}
            học sinh
          </p>
        </div>
      )}
    </section>
  );
};

export default NganhTuyenSinhList;
