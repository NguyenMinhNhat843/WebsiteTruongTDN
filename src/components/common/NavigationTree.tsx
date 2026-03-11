import { navData } from "./navData";
import type { MenuItem } from "./types";

type Props = {
  data?: MenuItem[];
  className?: string;
};

const MegaMenu = ({ item }: { item: MenuItem }) => (
  <div className="flex flex-row items-start gap-12">
    {item.children?.map((child) => (
      <div key={child.id} className="flex-1">
        <h3 className="font-bold text-blue-900 mb-4 border-b pb-2 uppercase text-[13px] whitespace-nowrap">
          {child.label}
        </h3>
        <ul className="space-y-3">
          {child.children?.map((gc) => (
            <li key={gc.id}>
              <a
                href={gc.href}
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors block leading-relaxed"
              >
                {gc.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const DropdownMenu = ({ item }: { item: MenuItem }) => (
  <div className="flex flex-col space-y-1">
    {item.children?.map((child) => (
      <a
        key={child.id}
        href={child.href}
        className="block px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 rounded-md transition-all whitespace-nowrap"
      >
        {child.label}
      </a>
    ))}
  </div>
);

const SubGrid = ({ item }: { item: MenuItem }) => (
  <div className="absolute left-0 top-full bg-white text-gray-800 shadow-2xl rounded-b-lg border-t-2 border-blue-600 p-4 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 w-max">
    {item.layout === "mega" ? (
      <MegaMenu item={item} />
    ) : (
      <DropdownMenu item={item} />
    )}
  </div>
);

// --- Main component ---

const NavigationTree = ({ data = navData, className = "" }: Props) => (
  <nav className={`w-full ${className}`} aria-label="Main navigation">
    <ul className="flex justify-between items-center px-4 py-2">
      {data.map((item) => (
        <li key={item.id} className="relative group">
          <a
            href={item.href ?? "#"}
            className="text-sm md:text-base text-white px-2 py-2 inline-block hover:opacity-75 transition-opacity duration-300"
          >
            {item.label}
          </a>

          {item.children && item.children.length > 0 && <SubGrid item={item} />}
        </li>
      ))}
    </ul>
  </nav>
);

export default NavigationTree;
