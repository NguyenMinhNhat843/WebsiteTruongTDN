import { AUDIENCES } from "../constants/post.constants";
import { usePostForm } from "../hooks/usePostForm";

const PostAudiencePicker = () => {
  const { values, errors, handleAudienceToggle } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        👥 Đối tượng *
      </label>
      <div className="flex flex-col gap-2">
        {AUDIENCES.map((a) => (
          <label
            key={a}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div
              onClick={() => handleAudienceToggle(a)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                values.audience.includes(a)
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-300 group-hover:border-indigo-300"
              }`}
            >
              {values.audience.includes(a) && (
                <span className="text-xs">✓</span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${values.audience.includes(a) ? "text-indigo-700" : "text-slate-600"}`}
            >
              {a}
            </span>
          </label>
        ))}
      </div>
      {errors.audience && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          ⚠️ {errors.audience}
        </p>
      )}
    </div>
  );
};

export default PostAudiencePicker;
