import { AUDIENCE_META } from "../constants/postList.constant";
import type { AudienceValue } from "../types/Post.types";

function AudiencePill({ audience }: { audience?: AudienceValue }) {
  const m = audience
    ? AUDIENCE_META[audience]
    : {
        label: "Không xác định",
        icon: "❓",
        color: "text-gray-500",
      };
  return (
    <span className={`text-xs font-medium ${m.color}`}>
      {m.icon} {m.label}
    </span>
  );
}

export default AudiencePill;
