import type { CurriculumFramework, ModuleType } from "./chuongTrinhKhung.type";

export function calcBreakdown(fw: CurriculumFramework) {
  const r: Record<ModuleType, number> = {
    chung: 0,
    co_so: 0,
    chuyen_mon: 0,
    tu_chon: 0,
    thuc_hanh: 0,
    thuc_tap: 0,
  };
  fw.terms.forEach((t) =>
    t.modules.forEach((m) => {
      r[m.type] += m.units;
    }),
  );
  return r;
}

export function totalHours(fw: CurriculumFramework) {
  return fw.terms.reduce(
    (acc, t) => acc + t.modules.reduce((a, m) => a + m.theory + m.practice, 0),
    0,
  );
}
