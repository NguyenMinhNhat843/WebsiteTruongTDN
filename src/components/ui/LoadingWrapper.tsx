import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading,
  children,
  message,
}) => {
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div
          className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-2 animate-fade-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />

          {message && (
            <span className="text-sm font-medium text-slate-600 animate-pulse">
              {message}
            </span>
          )}
        </div>
      )}

      <div
        className={`transition-all duration-200 ${
          isLoading ? "select-none opacity-50 pointer-events-none" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};
