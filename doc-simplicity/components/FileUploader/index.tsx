"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useUpload from "@/hooks/useUpload";
import {
  FileValidator,
  defaultPdfConfig,
  FileValidationResult,
} from "./FileValidator";
import { UploadProgress } from "./UploadProgress";
import { ErrorDisplay } from "./ErrorDisplay";
import { DropZone } from "./DropZone";
import { StatusText } from "@/types/status";

interface FileUploaderProps {
  validationConfig?: typeof defaultPdfConfig;
  onUploadSuccess?: (fileId: string) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUploader({
  validationConfig = defaultPdfConfig,
  onUploadSuccess,
  onUploadError,
}: FileUploaderProps) {
  const { progress, status, fileId, handleUpload, error } = useUpload();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileValidator = useMemo(
    () => new FileValidator(validationConfig),
    [validationConfig]
  );

  useEffect(() => {
    if (fileId) {
      onUploadSuccess?.(fileId);
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router, onUploadSuccess]);

  useEffect(() => {
    if (error) {
      onUploadError?.(error);
    }
  }, [error, onUploadError]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file
      const validationResult: FileValidationResult =
        fileValidator.validate(file);

      if (!validationResult.isValid) {
        setValidationError(validationResult.error || "Invalid file");
        return;
      }

      setValidationError(null);
      setIsProcessing(true);

      try {
        await handleUpload(file);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [fileValidator, handleUpload]
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  const currentError = validationError || error;

  // Show error state
  if (currentError) {
    return <ErrorDisplay error={currentError} onRetry={handleRetry} />;
  }

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <UploadProgress
          progress={progress}
          status={status as StatusText}
          isComplete={progress === 100}
        />
      )}
      {!uploadInProgress && (
        <DropZone
          onFileSelect={handleFileSelect}
          validationConfig={validationConfig}
          disabled={isProcessing}
        />
      )}
    </div>
  );
}
