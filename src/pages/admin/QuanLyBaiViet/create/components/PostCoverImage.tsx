import { useCreatePostContext } from "../CreatePostProvider";

const PostCoverImage = () => {
  const { register, watch, setValue } = useCreatePostContext();

  const coverImageValue = watch("coverImage");

  let coverPreview: string | null = null;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (coverImageValue) {
    if (
      (coverImageValue as any) instanceof FileList &&
      coverImageValue.length > 0
    ) {
      // Trường hợp 1: Người dùng vừa chọn file mới từ máy tính
      coverPreview = URL.createObjectURL((coverImageValue as any)[0]);
    } else if (
      typeof coverImageValue === "string" &&
      coverImageValue.trim() !== ""
    ) {
      // Trường hợp 2: Dữ liệu mặc định từ Backend truyền sang đang là dạng string URL
      coverPreview = coverImageValue;
    }
  }
  console.log("Current coverImage value:", coverImageValue);
  console.log("Derived coverPreview URL:", coverPreview);

  const handleRemoveCoverImage = () => {
    // Khi xóa, set về undefined (hoặc "" chuỗi rỗng tùy thuộc backend của bạn nhận gì)
    setValue("coverImage", undefined);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {coverPreview ? (
        <div className="relative group">
          <img
            src={coverPreview}
            alt="cover"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <label
              htmlFor="cover-image-upload"
              className="px-4 py-2 bg-white text-slate-800 rounded-lg font-semibold text-sm hover:bg-slate-100 cursor-pointer inline-flex items-center"
            >
              🔄 Đổi ảnh
            </label>
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
        <label
          htmlFor="cover-image-upload"
          className="w-full h-44 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all group cursor-pointer"
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
        </label>
      )}
      <input
        id="cover-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        {...register("coverImage")}
      />
    </div>
  );
};

export default PostCoverImage;
