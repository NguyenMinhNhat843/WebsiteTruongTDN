import { CATEGORIES } from "../constants/post.constants";
import { usePostForm } from "../hooks/usePostForm";

const PostCategoryPicker = () => {
  const { values, errors, handleCategoryChange } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-green-500 uppercase tracking-widest mb-4">
        📂 Danh mục *
      </label>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => handleCategoryChange(c.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 text-left cursor-pointer ${
              values.category === c.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                : "border-slate-100 hover:border-slate-200 text-slate-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {errors.category && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          ⚠️ {errors.category}
        </p>
      )}
    </div>
  );
};

export default PostCategoryPicker;
