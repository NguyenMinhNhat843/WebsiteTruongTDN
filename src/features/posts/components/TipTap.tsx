import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Plugin, PluginKey } from "prosemirror-state";

// ─── Paste-image extension ────────────────────────────────────────────────────
const PasteImage = Extension.create({
  name: "pasteImage",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("pasteImage"),
        props: {
          handlePaste: (view, event) => {
            const items = Array.from(event.clipboardData?.items ?? []);
            const imageItem = items.find((i) => i.type.startsWith("image/"));
            if (!imageItem) return false;

            event.preventDefault();
            const file = imageItem.getAsFile();
            if (!file) return false;

            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (src) {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              }
            };
            reader.readAsDataURL(file);
            return true;
          },
        },
      }),
    ];
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
type BtnProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

// ─── Toolbar button ───────────────────────────────────────────────────────────
const Btn = ({ onClick, active, disabled, title, children }: BtnProps) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center w-8 h-8 rounded-md text-sm
      font-semibold transition-all select-none
      disabled:opacity-30 disabled:cursor-not-allowed
      ${
        active
          ? "bg-blue-600 text-white shadow-inner"
          : "text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
      }
    `}
  >
    {children}
  </button>
);

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;

// ─── SVG icons (tiny, inline) ─────────────────────────────────────────────────
const IB = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);
const II = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);
const IU = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M6 3v7a6 6 0 0 0 12 0V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);
const IS = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 20H7a3 3 0 0 1-2.83-4" />
    <line x1="4" y1="12" x2="20" y2="12" />
  </svg>
);
const ICode = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IUL = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="9" y1="6" x2="20" y2="6" />
    <line x1="9" y1="12" x2="20" y2="12" />
    <line x1="9" y1="18" x2="20" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" />
  </svg>
);
const IOL = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="10" y1="6" x2="21" y2="6" />
    <line x1="10" y1="12" x2="21" y2="12" />
    <line x1="10" y1="18" x2="21" y2="18" />
    <text
      x="2"
      y="8"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      1.
    </text>
    <text
      x="2"
      y="14"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      2.
    </text>
    <text
      x="2"
      y="20"
      fontSize="7"
      fill="currentColor"
      stroke="none"
      fontWeight="bold"
    >
      3.
    </text>
  </svg>
);
const IQuote = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);
const IAlignL = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="15" y2="12" />
    <line x1="3" y1="18" x2="18" y2="18" />
  </svg>
);
const IAlignC = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);
const IAlignR = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="6" y1="18" x2="21" y2="18" />
  </svg>
);
const IUndo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9 14 4 9 9 4" />
    <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
  </svg>
);
const IRedo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 14 20 9 15 4" />
    <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
  </svg>
);
const IImg = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const ITable = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

// ─── Main component ───────────────────────────────────────────────────────────
const SchoolEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      //   TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-lg border border-slate-200 shadow-sm max-w-full h-auto my-4",
        },
      }),
      PasteImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: `
      <h2>Thông báo mới từ trường Trần Đại Nghĩa</h2>
      <p>Nội dung bài viết sẽ hiển thị tại đây. Bạn có thể <strong>in đậm</strong>, <em>in nghiêng</em>, <u>gạch chân</u> hoặc chèn ảnh bằng cách <strong>dán (Ctrl+V)</strong> trực tiếp.</p>
    `,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[320px] p-6",
      },
    },
  });

  if (!editor) return null;

  const insertImageFromUrl = () => {
    const url = window.prompt("Nhập link ảnh (URL):");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5">
        {/* History */}
        <Btn
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <IUndo />
        </Btn>
        <Btn
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <IRedo />
        </Btn>

        <Divider />

        {/* Headings */}
        <Btn
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <span className="text-xs font-bold">H1</span>
        </Btn>
        <Btn
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <span className="text-xs font-bold">H2</span>
        </Btn>
        <Btn
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <span className="text-xs font-bold">H3</span>
        </Btn>

        <Divider />

        {/* Inline formatting */}
        <Btn
          title="In đậm (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <IB />
        </Btn>
        <Btn
          title="In nghiêng (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <II />
        </Btn>
        <Btn
          title="Gạch chân (Ctrl+U)"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <IU />
        </Btn>
        <Btn
          title="Gạch ngang"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <IS />
        </Btn>
        <Btn
          title="Code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <ICode />
        </Btn>

        <Divider />

        {/* Lists */}
        <Btn
          title="Danh sách chấm"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <IUL />
        </Btn>
        <Btn
          title="Danh sách số"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <IOL />
        </Btn>
        <Btn
          title="Trích dẫn"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <IQuote />
        </Btn>

        <Divider />

        {/* Alignment */}
        {/* <Btn
          title="Căn trái"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <IAlignL />
        </Btn>
        <Btn
          title="Căn giữa"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <IAlignC />
        </Btn>
        <Btn
          title="Căn phải"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <IAlignR />
        </Btn> */}

        <Divider />

        {/* Insert */}
        <Btn
          title="Chèn bảng"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <ITable />
        </Btn>
        <Btn title="Chèn ảnh qua URL" onClick={insertImageFromUrl}>
          <IImg />
        </Btn>
      </div>

      {/* ── Paste-image hint ── */}
      <div className="flex items-center gap-1.5 bg-blue-50 px-4 py-1.5 border-b border-blue-100 text-[11px] text-blue-500">
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Bạn có thể <strong className="font-semibold">dán ảnh (Ctrl+V)</strong>{" "}
        trực tiếp vào vùng soạn thảo bên dưới
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} />

      {/* ── Footer ── */}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-1.5 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest">
          Trình soạn thảo nội bộ
        </span>
        <span className="text-[11px] text-slate-400">{wordCount} từ</span>
      </div>
    </div>
  );
};

const ToolbarButton = ({ onClick, active, label }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
      active
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
    }`}
  >
    {label}
  </button>
);

export default SchoolEditor;
