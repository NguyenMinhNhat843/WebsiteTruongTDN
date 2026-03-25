import { usePostForm } from "../hooks/usePostForm";
import Tag from "./Tag";

const PostTagInput = () => {
  const {
    values,
    handleRemoveTag,
    tagInput,
    handleTagInputChange,
    handleTagKeyDown,
  } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        🏷️ Từ khóa / Hashtag
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {values.tags.map((t) => (
          <Tag key={t} label={t} onRemove={() => handleRemoveTag(t)} />
        ))}
      </div>
      <input
        type="text"
        value={tagInput}
        onChange={handleTagInputChange}
        onKeyDown={handleTagKeyDown}
        placeholder="Nhập từ khóa rồi nhấn Enter... (tối đa 8)"
        disabled={values.tags.length >= 8}
        className="w-full text-sm text-slate-700 placeholder-slate-300 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all disabled:opacity-50"
      />
      <p className="text-xs text-slate-300 mt-2">
        Nhấn{" "}
        <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
          Enter
        </kbd>{" "}
        hoặc{" "}
        <kbd className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
          ,
        </kbd>{" "}
        để thêm từ khóa
      </p>
    </div>
  );
};

export default PostTagInput;
