import { usePostForm } from "../hooks/usePostForm";

const PostPublishSetting = () => {
  const {
    values,
    handleTogglePinned,
    handleTogglePublished,
    handlePublishDateChange,
  } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        ⚙️ Cài đặt đăng bài
      </label>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            📌 Ghim bài viết
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Hiển thị cố định trên đầu
          </p>
        </div>
        <button
          type="button"
          onClick={handleTogglePinned}
          className={`w-11 h-6 rounded-full relative transition-all ${values.isPinned ? "bg-indigo-600" : "bg-slate-200"}`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${values.isPinned ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            🌐 Công bố ngay
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Hiển thị cho mọi người
          </p>
        </div>
        <button
          type="button"
          onClick={handleTogglePublished}
          className={`w-11 h-6 rounded-full relative transition-all ${values.isPublished ? "bg-green-500" : "bg-slate-200"}`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all ${values.isPublished ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>

      <div className="pt-3">
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          📅 Hẹn giờ đăng
        </label>
        <input
          type="datetime-local"
          value={values.publishDate}
          onChange={handlePublishDateChange}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-slate-600 transition-all"
        />
      </div>
    </div>
  );
};

export default PostPublishSetting;
