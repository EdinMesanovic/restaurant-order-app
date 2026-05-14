import { Outlet, useLocation } from "react-router";
import { AppHeader } from "./app-header";
import { AppFooter } from "./app-footer";
import { themeConfig } from "@/config/theme";

export function AppLayout() {
  const location = useLocation();
  const isPosDashboard =
    location.pathname === "/dashboard" || location.pathname === "/pos";

  return (
    <div className="box-border flex h-dvh w-full flex-col overflow-hidden ~bg-muted/50">
      <AppHeader />
      <div
        className={`w-full ${
          isPosDashboard
            ? "box-border max-w-none flex-1 overflow-hidden p-2"
            : `${themeConfig.containerWidth} mx-auto ${themeConfig.pagePadding}`
        } flex min-h-0 flex-grow flex-col`}
      >
        <div className="flex min-h-0 flex-grow flex-col">
          <Outlet />
        </div>
        {!isPosDashboard ? <AppFooter /> : null}
      </div>
    </div>
  );
}
