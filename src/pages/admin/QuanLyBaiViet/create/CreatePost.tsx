import ContentEditor, {
  type ContentEditorRef,
} from "../../../../components/ui/ContentEditor";
import PostCategoryPicker from "./components/PostCategoryPicker";
import PostCoverImage from "./components/PostCoverImage";
import PageShell from "../../../../components/ui/PageShell";
import { Eye, Newspaper, Save, Send, X } from "lucide-react";
import {
  CreatePostProvider,
  POST_STATUSES,
  useCreatePostContext,
  type CreatePostDto,
  type PostResponseDto,
} from "./CreatePostProvider";
import { useRef } from "react";
import ButtonAction from "../../../../components/ui/ButtonAction";
import { SelectOption } from "../../../../components/ui/Form/SelectOption";
import { toast } from "sonner";

interface CreatePostProps {
  defaultValues?: PostResponseDto;
}

const CreatePost = ({ defaultValues }: CreatePostProps) => {
  return (
    <CreatePostProvider defaultValues={defaultValues}>
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
    defaultValue,
    updatePost,
    isUpdatingPost,
    isUploadingImage,
  } = useCreatePostContext();
  const editorRef = useRef<ContentEditorRef>(null);

  const onSubmit = (data: CreatePostDto) => {
    const htmlData = editorRef?.current?.getHTML() || "";

    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("content", htmlData);
    formData.append("status", data.status || "DRAFT");
    formData.append("type", data.type || "NEWS");
    formData.append("authorId", String(1));

    if (data.coverImage) {
      const imgValue = data.coverImage as unknown;

      if (imgValue instanceof FileList && imgValue.length > 0) {
        formData.append("coverImage", imgValue[0]);
      } else if (imgValue instanceof File) {
        formData.append("coverImage", imgValue);
      }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (defaultValue) {
      updatePost(
        {
          body: formData as any,
          params: {
            path: {
              id: defaultValue.id!,
            },
          },
        },
        {
          onSuccess: () => {
            toast.success("Cập nhật thành công");
          },
          onError: () => {
            toast.error("Cập nhật thất bại, vui lòng thử lại sau");
          },
        },
      );
    } else {
      createPost(
        {
          body: formData as any,
        },
        {
          onSuccess: () => {
            toast.success("Đăng bài thành công");
          },
          onError: () => {
            toast.error("Đăng bài thất bại, vui lòng thử lại sau");
          },
        },
      );
    }
  };

  return (
    <PageShell
      title={`${defaultValue ? "Chỉnh sửa" : "Tạo mới"} bài viết`}
      sub="Chia sẻ những thông tin hữu ích về trường học đến cộng đồng"
      icon={Newspaper}
      renderRight={
        <div className="flex items-center gap-2">
          <SelectOption
            {...register("status")}
            options={POST_STATUSES}
            containerClassName="w-36"
          />

          <ButtonAction
            title={defaultValue ? "Cập nhật" : "Xác nhận gửi"}
            icon={<Send className="w-4 h-4" />}
            type="submit"
            form="create-post-form"
            loading={isCreatingPost || isUpdatingPost || isUploadingImage}
          />
        </div>
      }
    >
      <form
        id="create-post-form"
        /* eslint-disable-next-line react-hooks/refs */
        onSubmit={handleSubmit(onSubmit)}
      />
      <div>
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
              value={defaultValue?.content || ""}
              onPasteImage={async (file, onUploadSuccess: any) => {
                const formData = new FormData();
                formData.append("file", file);

                // Gọi API ngầm dưới nền, KHÔNG dùng await để chặn luồng chạy nữa
                uploadImage(
                  { body: formData },
                  {
                    onSuccess: (data: any) => {
                      const uploadedUrl = data?.imageUrl || "";
                      if (uploadedUrl) {
                        // Khi có URL thật từ server, kích hoạt callback báo cho Editor biết
                        onUploadSuccess(uploadedUrl);
                      }
                    },
                    onError: (error: any) => {
                      alert("Tải ảnh lên thất bại: " + JSON.stringify(error));
                    },
                  },
                );
              }}
            />
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-6">
            <PostCategoryPicker />

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
      </div>
    </PageShell>
  );
};

export default CreatePost;
