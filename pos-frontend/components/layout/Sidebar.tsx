"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers, FaMoneyBillWave, FaUserCog, FaCog } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FiBox, FiTruck } from "react-icons/fi";
import { IoCartOutline, IoHomeOutline, IoLogOutOutline } from "react-icons/io5";
import { LiaCommentDollarSolid } from "react-icons/lia";
import { useLanguage } from "../../lib/context/LanguageContext";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    { name: t.common.dashboard, href: "/", icon: MdOutlineDashboard },
    { name: t.common.products, href: "/products", icon: FiBox },
    { name: t.common.customer, href: "/customers", icon: FaUsers },
    { name: t.common.orders, href: "/orders", icon: IoCartOutline },
    { name: t.common.suppliers, href: "/suppliers", icon: FiTruck },
    { name: t.common.invoice, href: "/invoices", icon: LiaCommentDollarSolid },
    { name: t.common.expense, href: "/expenses", icon: FaMoneyBillWave },
    { name: t.common.employee, href: "/employees", icon: FaUserCog },
    { name: t.common.settings, href: "/settings", icon: FaCog },
  ];

  return (
    <aside
      className={`bg-[#020b1a] dark:bg-[#020b1a] h-screen fixed top-0 left-0 transition-all duration-300 overflow-y-auto`}
      style={{ width: collapsed ? "5%" : "18%" }}
    >
      <div className="flex flex-col h-full overflow-hidden">

        {/* Logo */}
        <div
          className={`flex items-center gap-2 h-16 px-4 transition-all duration-300 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="bg-[#27AA83] text-white p-2 rounded-lg flex items-center justify-center">
            <IoHomeOutline className="text-xl" />
          </div>
          {!collapsed && <h1 className="text-md font-bold text-white">RetailPOS</h1>}
        </div>

        <div className="border-b border-zinc-700 dark:border-zinc-300"></div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name} className="relative group overflow-visible">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 p-2 rounded-md text-[#C5CAD3] text-[13px] cursor-pointer transition-colors duration-200
                    ${isActive ? "bg-[#27AA83] text-white" : "hover:bg-[#1a253a]"}`}
                  >
                    <Icon className="text-lg" />
                    {!collapsed && item.name}
                  </Link>

                  {/* Tooltip above icon for collapsed sidebar */}
                  {collapsed && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                      {item.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-zinc-700 dark:border-zinc-300"></div>

        {/* Logout */}
        <div className={`flex items-center gap-3 h-16 px-4 transition-all duration-300 ${collapsed ? "justify-center" : ""} relative group`}>
          <div className="bg-[#1a253a] text-white p-2 rounded-lg flex items-center justify-center cursor-pointer">
            <IoLogOutOutline className="text-xl" />
          </div>
          {!collapsed && (
            <h1 className="text-md font-medium text-[15px] cursor-pointer text-[#C5CAD3]">
              {t.common.logout}
            </h1>
          )}
          {collapsed && (
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              {t.common.logout}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;