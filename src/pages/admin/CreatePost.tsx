import PostAudiencePicker from "../../features/posts/components/PostAudiencePicker";
import PostButtonActions from "../../features/posts/components/PostButtonActions";
import PostCategoryPicker from "../../features/posts/components/PostCategoryPicker";
import PostContentEditor from "../../features/posts/components/PostContentEditor";
import PostCoverImage from "../../features/posts/components/PostCoverImage";
import PostPublishSetting from "../../features/posts/components/PostPublishSetting";
import PostTagInput from "../../features/posts/components/PostTagInput";
import SuccessSubmitScreen from "../../features/posts/components/SuccessSubmitScreen";
import SchoolEditor from "../../features/posts/components/TipTap";
import { usePostForm } from "../../features/posts/hooks/usePostForm";

export default function CreatePost() {
  const { values, submitted, errors, handleTitleChange, handleSubmit } =
    usePostForm();

  if (submitted) {
    return <SuccessSubmitScreen />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/40 to-blue-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Title */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                value={values.title}
                onChange={handleTitleChange}
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                className="w-full text-2xl font-black text-slate-800 placeholder-slate-300 border-none outline-none leading-snug bg-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  ⚠️ {errors.title}
                </p>
              )}
            </div>

            <PostCoverImage />
            <PostContentEditor />
            <PostTagInput />
            <SchoolEditor />
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-6">
            <PostCategoryPicker />

            <PostAudiencePicker />

            <PostPublishSetting />

            <PostButtonActions />

            {/* Info card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-1">💡 Lưu ý</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                Bài viết sẽ được gửi cho ban quản trị duyệt trước khi xuất hiện
                công khai trên website trường. Thời gian xét duyệt thường từ 1–2
                giờ làm việc.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
