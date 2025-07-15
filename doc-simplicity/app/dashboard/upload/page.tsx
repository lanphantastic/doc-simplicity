"use client";

import FileUploader from "@/components/FileUploader";

function UploadPage() {
  const handleUploadSuccess = (fileId: string) => {
    // Could show a success toast or redirect
    console.log("File uploaded successfully:", fileId);
  };

  const handleUploadError = (error: string) => {
    // Could show an error toast
    console.error("Upload failed:", error);
  };

  return (
    <FileUploader
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
    />
  );
}
export default UploadPage;
