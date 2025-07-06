"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircleArrowDown, RocketIcon, FileText } from "lucide-react";
import { FileValidationConfig } from "./FileValidator";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  validationConfig: FileValidationConfig;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, validationConfig, disabled = false }: DropZoneProps) {
  const [dragCounter, setDragCounter] = useState(0);

  const onDragEnter = useCallback(() => {
    setDragCounter(prev => prev + 1);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragCounter(prev => prev - 1);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      onDragEnter,
      onDragLeave,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
      disabled,
    });

  const isDragOver = dragCounter > 0;
  const maxSizeMB = validationConfig.maxSize / (1024 * 1024);

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center text-center justify-center transition-all duration-200 ${
        isDragOver || isFocused || isDragAccept ? "bg-indigo-300 border-indigo-700 scale-105" : "bg-indigo-100"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-indigo-200"}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col justify-center items-center">
        {isDragActive ? (
          <>
            <RocketIcon className="h-20 w-20 animate-ping" />
            <p className="text-lg font-medium">Drop the file here...</p>
            <p className="text-sm text-indigo-500 mt-2">Only PDF files are supported</p>
          </>
        ) : (
          <>
            <div className="relative">
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <FileText className="h-8 w-8 absolute -bottom-2 -right-2 text-indigo-400" />
            </div>
            <p className="text-lg font-medium">Drag and drop a PDF file here</p>
            <p className="text-sm text-indigo-500 mt-2">or click to select a file</p>
            <p className="text-xs text-indigo-400 mt-1">Maximum file size: {maxSizeMB}MB</p>
            <div className="mt-4 p-2 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-600">Supported format: PDF only</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}