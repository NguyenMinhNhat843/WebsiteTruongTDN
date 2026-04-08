function DeleteModal({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">Xác nhận xoá</h2>
          <p className="text-sm text-gray-500">
            Bạn có chắc muốn xoá đợt tuyển sinh{" "}
            <strong className="text-gray-800">"{name}"</strong>? Hành động này
            không thể hoàn tác.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
