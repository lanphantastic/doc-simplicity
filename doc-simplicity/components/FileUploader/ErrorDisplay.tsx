"use client";

import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      <div className="p-6 border-2 border-red-300 bg-red-50 rounded-lg w-[90%] text-center">
        <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Upload Failed</h3>
        <p className="text-red-700 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}