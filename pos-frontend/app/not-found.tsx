"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 p-4">
      <div className="bg-[#27AA83]/10 p-6 rounded-full">
        <Home className="w-12 h-12 text-[#27AA83]" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          The resource you are looking for might have been moved, deleted, or the URL might be incorrect.
        </p>
      </div>
      <Button
        onClick={handleGoHome}
        className="bg-[#27AA83] hover:bg-[#219a75] text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#27AA83]/20"
      >
        Return to Dashboard
      </Button>
    </div>
  );
}
