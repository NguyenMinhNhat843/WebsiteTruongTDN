import ContentEditor from "../../../components/ui/ContentEditor";
import PostAudiencePicker from "./components/PostAudiencePicker";
import PostCategoryPicker from "../../../features/posts/components/PostCategoryPicker";
import PostCoverImage from "../../../features/posts/components/PostCoverImage";
import PostPublishSetting from "../../../features/posts/components/PostPublishSetting";
import SuccessSubmitScreen from "../../../features/posts/components/SuccessSubmitScreen";
import { usePostForm } from "../../../features/posts/hooks/usePostForm";
import PageShell from "../../../components/ui/PageShell";
import { Eye, Newspaper, Save, Send, X } from "lucide-react";

export default function CreatePost() {
  const { values, submitted, errors, handleTitleChange, handleSubmit } =
    usePostForm();

  if (submitted) {
    return <SuccessSubmitScreen />;
  }

  return (
    <PageShell
      title="Tạo bài viết mới"
      sub="Chia sẻ những thông tin hữu ích về trường học đến cộng đồng"
      icon={<Newspaper className="w-8 h-8" />}
      renderRight={
        <div className="flex items-center gap-2">
          {/* NÚT HỦY: Chỉ icon */}
          <button
            type="button"
            title="Hủy bỏ"
            className="p-2.5 text-slate-500 rounded-xl transition-all
              cursor-pointer hover:text-white hover:bg-red-500
            "
          >
            <X className="w-5 h-5" />
          </button>

          {/* NÚT LƯU NHÁP: Chỉ icon */}
          <button
            type="button"
            title="Lưu nháp"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl 
            transition-all shadow-sm cursor-pointer hover:bg-slate-500 hover:text-white"
          >
            <Save className="w-5 h-5" />
          </button>

          {/* NÚT XEM TRƯỚC: Chỉ icon */}
          <button
            type="button"
            title="Xem trước"
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm
              cursor-pointer
            "
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* NÚT ĐĂNG BÀI: Giữ nguyên label để tạo điểm nhấn (Call to Action) */}
          <button
            type="submit"
            className="ml-1 flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-indigo-600 to-violet-700 text-white rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all shadow-md hover:shadow-indigo-200/50 font-bold text-sm"
          >
            <Send className="w-4 h-4" />
            Đăng bài viết
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
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
            <ContentEditor />
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-6">
            <PostCategoryPicker />

            <PostAudiencePicker />

            <PostPublishSetting />

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
    </PageShell>
  );
}
