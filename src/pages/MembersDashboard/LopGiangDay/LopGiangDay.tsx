import { useEffect, useMemo } from "react";
import { BookOpen, Users, DoorOpen, Eye, LayoutGrid } from "lucide-react";
import ButtonAction from "../../../components/ui/ButtonAction";
import PageShell from "../../../components/ui/PageShell";
import { SelectOption } from "../../../components/ui/Form/SelectOption";
import {
  LopGiangDayProvider,
  useLopGiangDayContext,
} from "./LopGiangDayProvider";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const LopHocGiangDay = () => {
  return (
    <LopGiangDayProvider>
      <Inner />
    </LopGiangDayProvider>
  );
};

const Inner = () => {
  const {
    hocKysData,
    classList,
    isLoading,
    setSearchParams,
    semesterIdNumber,
    currentSemester,
  } = useLopGiangDayContext();
  const navigate = useNavigate();

  useEffect(() => {
    // tự động redirect tới semesterId hiện tại nếu URL chưa có semesterId
    if (!semesterIdNumber && hocKysData) {
      const currentHocKy = hocKysData.find(
        (hk) => hk.id === currentSemester?.id,
      );
      if (currentHocKy) {
        setSearchParams({ semesterId: String(currentHocKy.id) });
      }
    }
  }, []);

  const hocKyOptions =
    hocKysData?.map((hk) => ({
      value: hk.id,
      label: `${hk.name}`,
    })) || [];

  const columnHelper = createColumnHelper<(typeof classList)[0]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("classId", {
        header: "ID lớp",
        cell: (info) => (
          <span className="font-mono text-gray-500 font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("baseClass.className", {
        header: "Tên lớp",
        cell: (info) => {
          return (
            <span className="font-semibold text-gray-900">
              {info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor("baseClass.classCode", {
        header: "Mã lớp",
        cell: (info) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("subject.subjectName", {
        header: "Tên môn học",
        cell: (info) => (
          <span className="font-medium text-gray-700">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("subject.subjectCode", {
        header: "Mã môn học",
        cell: (info) => (
          <span className="font-mono text-sm text-gray-600">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("baseClass.currentSize", {
        header: "Số lượng sinh viên",
        cell: (info) => (
          <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
            <Users className="w-4 h-4 text-gray-400" />
            {info.getValue() || 0}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Thao tác",
        cell: (info) => (
          <ButtonAction
            variant="outline"
            size="sm"
            label="Nhập điểm"
            onClick={() => {
              navigate(
                `/teacher/nhap-diem?classSubjectId=${info.row.original.id}&classId=${info.row.original.classId}`,
              );
            }}
            icon={<Eye className="w-4 h-4" />}
            className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
          />
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: classList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  console.log("classList: ", classList);

  // Tính toán nhanh số liệu tổng quan (Stats) hiển thị phía trên bảng cho sinh động
  const totalClasses = classList?.length || 0;
  const totalStudents =
    classList?.reduce(
      (acc, curr) => acc + (curr?.baseClass?.currentSize || 0),
      0,
    ) || 0;

  return (
    <PageShell
      title="Lớp Học Giảng Dạy"
      sub="Quản lý danh sách các lớp học và môn học được phân công giảng dạy."
      icon={LayoutGrid}
      renderRight={
        <SelectOption
          containerClassName="w-48"
          value={semesterIdNumber}
          onChange={(e) => {
            setSearchParams({
              semesterId: e.target.value,
            });
          }}
          options={hocKyOptions}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tổng số lớp dạy
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "---" : totalClasses}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Môn học phụ trách
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "---"
                  : new Set(classList?.map((c) => c?.subject?.subjectCode))
                      .size}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Tổng số học sinh
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "---" : totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* Khu vực hiển thị Bảng dữ liệu */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 space-y-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium">
                Đang tải dữ liệu giảng dạy...
              </p>
            </div>
          ) : !classList || classList.length === 0 ? (
            <div className="text-center p-12 text-gray-500 font-medium">
              Không tìm thấy lớp học nào trong học kỳ này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="bg-gray-50/70 border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : typeof header.column.columnDef.header ===
                                "function"
                              ? header.column.columnDef.header(
                                  header.getContext(),
                                )
                              : header.column.columnDef.header}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-4 text-sm text-gray-600 align-middle"
                        >
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
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default LopHocGiangDay;
