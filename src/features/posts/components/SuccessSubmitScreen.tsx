import { usePostForm } from "../hooks/usePostForm";

const SuccessSubmitScreen = () => {
  const { values, handleReset } = usePostForm();
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✅
        </div>
        <h2
          className="text-3xl font-black text-slate-800 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Đăng thành công!
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Bài viết{" "}
          <span className="font-semibold text-indigo-600">
            "{values.title}"
          </span>{" "}
          đã được gửi duyệt và sẽ sớm xuất hiện trên trang chủ.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
          >
            ✏️ Tạo bài viết mới
          </button>
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
          >
            🏠 Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessSubmitScreen;
