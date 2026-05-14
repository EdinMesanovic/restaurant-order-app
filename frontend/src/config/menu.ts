import { LucideIcon, FolderKanban, LayoutDashboard } from "lucide-react";

type MenuItemType = {
  title: string;
  url: string;
  external?: string;
  icon?: LucideIcon;
  items?: MenuItemType[];
};
type MenuType = MenuItemType[];

export const mainMenu: MenuType = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pages",
    url: "/pages",
    icon: FolderKanban,
    items: [
      {
        title: "Sample Page",
        url: "/pages/sample",
      },
      {
        title: "Coming Soon",
        url: "/pages/feature",
      },
    ],
  },
];
