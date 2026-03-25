import { usePostForm } from "../hooks/usePostForm";
import ToolbarButton from "./ToolbarButton";

const PostContentEditor = () => {
  const {
    handleInsertFormat,
    textareaRef,
    values,
    handleContentChange,
    charCount,
    wordCount,
    errors,
  } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="border-b border-slate-100 px-4 py-2 flex items-center gap-1 flex-wrap">
        <ToolbarButton
          icon="B"
          title="In đậm"
          onClick={() => handleInsertFormat("**", "**")}
        />
        <ToolbarButton
          icon={<span className="italic">I</span>}
          title="In nghiêng"
          onClick={() => handleInsertFormat("_", "_")}
        />
        <ToolbarButton
          icon={<span className="line-through text-xs">S</span>}
          title="Gạch ngang"
          onClick={() => handleInsertFormat("~~", "~~")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="H1"
          title="Tiêu đề 1"
          onClick={() => handleInsertFormat("# ")}
        />
        <ToolbarButton
          icon="H2"
          title="Tiêu đề 2"
          onClick={() => handleInsertFormat("## ")}
        />
        <ToolbarButton
          icon="H3"
          title="Tiêu đề 3"
          onClick={() => handleInsertFormat("### ")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="≡"
          title="Danh sách"
          onClick={() => handleInsertFormat("- ")}
        />
        <ToolbarButton
          icon="1."
          title="Danh sách số"
          onClick={() => handleInsertFormat("1. ")}
        />
        <ToolbarButton
          icon="❝"
          title="Trích dẫn"
          onClick={() => handleInsertFormat("> ")}
        />
        <ToolbarButton
          icon="—"
          title="Dòng kẻ"
          onClick={() => handleInsertFormat("\n---\n")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="🔗"
          title="Chèn link"
          onClick={() => handleInsertFormat("[", "](url)")}
        />
      </div>
      <textarea
        ref={textareaRef}
        value={values.content}
        onChange={handleContentChange}
        placeholder="Soạn nội dung bài viết tại đây... Hỗ trợ định dạng Markdown."
        className="w-full min-h-64 p-6 text-slate-700 placeholder-slate-300 border-none outline-none resize-none text-base leading-relaxed bg-transparent"
        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
      />
      <div className="border-t border-slate-100 px-6 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Hỗ trợ Markdown</span>
        <span>
          {charCount} ký tự · {wordCount} từ
        </span>
      </div>
      {errors.content && (
        <p className="text-red-500 text-xs px-6 pb-3 flex items-center gap-1">
          ⚠️ {errors.content}
        </p>
      )}
    </div>
  );
};

export default PostContentEditor;
