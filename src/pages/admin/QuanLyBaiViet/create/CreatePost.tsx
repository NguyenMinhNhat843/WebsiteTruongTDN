import ContentEditor, {
  type ContentEditorRef,
} from "../../../../components/ui/ContentEditor";
import PostCategoryPicker from "../../../../features/posts/components/PostCategoryPicker";
import PostCoverImage from "./components/PostCoverImage";
import PostPublishSetting from "../../../../features/posts/components/PostPublishSetting";
import PageShell from "../../../../components/ui/PageShell";
import { Eye, Newspaper, Save, Send, X } from "lucide-react";
import {
  CreatePostProvider,
  useCreatePostContext,
  type CreatePostDto,
  type PostCategoryType,
  type PostStatus,
} from "./CreatePostProvider";
import { useRef } from "react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import PostAudiencePicker from "./components/PostAudiencePicker";

const CreatePost = () => {
  return (
    <CreatePostProvider>
      <Inner />
    </CreatePostProvider>
  );
};

const Inner = () => {
  const {
    register,
    handleSubmit,
    createPost,
    isCreatingPost,
    uploadImage,
    uploadImageData,
  } = useCreatePostContext();
  const editorRef = useRef<ContentEditorRef>(null);

  const onSubmit = (data: CreatePostDto) => {
    const htmlData = editorRef?.current?.getHTML() || "";

    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("content", htmlData);
    formData.append("status", "DRAFT" as PostStatus);
    formData.append("type", "NEWS" as PostCategoryType);
    formData.append("authorId", String(1));

    if (data.coverImage) {
      formData.append("coverImage", data.coverImage[0]);
    }

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    createPost(
      {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        body: formData as any,
      },
      {
        onSuccess: () => {
          alert("Đăng bài thành công");
        },
        onError: (error: any) => {
          alert("Failed to create post: " + JSON.stringify(error));
        },
      },
    );
  };

  return (
    <PageShell
      title="Tạo bài viết mới"
      sub="Chia sẻ những thông tin hữu ích về trường học đến cộng đồng"
      icon={Newspaper}
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

          <ButtonAction
            title="Đăng bài viết"
            icon={<Send className="w-4 h-4" />}
            type="submit"
            form="create-post-form"
            loading={isCreatingPost}
          />
        </div>
      }
    >
      <form
        id="create-post-form"
        onSubmit={handleSubmit((data) => onSubmit(data))}
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
                {...register("title", {
                  required: "Tiêu đề không được để trống",
                })}
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                className="w-full text-2xl font-black text-slate-800 placeholder-slate-300 border-none outline-none leading-snug bg-transparent"
              />
            </div>

            <PostCoverImage />
            <ContentEditor
              ref={editorRef}
              onPasteImage={async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                await uploadImage(
                  {
                    body: formData,
                  },
                  {
                    onSuccess: () => {
                      return uploadImageData?.imageUrl || "";
                    },
                    onError: (error: any) => {
                      alert("Failed to upload image: " + JSON.stringify(error));
                      return "";
                    },
                  },
                );

                return uploadImageData?.imageUrl || "";
              }}
            />
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
};

export default CreatePost;
