import { POST_CATEGORIES, useCreatePostContext } from "../CreatePostProvider";

const PostCategoryPicker = () => {
  const { watch, setValue, errors } = useCreatePostContext();

  const currentType = watch("type");

  const handleCategoryChange = (
    value: (typeof POST_CATEGORIES)[number]["value"],
  ) => {
    setValue("type", value, { shouldValidate: true });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-green-500 uppercase tracking-widest mb-4">
        📂 Danh mục *
      </label>
      <div className="grid grid-cols-2 gap-2">
        {POST_CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => handleCategoryChange(c.value)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border-2 text-left cursor-pointer flex items-center gap-2 ${
              currentType === c.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                : "border-slate-100 hover:border-slate-200 text-slate-600"
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {errors.type && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          ⚠️ {errors.type.message}
        </p>
      )}
    </div>
  );
};

export default PostCategoryPicker;
