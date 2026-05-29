import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Loader2,
  Layers,
  Calendar,
  UserCheck,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Inbox,
} from "lucide-react";
import { useAppContext } from "../../../AppProvider";
import {
  PhanCongGiangDayProvider,
  usePhanCongGiangDayContext,
} from "./PhanCongGiangDayProvider";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import PageShell from "../../../components/ui/PageShell";
import ButtonAction from "../../../components/ui/ButtonAction";

const PhanCongGiangDay = () => {
  return (
    <PhanCongGiangDayProvider>
      <Inner />
    </PhanCongGiangDayProvider>
  );
};

const Inner = () => {
  const {
    classSubjects,
    isLoadingClassSubjects,
    filterClassSubject,
    setFilterClassSubject,
    assignTeacher,
    isPendingAssignTeacher,
    generateClassSubject,
    isPendingGenerateClassSubject,
  } = usePhanCongGiangDayContext();

  const { hocKysData, isHocKysLoading, isMajorsLoading, majors } =
    useAppContext();

  // 1. Chuẩn hóa dữ liệu cho các bộ lọc SelectOption
  const semesterOptions = useMemo(() => {
    return [
      {
        value: "",
        label: "Tất cả học kỳ",
      },
      ...(hocKysData?.map((hk) => ({
        value: hk.id,
        label: hk.name + (hk.isCurrent ? " (Hiện tại)" : ""),
      })) || []),
    ];
  }, [hocKysData]);

  const majorOptions = useMemo(() => {
    return [
      {
        value: "",
        label: "Tất cả chuyên ngành",
      },
      ...(majors?.map((mj) => ({
        value: mj.id,
        label: mj.majorName,
      })) || []),
    ];
  }, [majors]);

  // 2. Định dạng dữ liệu hiển thị trong bảng theo cấu trúc có sẵn
  const dataTableClassSubject = useMemo(() => {
    return (
      classSubjects?.map((cs, index) => ({
        stt: index + 1,
        subjectName: cs.subject.subjectName,
        className: cs?.baseClass?.className || "N/A",
        teacherName: cs.teacher?.fullName || "Chưa có giáo viên",
      })) || []
    );
  }, [classSubjects]);

  // 3. Khởi tạo cấu hình các cột cho TanStack Table
  const columnHelper =
    createColumnHelper<(typeof dataTableClassSubject)[number]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("stt", {
        header: "STT",
        cell: (info) => (
          <span className="font-semibold text-slate-400 text-sm block text-center w-8">
            {String(info.getValue()).padStart(2, "0")}
          </span>
        ),
      }),
      columnHelper.accessor("subjectName", {
        header: "Môn học giảng dạy",
        cell: (info) => (
          <div className="flex items-center gap-3 max-w-[300px]">
            {" "}
            {/* Thêm max-w để giới hạn chiều rộng cột môn học */}
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0 group-hover:bg-blue-100 transition-colors">
              <BookOpen size={18} />
            </div>
            <span className="font-semibold text-slate-800 text-[16px] tracking-tight whitespace-normal break-words">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("className", {
        header: "Lớp học phần",
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <GraduationCap size={16} />
            </div>
            <span className="font-medium text-slate-700 bg-slate-100/80 border border-slate-200/60 px-2.5 py-1 rounded-lg text-sm font-mono">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("teacherName", {
        header: "Giáo viên đảm nhiệm",
        cell: (info) => {
          const name = info.getValue();
          const hasTeacher = name !== "Chưa có giáo viên";
          return (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold tracking-wide border transition-all duration-200 ${
                  hasTeacher
                    ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 shadow-sm shadow-emerald-50"
                    : "bg-amber-50/80 text-amber-700 border-amber-200/60 italic"
                }`}
              >
                {hasTeacher ? (
                  <UserCheck size={15} className="text-emerald-600 shrink-0" />
                ) : (
                  <HelpCircle
                    size={15}
                    className="text-amber-500 shrink-0 animate-pulse"
                  />
                )}
                {name}
              </span>
            </div>
          );
        },
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: dataTableClassSubject,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageShell
      title="Phân công giảng dạy"
      sub="Quản lý và điều phối giáo viên hướng dẫn cho các lớp học phần"
      icon={Layers}
      renderRight={
        <div className="flex items-center gap-3">
          <ButtonAction
            variant="outline"
            label="Phân công giảng dạy"
            icon={<UserCheck size={16} />}
            loading={isPendingAssignTeacher}
            onClick={() => {
              assignTeacher(
                {
                  body: {
                    ...filterClassSubject,
                  },
                },
                {
                  onSuccess: () => {
                    alert("Phân công giảng dạy thành công!");
                  },
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  onError: (err: any) => {
                    alert(
                      "Có lỗi xảy ra khi phân công giảng dạy: " +
                        (err?.response?.data?.message ||
                          err.message ||
                          JSON.stringify(err) ||
                          "Unknown error"),
                    );
                  },
                },
              );
            }}
          />
          <ButtonAction
            label="Sinh dữ liệu môn học cho học kỳ"
            variant="outline"
            icon={<Calendar size={16} />}
            loading={isPendingGenerateClassSubject}
            onClick={() => {
              if (!filterClassSubject || !filterClassSubject.semesterId) {
                alert(
                  "Vui lòng chọn học kỳ trước khi sinh dữ liệu lớp học phần!",
                );
                return;
              }
              generateClassSubject(
                {
                  params: {
                    query: {
                      semesterId: filterClassSubject!.semesterId!,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    alert("Sinh dữ liệu lớp học phần thành công!");
                  },
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  onError: (err: any) => {
                    alert(
                      "Có lỗi xảy ra khi sinh dữ liệu lớp học phần: " +
                        (err?.response?.data?.message ||
                          err.message ||
                          JSON.stringify(err) ||
                          "Unknown error"),
                    );
                  },
                },
              );
            }}
          />
        </div>
      }
    >
      {/* Khu vực Bộ lọc (Filters) */}
      <div
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 
      md:grid-cols-2 gap-4"
      >
        <SelectOption
          label="Học kỳ"
          icon={<Calendar size={16} />}
          options={semesterOptions}
          disabled={isHocKysLoading}
          value={filterClassSubject?.semesterId || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilterClassSubject((prev) => ({
              ...prev,
              semesterId: val ? Number(val) : undefined,
            }));
          }}
        />

        <SelectOption
          label="Chuyên ngành"
          icon={<Layers size={16} />}
          options={majorOptions}
          disabled={isMajorsLoading}
          value={filterClassSubject?.majorId || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilterClassSubject((prev) => ({
              ...prev,
              majorId: val ? Number(val) : undefined,
            }));
          }}
        />
      </div>

      {/* Khung chứa bảng tổng thể */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden mt-6 transition-all duration-300">
        {isLoadingClassSubjects ? (
          /* Trạng thái Tải dữ liệu (Loading State) với Spinner mượt mà */
          <div className="flex flex-col items-center justify-center p-24 gap-4 text-slate-500 bg-white">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 z-10" />
              <div className="absolute w-8 h-8 bg-blue-100 rounded-full blur-sm animate-ping"></div>
            </div>
            <p className="font-semibold text-slate-700 text-lg tracking-tight">
              Đang đồng bộ danh sách lớp...
            </p>
            <p className="text-slate-400 text-sm -mt-2">
              Vui lòng đợi trong giây lát
            </p>
          </div>
        ) : (
          /* Khung cuộn nội dung Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-base">
              {/* Tiêu đề Bảng (Header) */}
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-600 uppercase text-xs font-bold tracking-wider sticky top-0 backdrop-blur-md">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4.5 font-bold text-slate-500 border-none first:pl-8 last:pr-8"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Nội dung Bảng (Body) */}
              <tbody className="divide-y divide-slate-100/70 text-slate-600 bg-white">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-slate-50/60 transition-all duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4.5 whitespace-nowrap align-middle border-none first:pl-8 last:pr-8 transition-colors duration-150"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  /* Trạng thái Trống (Empty State) phong cách Minimalist */
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-20 bg-white text-slate-400 border-none"
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-slate-50 text-slate-400 rounded-full border border-slate-100 shadow-inner">
                          <Inbox size={32} strokeWidth={1.5} />
                        </div>
                        <p className="font-semibold text-slate-700 text-base mt-2">
                          Không tìm thấy lớp học phần nào
                        </p>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto -mt-1 leading-relaxed">
                          Vui lòng điều chỉnh lại bộ lọc hoặc tải lại trang để
                          làm mới dữ liệu.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default PhanCongGiangDay;
