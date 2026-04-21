import type { NavItem } from "./navTree.type";

interface NavNodeProps {
  item: NavItem;
  depth: number;
  activeId: string | null;
  openIds: Set<string>;
  collapsed: boolean;
  onToggle: (id: string) => void;
  onActivate: (item: NavItem) => void;
}

function NavNode({
  item,
  depth,
  activeId,
  openIds,
  collapsed,
  onToggle,
  onActivate,
}: NavNodeProps) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isOpen = openIds.has(item.id);
  const isActive = activeId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      onToggle(item.id);
    } else {
      onActivate(item);
    }
  };

  const paddingLeft = collapsed
    ? "pl-3"
    : depth === 0
      ? "pl-3"
      : `pl-${3 + depth * 4}`;

  return (
    <li>
      <button
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        className={[
          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          collapsed ? "justify-center px-2" : "",
          isActive
            ? "bg-indigo-600 text-white"
            : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100",
          paddingLeft,
        ].join(" ")}
      >
        {/* Icon Wrapper */}
        {item.icon && (
          <span
            className={[
              "flex shrink-0 items-center justify-center transition-all duration-300",
              collapsed ? "h-12 w-12 text-4xl" : "h-8 w-8 text-lg",
              isActive ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400",
            ].join(" ")}
          >
            {item.icon}
          </span>
        )}

        {/* Label */}
        {!collapsed && (
          <span className="flex-1 truncate text-left">{item.label}</span>
        )}

        {/* Badge */}
        {!collapsed && item.badge !== undefined && (
          <span
            className={[
              "ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
              isActive
                ? "bg-white/20 text-white"
                : "bg-indigo-500/20 text-indigo-400",
            ].join(" ")}
          >
            {item.badge}
          </span>
        )}

        {/* Chevron */}
        {!collapsed && hasChildren && (
          <span
            className={[
              "shrink-0 text-xs transition-transform duration-300",
              isOpen ? "rotate-90" : "",
              isActive ? "text-white/70" : "text-slate-500",
            ].join(" ")}
          >
            ▶
          </span>
        )}
      </button>

      {/* Children */}
      {hasChildren && isOpen && !collapsed && (
        <ul
          className={[
            "mt-0.5 space-y-0.5 overflow-hidden border-l border-slate-700/50 ml-5",
            "animate-in slide-in-from-top-2 duration-200",
          ].join(" ")}
        >
          {item.children!.map((child) => (
            <NavNode
              key={child.id}
              item={child}
              depth={depth + 1}
              activeId={activeId}
              openIds={openIds}
              collapsed={collapsed}
              onToggle={onToggle}
              onActivate={onActivate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default NavNode;
