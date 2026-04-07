// ─── Helpers ──────────────────────────────────────────────────────────────────

import { TRANG_THAI_OPTIONS, type TrangThai } from "../type";

/** CC(10%) + TK(10%) + GK(20%) + CK(50%) — quy về thang 10 */
export function tinhTongKet(
  chuyenCan: number | string,
  thuongKy: number | string,
  gk: number | string,
  ck: number | string,
): string {
  const cc = parseFloat(String(chuyenCan)) || 0;
  const tk = parseFloat(String(thuongKy)) || 0;
  const g = parseFloat(String(gk)) || 0;
  const c = parseFloat(String(ck)) || 0;
  return ((cc * 0.1 + tk * 0.1 + g * 0.2 + c * 0.5) * (10 / 6)).toFixed(1);
}

export function isTrangThai(value: string): value is TrangThai {
  return (TRANG_THAI_OPTIONS as readonly string[]).includes(value);
}

export function clampScore(raw: string): number {
  const n = parseFloat(raw);
  if (isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}
