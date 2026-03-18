"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Check if current route is signin page
  const isSignInPage = pathname === "/signin";

  // If signin page, render without layout
  if (isSignInPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className="flex flex-col transition-all duration-300 h-screen overflow-hidden flex-1"
        style={{
          marginLeft: sidebarCollapsed ? "5%" : "18%",
        }}
      >
        <Navbar onMenuClick={toggleSidebar} collapsed={sidebarCollapsed} />

        <main className="flex-1 p-6 overflow-auto pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;