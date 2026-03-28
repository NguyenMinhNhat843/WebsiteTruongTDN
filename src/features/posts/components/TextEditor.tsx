import { usePostForm } from "../hooks/usePostForm";
import ToolbarButton from "./ToolbarButton";

const TextEditor = () => {
  const insertFormat = (formatStart: string, formatEnd: string = "") => {
    return formatStart + formatEnd; // Placeholder, logic sẽ được implement trong hook usePostForm
  };

  const { textareaRef, charCount, wordCount } = usePostForm();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="border-b border-slate-100 px-4 py-2 flex items-center gap-1 flex-wrap">
        <ToolbarButton
          icon="B"
          title="In đậm"
          onClick={() => insertFormat("**", "**")}
        />
        <ToolbarButton
          icon={<span className="italic">I</span>}
          title="In nghiêng"
          onClick={() => insertFormat("_", "_")}
        />
        <ToolbarButton
          icon={<span className="line-through text-xs">S</span>}
          title="Gạch ngang"
          onClick={() => insertFormat("~~", "~~")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="H1"
          title="Tiêu đề 1"
          onClick={() => insertFormat("# ")}
        />
        <ToolbarButton
          icon="H2"
          title="Tiêu đề 2"
          onClick={() => insertFormat("## ")}
        />
        <ToolbarButton
          icon="H3"
          title="Tiêu đề 3"
          onClick={() => insertFormat("### ")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="≡"
          title="Danh sách"
          onClick={() => insertFormat("- ")}
        />
        <ToolbarButton
          icon="1."
          title="Danh sách số"
          onClick={() => insertFormat("1. ")}
        />
        <ToolbarButton
          icon="❝"
          title="Trích dẫn"
          onClick={() => insertFormat("> ")}
        />
        <ToolbarButton
          icon="—"
          title="Dòng kẻ"
          onClick={() => insertFormat("\n---\n")}
        />
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton
          icon="🔗"
          title="Chèn link"
          onClick={() => insertFormat("[", "](url)")}
        />
      </div>

      <textarea
        ref={textareaRef}
        // value={content}
        // onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
        //   setContent(e.target.value);
        //   setErrors((p) => ({ ...p, content: undefined }));
        // }}
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
      {/* {errors.content && (
        <p className="text-red-500 text-xs px-6 pb-3 flex items-center gap-1">
          ⚠️ {errors.content}
        </p>
      )} */}
    </div>
  );
};

export default TextEditor;
