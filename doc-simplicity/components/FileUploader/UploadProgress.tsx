"use client";

import { JSX } from "react";
import { StatusText } from "@/types/status";
import {
  CircleArrowDown,
  HammerIcon,
  SaveIcon,
  RocketIcon,
  CheckCircle,
} from "lucide-react";

interface UploadProgressProps {
  progress: number;
  status: StatusText;
  isComplete?: boolean;
}

const statusIcons: {
  [key in StatusText]: JSX.Element;
} = {
  [StatusText.UPLOADED]: (
    <CheckCircle className="h-20 w-20 text-green-600" />
  ),
  [StatusText.UPLOADING]: (
    <RocketIcon className="h-20 w-20 text-indigo-600" />
  ),
  [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
  [StatusText.GENERATING]: (
    <HammerIcon className="h-20 w-20 text-indigo-600 animate-bounce" />
  ),
};

export function UploadProgress({ progress, status, isComplete = false }: UploadProgressProps) {
  return (
    <div className="text-center">
      <div
        className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
          progress === 100 && "hidden"
        }`}
        role="progressbar"
        style={{
          // @ts-ignore
          "--value": progress,
          "--size": "12rem",
          "--thickness": "1.3rem",
        }}
      />
      <div className="mt-4">
        <p className="text-lg font-semibold text-indigo-600">{progress}%</p>
        {statusIcons[status]}
        <p className="text-indigo-600 animate-pulse mt-2">{status}</p>
        {isComplete && (
          <p className="text-sm text-indigo-500 mt-2">Redirecting to your file...</p>
        )}
      </div>
    </div>
  );
}