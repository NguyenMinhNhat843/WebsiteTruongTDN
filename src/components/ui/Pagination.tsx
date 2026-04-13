interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) => {
  // Nếu chỉ có 1 trang hoặc không có item nào thì không hiện
  if (totalItems <= pageSize) return null;
  const totalPages = Math.ceil(totalItems / pageSize);
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
      <p className="text-xs text-slate-400 flex items-center gap-1">
        Trang
        <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
          {currentPage}
        </span>
        , hiển thị từ
        <span className="font-bold text-emerald-600 px-1">
          {from} - {to}
        </span>
        trên tổng số
        <span className="font-semibold text-slate-700">{totalItems}</span>
        kết quả
      </p>

      <div className="flex items-center gap-1">
        {/* Nút Trước */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          ← Trước
        </button>

        {/* Danh sách số trang */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={[
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {page}
          </button>
        ))}

        {/* Nút Sau */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
