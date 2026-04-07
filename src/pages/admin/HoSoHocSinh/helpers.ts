export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function getAvatar(name: string): string {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]?.[0]?.toUpperCase() ?? "?";
}

export const AVATAR_COLORS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-teal-400 to-teal-600",
  "from-amber-400 to-amber-500",
  "from-rose-400 to-rose-600",
  "from-slate-400 to-slate-600",
];

export function avatarColor(id: string): string {
  const n = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[n] ?? AVATAR_COLORS[0];
}
