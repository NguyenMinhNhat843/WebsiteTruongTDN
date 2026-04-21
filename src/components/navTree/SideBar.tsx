import { useState, useCallback, useMemo } from "react";
import NavNode from "./NavNode";
import { useLocation, useNavigate } from "react-router-dom";
import type { NavItem } from "./navTree.type";

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
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  const userRole = user?.role || null;

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
        "bg-[#0f172a] text-slate-300",
        isCollapsed ? "w-20" : "w-72",
        "border-r border-blue-500/10 shadow-xl",
      ].join(" ")}
    >
      {/* Header - Nhấn mạnh màu xanh thương hiệu */}
      <div
        className={[
          "relative flex items-center border-b border-blue-500/10 px-4 py-8 transition-all duration-300",
          "bg-linear-to-b from-blue-600/10 to-transparent",
          isCollapsed ? "justify-center px-2" : "gap-4",
        ].join(" ")}
      >
        {/* Logo Container - Thêm hiệu ứng vòng sáng */}
        <div className="relative h-12 w-12 shrink-0 rounded-xl bg-blue-600 p-0.5 shadow-lg shadow-blue-500/20">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-full w-full object-cover rounded-[10px] bg-white"
          />
        </div>

        {/* Text Content */}
        {!isCollapsed && (
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              Hệ thống quản trị
            </span>
            <span className="truncate text-[13px] font-medium text-slate-400 mt-1">
              Trường Trung Cấp
            </span>
            <span className="truncate text-lg font-black text-white -mt-1 tracking-tight">
              Trần Đại Nghĩa
            </span>
          </div>
        )}
      </div>

      {/* Nav - Tối ưu thanh cuộn */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-6 custom-scrollbar">
        <ul className="space-y-1.5">
          {items.map((item) => {
            const rolesAccessed = item.roles;

            // Nếu item có quy định roles VÀ role của user không nằm trong danh sách đó thì ẩn đi
            if (
              rolesAccessed &&
              rolesAccessed.length > 0 &&
              (!userRole || !rolesAccessed.includes(userRole))
            ) {
              return null;
            }

            return (
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
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle - Làm cho nút này tinh tế hơn */}
      <div className="relative border-t border-blue-500/10 p-3 bg-slate-900/50">
        <button
          onClick={toggleCollapsed}
          className="flex w-full items-center justify-center gap-3 rounded-xl py-3 text-slate-400 transition-all hover:bg-blue-600/10 hover:text-blue-400 group"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <div
            className={[
              "flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 transition-transform duration-500 group-hover:bg-blue-600/20",
              isCollapsed ? "rotate-180" : "",
            ].join(" ")}
          >
            <span className="text-[10px]">◀</span>
          </div>
          {!isCollapsed && (
            <span className="text-xs font-semibold tracking-wide">
              Thu gọn menu
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
