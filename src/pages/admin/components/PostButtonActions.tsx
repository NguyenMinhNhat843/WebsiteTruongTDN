import { usePostForm } from "../hooks/usePostForm";

const PostButtonActions = () => {
  const { handleReset } = usePostForm();
  return (
    <div className="flex flex-col gap-3">
      <button
        type="submit"
        className="w-full py-4 px-6 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95"
      >
        🚀 Đăng bài viết
      </button>
      <button
        type="button"
        className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition-all"
      >
        💾 Lưu nháp
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="w-full py-3 px-6 text-slate-400 hover:text-red-500 rounded-2xl font-medium text-sm transition-colors"
      >
        🗑️ Hủy bỏ
      </button>
    </div>
  );
};

export default PostButtonActions;
