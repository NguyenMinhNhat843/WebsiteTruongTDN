import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useCallback, useState } from "react";
import {
  Bold,
  Italic,
  LucideUnderline,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
} from "lucide-react";

// ── Custom FontSize extension (requires TextStyle as base) ─────────────────
// FontSize adds a `fontSize` attribute to the TextStyle mark.
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
});

// ── Types ──────────────────────────────────────────────────────────────────
type Alignment = "left" | "center" | "right";

// Heading styles are applied as inline fontSize+bold (not block-level nodes),
// so they work on any text selection — exactly like bold/italic.
type HeadingStyle = "h1" | "h2" | "h3" | "h4" | "normal";

const HEADING_STYLES: Record<
  HeadingStyle,
  { fontSize: string; label: string; bold: boolean }
> = {
  h1: { fontSize: "2rem", label: "H1", bold: false },
  h2: { fontSize: "1.5rem", label: "H2", bold: false },
  h3: { fontSize: "1.25rem", label: "H3", bold: false },
  h4: { fontSize: "1rem", label: "H4", bold: false },
  normal: { fontSize: "1rem", label: "Thường", bold: false },
};

// ── Toolbar button ─────────────────────────────────────────────────────────
interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}
const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
  className = "",
}: ToolbarButtonProps) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={[
      "relative flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-all duration-150",
      "hover:bg-slate-100 active:scale-95",
      active
        ? "bg-indigo-50 text-indigo-600 shadow-inner ring-1 ring-indigo-200"
        : "text-slate-600",
      className,
    ].join(" ")}
  >
    {children}
  </button>
);

// ── Divider ────────────────────────────────────────────────────────────────
const Divider = () => <div className="w-px h-6 bg-slate-200 mx-1 shrink-0" />;

// ── Main component ─────────────────────────────────────────────────────────
export default function ContentEditor() {
  const [charCount, setCharCount] = useState(0);
  const [fontSize, setFontSize] = useState("16");

  const editor = useEditor({
    extensions: [
      // Disable inputRules that swallow "-" and "1. " on first keystroke
      StarterKit.configure({
        heading: false, // we handle headings as inline styles, not block nodes
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      TextStyle, // Required base for FontSize to work
      FontSize,
      Underline,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: `<h1>Tiêu đề bài viết</h1><p>Bắt đầu viết nội dung của bạn tại đây. Bạn có thể <strong>in đậm</strong>, <em>in nghiêng</em>, <u>gạch chân</u> văn bản, hoặc dán hình ảnh vào editor.</p>`,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[420px] focus:outline-none px-8 py-6 leading-relaxed",
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              view.dispatch(
                view.state.tr.replaceSelectionWith(
                  view.state.schema.nodes.image.create({ src }),
                ),
              );
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate({ editor }) {
      setCharCount(editor.getText().length);
    },
  });

  // Apply font size as a TextStyle mark (requires TextStyle extension)
  const applyFontSize = useCallback(
    (size: string) => {
      setFontSize(size);
      if (!editor) return;
      editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    },
    [editor],
  );

  // Apply heading style as inline marks (fontSize + bold) so it works on selections
  const applyHeadingStyle = useCallback(
    (style: HeadingStyle) => {
      if (!editor) return;
      const { fontSize, bold } = HEADING_STYLES[style];
      const chain = editor.chain().focus().setMark("textStyle", { fontSize });
      if (bold) chain.setBold();
      else chain.unsetBold();
      chain.run();
      setFontSize(fontSize);
    },
    [editor],
  );

  const setAlign = useCallback(
    (align: Alignment) => {
      editor?.chain().focus().setTextAlign(align).run();
    },
    [editor],
  );

  if (!editor) return null;

  const currentAlign: Alignment =
    (["left", "center", "right"] as Alignment[]).find((a) =>
      editor.isActive({ textAlign: a }),
    ) ?? "left";

  return (
    <div className="w-full shadow-md">
      {/* Editor card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="border-b border-slate-100 px-4 py-2.5 flex flex-wrap items-center gap-0.5 bg-slate-50/70 backdrop-blur-sm">
          {/* Bold / Italic / Underline */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="In đậm (Ctrl+B)"
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="In nghiêng (Ctrl+I)"
          >
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Gạch chân (Ctrl+U)"
          >
            <LucideUnderline />
          </ToolbarButton>

          <Divider />

          {/* Font size */}
          <div className="relative flex items-center">
            <select
              value={fontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              title="Cỡ chữ"
              className="appearance-none h-8 pl-2.5 pr-6 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer transition-colors"
            >
              {[10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
                <option key={s} value={String(s)}>
                  {s}px
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-1.5 text-slate-400"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
            >
              <path d="M2 3l3 4 3-4H2z" />
            </svg>
          </div>

          <Divider />

          {/* Headings — applied as inline marks, works on any selection */}
          {(
            Object.entries(HEADING_STYLES) as [
              HeadingStyle,
              (typeof HEADING_STYLES)[HeadingStyle],
            ][]
          )
            // .filter(([key]) => key !== "normal")
            .map(([key, { label }]) => (
              <ToolbarButton
                key={key}
                onClick={() => applyHeadingStyle(key)}
                active={false}
                title={`Áp dụng style ${label} cho vùng chọn`}
                className="w-9 text-xs font-bold"
              >
                {label}
              </ToolbarButton>
            ))}

          <Divider />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => setAlign("left")}
            active={currentAlign === "left"}
            title="Căn trái"
          >
            <TextAlignStart />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setAlign("center")}
            active={currentAlign === "center"}
            title="Căn giữa"
          >
            <TextAlignCenter />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setAlign("right")}
            active={currentAlign === "right"}
            title="Căn phải"
          >
            <TextAlignEnd />
          </ToolbarButton>
        </div>

        {/* ── Editor area ── */}
        <div className="relative [&_.ProseMirror]:focus-visible:outline-none [&_.ProseMirror_img]:cursor-pointer [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:transition-all [&_.ProseMirror_img.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_img.ProseMirror-selectednode]:ring-indigo-500 [&_.ProseMirror_img.ProseMirror-selectednode]:ring-offset-2 [&_.ProseMirror_img.ProseMirror-selectednode]:shadow-lg [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-extrabold [&_.ProseMirror_h1]:text-slate-800 [&_.ProseMirror_h1]:mt-6 [&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:text-slate-800 [&_.ProseMirror_h2]:mt-5 [&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-slate-700 [&_.ProseMirror_h4]:text-lg [&_.ProseMirror_h4]:font-semibold [&_.ProseMirror_h4]:text-slate-700 [&_.ProseMirror_p]:text-slate-700 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p]:my-2">
          <EditorContent editor={editor} />

          {/* placeholder hint */}
          {editor.isEmpty && (
            <p className="absolute top-6 left-8 text-slate-300 text-base pointer-events-none select-none">
              Bắt đầu gõ hoặc dán nội dung vào đây…
            </p>
          )}
        </div>

        {/* ── Footer: char count ── */}
        <div className="border-t border-slate-100 px-5 py-2.5 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-slate-400">
            Paste ảnh trực tiếp vào editor · Nhấn vào ảnh để chọn
          </p>
          <div className="flex items-center gap-1.5">
            <div
              className={[
                "w-1.5 h-1.5 rounded-full",
                charCount > 0 ? "bg-emerald-400" : "bg-slate-300",
              ].join(" ")}
            />
            <span className="text-xs font-medium text-slate-500">
              <span
                className={charCount > 0 ? "text-indigo-600 font-semibold" : ""}
              >
                {charCount.toLocaleString()}
              </span>{" "}
              ký tự
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
