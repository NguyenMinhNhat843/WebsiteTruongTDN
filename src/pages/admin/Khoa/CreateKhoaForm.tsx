import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { useForm, Controller } from "react-hook-form";
import {
  LayoutGrid,
  Hash,
  UserCircle,
  FileText,
  Search,
  Check,
  ChevronDown,
} from "lucide-react";
import { $api } from "../../../api/client";
import { useKhoaContext } from "./KhoaProvider";
import type { DepartmentDto } from "../../../api/entity";

// Type chuẩn theo yêu cầu cấu trúc
export type CreateKhoaFormData = {
  headOfDepartmentId?: any; // Gán ID giáo viên (number) khi chọn từ danh sách
  deptCode: string;
  deptName: string;
  description?: any;
};

export interface CreateKhoaFormRef {
  submitForm: () => void;
}

interface CreateKhoaFormProps {
  onSuccess?: () => void;
  departmentData?: DepartmentDto;
  isLoading?: boolean;
}

const CreateKhoaForm = forwardRef<CreateKhoaFormRef, CreateKhoaFormProps>(
  (props, ref) => {
    const { onSuccess, departmentData, isLoading } = props;
    const { createDepartment } = useKhoaContext();

    // Khai báo mutation cập nhật phòng ban/khoa theo id
    const { mutate: updateDepartment, isPending: isUpdating } =
      $api.useMutation("patch", "/departments/{id}");

    // Xác định xem form đang ở chế độ chỉnh sửa hay không
    const isEditMode = !!departmentData?.id;

    // Quản lý trạng thái đóng/mở và tìm kiếm của Combobox Giáo viên
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Lấy danh sách Giáo viên từ API
    const { data: teachersData, isLoading: isLoadingTeachers } = $api.useQuery(
      "get",
      "/staffs",
      {
        params: {
          query: {
            employeeRole: "TEACHER",
          },
        },
      },
    );

    // Đảm bảo dữ liệu là mảng để an tâm map
    const teachersList = Array.isArray(teachersData) ? teachersData : [];

    // 1. Khởi tạo useForm
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateKhoaFormData>({
      defaultValues: {
        deptName: "",
        deptCode: "",
        headOfDepartmentId: undefined,
        description: "",
      },
    });

    // 2. Cập nhật giá trị mặc định khi dữ liệu departmentData thay đổi (Chế độ Edit)
    useEffect(() => {
      if (departmentData) {
        reset({
          deptName: departmentData.deptName || "",
          deptCode: departmentData.deptCode || "",
          headOfDepartmentId: departmentData.headOfDepartmentId ?? undefined,
          description: departmentData.description || "",
        });
      } else {
        reset({
          deptName: "",
          deptCode: "",
          headOfDepartmentId: undefined,
          description: "",
        });
      }
    }, [departmentData, reset]);

    // Tự động đóng dropdown khi click ra ngoài
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 3. Xử lý khi nhấn nút lưu dữ liệu form
    const onSubmit = (data: CreateKhoaFormData) => {
      const payload = {
        deptCode: data.deptCode,
        deptName: data.deptName,
        headOfDepartmentId: data.headOfDepartmentId || null,
        description: data.description || null,
      };

      if (isEditMode) {
        // Chế độ Cập nhật dữ liệu
        updateDepartment(
          {
            params: {
              path: {
                id: departmentData!.id,
              },
            },
            body: payload,
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          },
        );
      } else {
        // Chế độ Tạo mới dữ liệu
        createDepartment(
          {
            body: payload,
          },
          {
            onSuccess: () => {
              onSuccess?.();
            },
          },
        );
      }
    };

    // Lộ hàm kích hoạt submit ra ngoài cho Modal gọi tới
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    // Lọc danh sách giáo viên dựa trên chuỗi tìm kiếm
    const filteredTeachers = teachersList.filter((teacher) => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = teacher.fullName?.toLowerCase().includes(searchLower);
      const codeMatch = teacher.staffCode?.toLowerCase().includes(searchLower);
      const idMatch = String(teacher.id).includes(searchLower);
      return nameMatch || codeMatch || idMatch;
    });

    const isFormLoading = isLoading || isUpdating;

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 ${isFormLoading ? "opacity-60 pointer-events-none" : ""}`}
      >
        {/* Phân vùng tiêu đề */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-5 bg-indigo-600 rounded-full" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isEditMode
              ? "Cập nhật thông tin đơn vị đào tạo"
              : "Thông tin đơn vị đào tạo"}
          </h3>
        </div>

        {/* CỘT 1: TÊN KHOA & MÃ KHOA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nhập Tên Khoa */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Tên khoa chuyên môn <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="deptName"
              control={control}
              rules={{ required: "Tên khoa không được để trống" }}
              render={({ field }) => (
                <div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LayoutGrid size={18} className="text-slate-400" />
                    </div>
                    <input
                      {...field}
                      type="text"
                      placeholder="VD: Khoa Công nghệ Ô tô"
                      className={`block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 transition-all outline-none text-slate-800 placeholder-slate-400 ${
                        errors.deptName
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                  </div>
                  {errors.deptName && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
                      {errors.deptName.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Nhập Mã Khoa */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Mã khoa <span className="text-rose-500">*</span>
            </label>
            <Controller
              name="deptCode"
              control={control}
              rules={{ required: "Mã khoa là bắt buộc" }}
              render={({ field }) => (
                <div>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={18} className="text-slate-400" />
                    </div>
                    <input
                      {...field}
                      type="text"
                      placeholder="VD: KCNOTO"
                      disabled={isEditMode} // Thường mã Code định danh không nên cho chỉnh sửa
                      className={`block w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:ring-4 transition-all outline-none placeholder-slate-400 ${
                        isEditMode
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300"
                          : "bg-slate-50 text-slate-800 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/10"
                      } ${
                        errors.deptCode
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                          : ""
                      }`}
                    />
                  </div>
                  {errors.deptCode && (
                    <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
                      {errors.deptCode.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* CỘT 2: BỔ NHIỆM TRƯỞNG KHOA */}
        <div className="space-y-1.5" ref={dropdownRef}>
          <label className="block text-sm font-semibold text-slate-700">
            Trưởng khoa phụ trách
          </label>
          <Controller
            name="headOfDepartmentId"
            control={control}
            render={({ field }) => {
              const selectedTeacher = teachersList.find(
                (t) => t.id === field.value,
              );

              return (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-left text-slate-900 font-medium"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle size={20} className="text-slate-500" />
                    </div>
                    {selectedTeacher ? (
                      <span className="text-[15px] font-semibold text-slate-900">
                        {selectedTeacher.fullName}{" "}
                        {selectedTeacher.staffCode && (
                          <span className="text-xs text-slate-500 font-normal ml-1">
                            ({selectedTeacher.staffCode})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">
                        Chọn trưởng khoa từ danh sách giảng viên...
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform duration-200 shrink-0 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-30 w-full mt-2 rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="p-2.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Search
                          size={16}
                          className="text-slate-400 shrink-0 ml-1"
                        />
                        <input
                          type="text"
                          placeholder="Tìm theo tên hoặc mã giảng viên..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full py-1.5 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="text-slate-500 hover:text-slate-700 text-xs bg-slate-200 rounded-lg px-2 py-1"
                          >
                            Xóa
                          </button>
                        )}
                      </div>

                      <ul className="max-h-[220px] overflow-y-auto py-1 divide-y divide-slate-100">
                        {isLoadingTeachers ? (
                          <li className="p-4 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            Đang tải danh sách...
                          </li>
                        ) : filteredTeachers.length === 0 ? (
                          <li className="p-4 text-center text-sm text-slate-400">
                            Không tìm thấy giảng viên phù hợp
                          </li>
                        ) : (
                          filteredTeachers.map((teacher) => (
                            <li key={teacher.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(teacher.id);
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                                  field.value === teacher.id
                                    ? "bg-indigo-50 text-indigo-900 font-semibold"
                                    : "text-slate-900 hover:text-indigo-900"
                                }`}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[14px] font-semibold text-slate-900">
                                    {teacher.fullName}
                                  </span>
                                  {teacher.staffCode && (
                                    <span className="text-[11px] text-slate-500 font-normal">
                                      Mã cán bộ: {teacher.staffCode}
                                    </span>
                                  )}
                                </div>
                                {field.value === teacher.id && (
                                  <Check
                                    size={18}
                                    className="text-indigo-600 shrink-0 ml-2"
                                  />
                                )}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* CỘT 3: MÔ TẢ CHỨC NĂNG */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText size={16} className="text-slate-400" /> Mô tả chức năng /
            nhiệm vụ khoa
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[110px] text-sm text-slate-800 placeholder-slate-400"
                placeholder="Nhập giới thiệu ngắn gọn hoặc vai trò nghiên cứu của khoa..."
              />
            )}
          />
        </div>
      </form>
    );
  },
);

CreateKhoaForm.displayName = "CreateKhoaForm";

export default CreateKhoaForm;
