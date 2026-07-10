import React, { useState } from "react";
import { Plus, MapPin, Loader2, X, Save, Compass } from "lucide-react";
import { $api } from "../../../api/client";
import ProvinceNode from "./components/ProvinceNode";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ModalState {
  isOpen: boolean;
  type: "create" | "update";
  level: "province" | "ward" | "village";
  parentCode?: string;
  currentData?: {
    code?: string;
    id?: number;
    name: string;
    fullName?: string;
    codeName?: string;
  };
}

export default function DiaChiTree() {
  const queryClient = useQueryClient();
  const {
    data: provinces,
    isLoading,
    refetch: refetchProvinces,
  } = $api.useQuery("get", "/provinces");

  const createProvince = $api.useMutation("post", "/provinces");
  const updateProvince = $api.useMutation("patch", "/provinces/{code}");
  const deleteProvince = $api.useMutation("delete", "/provinces/{code}");

  const createWard = $api.useMutation("post", "/wards");
  const updateWard = $api.useMutation("patch", "/wards/{code}");
  const deleteWard = $api.useMutation("delete", "/wards/{code}");

  const createVillage = $api.useMutation("post", "/villages");
  const updateVillage = $api.useMutation("patch", "/villages/{id}");
  const deleteVillage = $api.useMutation("delete", "/villages/{id}");

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: "create",
    level: "province",
  });

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    fullName: "",
    codeName: "",
  });

  // Trạng thái loading khi đang submit form
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (
    level: "province" | "ward" | "village",
    idOrCode: string | number,
  ) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa mục này và tất cả các cấp con trực thuộc?",
      )
    )
      return;

    if (level === "province") {
      await deleteProvince.mutateAsync({
        params: { path: { code: idOrCode as string } },
      });
      refetchProvinces();
    } else if (level === "ward") {
      await deleteWard.mutateAsync({
        params: { path: { code: idOrCode as string } },
      });
    } else {
      await deleteVillage.mutateAsync({
        params: { path: { id: idOrCode as number } },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modal.level === "province") {
        if (modal.type === "create") {
          await createProvince.mutateAsync({ body: formData });
        } else {
          await updateProvince.mutateAsync({
            params: { path: { code: modal.currentData?.code! } },
            body: {
              name: formData.name,
              fullName: formData.fullName,
              codeName: formData.codeName,
            },
          });
        }
        refetchProvinces();
      } else if (modal.level === "ward") {
        if (modal.type === "create") {
          await createWard.mutateAsync({
            body: { ...formData, provinceCode: modal.parentCode! },
          });
        } else {
          await updateWard.mutateAsync({
            params: { path: { code: modal.currentData?.code! } },
            body: {
              name: formData.name,
              fullName: formData.fullName,
              codeName: formData.codeName,
            },
          });
        }
        queryClient.invalidateQueries({
          queryKey: ["get", "/wards"],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/villages"],
        });
      } else if (modal.level === "village") {
        if (modal.type === "create") {
          await createVillage.mutateAsync({
            body: { name: formData.name, wardCode: modal.parentCode! },
          });
        } else {
          await updateVillage.mutateAsync({
            params: { path: { id: modal.currentData?.id! } },
            body: { name: formData.name },
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["get", "/villages"],
        });
      }
      setModal({ ...modal, isOpen: false });
    } catch (error) {
      alert("Đã có lỗi xảy ra khi lưu dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (
    type: "create" | "update",
    level: "province" | "ward" | "village",
    parentCode?: string,
    currentData?: any,
  ) => {
    setModal({ isOpen: true, type, level, parentCode, currentData });
    if (type === "update" && currentData) {
      setFormData({
        code: currentData.code || "",
        name: currentData.name,
        fullName: currentData.fullName || "",
        codeName: currentData.codeName || "",
      });
    } else {
      setFormData({ code: "", name: "", fullName: "", codeName: "" });
    }
  };

  // UI Skeleton Loading sang chảnh thay vì dòng chữ thô sơ
  if (isLoading)
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 rounded w-40"></div>
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-14 bg-slate-100 rounded-lg border border-slate-200/60"
          ></div>
        ))}
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen antialiased text-slate-600">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-sm">
            <Compass size={24} className="stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Quản Lý Địa Danh Hành Chính
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Cấu trúc cây dữ liệu Tỉnh / Thành phố • Xã / Phường • Thôn / Xóm
            </p>
          </div>
        </div>

        <button
          onClick={() => openModal("create", "province")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-blue-200 transition-all duration-150"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Thêm Tỉnh / Thành
        </button>
      </div>

      {/* CÂY THƯ MỤC GỐC */}
      <div className="space-y-3">
        {provinces && provinces.length > 0 ? (
          provinces.map((province) => (
            <ProvinceNode
              key={province.code}
              province={province}
              onEdit={(data: any) =>
                openModal("update", "province", undefined, data)
              }
              onAddChild={(code: string) => openModal("create", "ward", code)}
              onDelete={(code: string) => handleDelete("province", code)}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <MapPin
              size={32}
              className="mx-auto text-slate-300 mb-2 stroke-[1.5]"
            />
            <p className="text-sm text-slate-400">
              Chưa có dữ liệu đơn vị hành chính nào.
            </p>
          </div>
        )}
      </div>

      {/* MODAL ĐƠN (UPGRADED UI/UX) */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl border border-slate-100 flex flex-col gap-4 relative animate-scaleUp"
          >
            {/* Nút đóng modal góc phải */}
            <button
              type="button"
              onClick={() => setModal({ ...modal, isOpen: false })}
              className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                {modal.type === "create" ? "Thêm mới" : "Cập nhật"}{" "}
                <span className="text-blue-600">
                  {modal.level === "province"
                    ? "Tỉnh/Thành"
                    : modal.level === "ward"
                      ? "Xã/Phường"
                      : "Thôn/Xóm"}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vui lòng điền đầy đủ các thông tin bắt buộc dưới đây.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {/* Trường Code */}
              {modal.type === "create" && modal.level !== "village" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">
                    Mã Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: 79, 01,..."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all font-mono"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Trường Tên rút gọn */}
              <div>
                <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">
                  Tên gọi ngắn gọn <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Khánh Hòa, Diên Khánh..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Nhóm trường Tỉnh/Xã */}
              {modal.level !== "village" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">
                      Tên đầy đủ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Tỉnh Khánh Hòa..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-1">
                      Code Name (Slug) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: khanh_hoa"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400 transition-all font-mono"
                      value={formData.codeName}
                      onChange={(e) =>
                        setFormData({ ...formData, codeName: e.target.value })
                      }
                    />
                  </div>
                </>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setModal({ ...modal, isOpen: false })}
                className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-all disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm shadow-blue-200 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Lưu lại
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
