export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  layout?: "dropdown" | "mega";
  children?: MenuItem[];
}
