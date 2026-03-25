import { usePostForm } from "../hooks/usePostForm";

const PostCoverImage = () => {
  const { values, fileRef, handleRemoveCoverImage, handleImageUpload } =
    usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {values.coverPreview ? (
        <div className="relative group">
          <img
            src={values.coverPreview}
            alt="cover"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-white text-slate-800 rounded-lg font-semibold text-sm hover:bg-slate-100"
            >
              🔄 Đổi ảnh
            </button>
            <button
              type="button"
              onClick={handleRemoveCoverImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600"
            >
              🗑️ Xóa
            </button>
          </div>
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-slate-700">
            📷 Ảnh bìa
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-44 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-2xl transition-colors">
            🖼️
          </div>
          <div className="text-center">
            <p className="font-semibold">Thêm ảnh bìa</p>
            <p className="text-xs text-slate-300 mt-1">
              JPG, PNG, WEBP tối đa 5MB
            </p>
          </div>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default PostCoverImage;
