import { StyleMapEnumAudience } from "../../../../components/StyleMapEnum/StyleMapEnum";
import { AUDIENCES } from "../../../../features/posts/constants/post.constants";
import { usePostForm } from "../../../../features/posts/hooks/usePostForm";

const PostAudiencePicker = () => {
  const { values, errors, handleAudienceToggle } = usePostForm();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
        👥 Đối tượng *
      </label>

      {/* Chuyển sang Flex Wrap để tiết kiệm diện tích */}
      <div className="flex flex-wrap gap-3">
        {AUDIENCES.map((a) => {
          const config = StyleMapEnumAudience[a];
          const isSelected = values.audience.includes(a);

          return (
            <button
              key={a}
              type="button" // Tránh submit form nhầm
              onClick={() => handleAudienceToggle(a)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200
                ${
                  isSelected
                    ? `${config.bgColor} ${config.textColor}`
                    : "bg-white border-slate-300 text-slate-500 hover:border-slate-300"
                }
              `}
            >
              <span className="text-sm font-semibold">{config.label}</span>

              {/* Dấu tích nhỏ xinh khi chọn */}
              {isSelected && (
                <span className="ml-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {errors.audience && (
        <p className="text-red-500 text-xs mt-3 flex items-center gap-1 animate-pulse">
          ⚠️ {errors.audience}
        </p>
      )}
    </div>
  );
};

export default PostAudiencePicker;
