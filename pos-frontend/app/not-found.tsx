"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center">The page you are looking for does not exist.</p>
      <button
        onClick={handleGoHome}
        className="px-4 py-2 bg-[#27AA83] text-white rounded cursor-pointer transition-all duration-300 hover:bg-[#27AA83]/80"
      >
        Go Home
      </button>
    </div>
  );
}