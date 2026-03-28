import { useState, useCallback, useMemo } from "react";
import NavNode from "./NavNode";
import type { NavItem } from "./navItem";
import { useLocation, useNavigate } from "react-router-dom";

export interface SidebarProps {
  items: NavItem[];
  defaultOpenIds?: string[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

// 1. Hàm helper để tìm activeId và tất cả các parentIds của nó
const findActiveAndParents = (
  nodes: NavItem[],
  targetPath: string,
  parents: string[] = [],
): { activeId: string | null; parentIds: string[] } => {
  for (const node of nodes) {
    // Nếu tìm thấy node khớp với URL
    if (node.href === targetPath) {
      return { activeId: node.id, parentIds: parents };
    }
    // Nếu có con, tìm tiếp trong con
    if (node.children) {
      const result = findActiveAndParents(node.children, targetPath, [
        ...parents,
        node.id,
      ]);
      if (result.activeId) return result;
    }
  }
  return { activeId: null, parentIds: [] };
};

export default function Sidebar({
  items,
  defaultOpenIds = [],
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Tính toán active và parents ngay khi render
  const { activeId, autoParentIds } = useMemo(() => {
    const { activeId, parentIds } = findActiveAndParents(
      items,
      location.pathname,
    );
    return { activeId, autoParentIds: parentIds };
  }, [location.pathname, items]);

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [userOpenIds, setUserOpenIds] = useState<Set<string>>(
    new Set(defaultOpenIds),
  );

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  // Kết hợp: Những cái user click + Những cái là cha của menu đang active
  const openIds = useMemo(() => {
    const combined = new Set(userOpenIds);
    autoParentIds.forEach((id) => combined.add(id));
    return combined;
  }, [userOpenIds, autoParentIds]);

  const toggleCollapsed = () => {
    setInternalCollapsed(!isCollapsed);
    onCollapsedChange?.(!isCollapsed);
  };

  const handleToggle = useCallback((id: string) => {
    setUserOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleActivate = useCallback(
    (item: NavItem) => {
      if (item.href) {
        navigate(item.href);
      }
    },
    [navigate],
  );

  return (
    <aside
      className={[
        "relative flex h-screen flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-24" : "w-64",
        "border-r border-slate-700/50",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(180deg, #0f172a 0%, #0c1222 60%, #080d1a 100%)",
      }}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 32px)",
        }}
      />

      {/* Header */}
      <div
        className={[
          "relative flex items-center border-b border-slate-700/50 px-4 py-6 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "gap-3",
        ].join(" ")}
      >
        {/* Logo / Icon */}
        <div className="h-14 w-14 rounded-full">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-full w-full object-cover rounded-full"
          />
        </div>

        {/* Text Content */}
        {!isCollapsed && (
          <div className="flex flex-col leading-tight overflow-hidden ml-1">
            <span className="truncate text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400">
              Hệ thống quản trị
            </span>
            <span className="truncate text-sm font-light text-white mt-1.5 tracking-tight">
              Trường Trung Cấp
            </span>
            <span className="truncate text-xl font-black text-indigo-300 -mt-0.5 tracking-tighter shadow-indigo-500/10 [text-shadow:0_1px_4px_var(--tw-shadow-color)]">
              Trần Đại Nghĩa
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="relative flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        <ul className="space-y-0.5">
          {items.map((item) => (
            <NavNode
              key={item.id}
              item={item}
              depth={0}
              activeId={activeId}
              openIds={openIds}
              collapsed={isCollapsed}
              onToggle={handleToggle}
              onActivate={handleActivate}
            />
          ))}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="relative border-t border-slate-700/50 p-2">
        <button
          onClick={toggleCollapsed}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <span
            className={[
              "text-sm transition-transform duration-300",
              isCollapsed ? "rotate-180" : "",
            ].join(" ")}
          >
            ◀◀
          </span>
          {!isCollapsed && <span className="text-xs font-medium">Thu gọn</span>}
        </button>
      </div>
    </aside>
  );
}
