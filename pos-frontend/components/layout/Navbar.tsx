"use client";
import { useState, useEffect } from "react";
import { FiMenu, FiSun, FiMoon, FiGlobe } from "react-icons/fi";
import { useLanguage } from "../../lib/context/LanguageContext";

interface NavbarProps {
  onMenuClick?: () => void;
  collapsed?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, collapsed = false }) => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const { language, setLanguage, t } = useLanguage();

  // Dark mode setup
  useEffect(() => {
    const stored = localStorage.getItem("darkMode") === "true";
    setDarkMode(stored);
    if (stored) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (darkMode === null) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <header
      className={`bg-zinc-50 dark:bg-black h-16 fixed top-0 z-10 shadow transition-all duration-300`}
      style={{
        left: collapsed ? "5%" : "18%",
        right: 0,
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          <button
            onClick={onMenuClick ? onMenuClick : undefined}
            className="text-xl hover:bg-[#27AA83] p-2 rounded-lg cursor-pointer"
          >
            <FiMenu />
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          {/* Language Dropdown */}
          <div className="relative flex items-center gap-2">
            <FiGlobe className="text-zinc-600 dark:text-zinc-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "german")}
              className="bg-transparent border-none outline-none text-sm font-medium cursor-pointer text-zinc-700 dark:text-zinc-300"
            >
              <option value="en" className="bg-white dark:bg-zinc-900">
                {t.common.english}
              </option>
              <option value="german" className="bg-white dark:bg-zinc-900">
                {t.common.german}
              </option>
            </select>
          </div>

          <button
            onClick={toggleDarkMode}
            className="text-xl p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-300">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;