"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { v4 as uuidV4 } from "uuid";
export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings. This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const { user } = useUser();

  const router = useRouter;

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    // TODO: FREE/Pro Plan

    setStatus(StatusText.UPLOADING);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const { field_id } = await response.json();
      setFieldId(field_id);
      setStatus(StatusText.UPLOADED);

      // Generate AI embeddings
      setStatus(StatusText.GENERATING);
      await generateEmbeddings(field_id);

      setStatus(null);
    } catch (error) {
      setStatus(StatusText.UPLOADING);
      console.error("Error uploading file:", error);
    }
  };
}
export { progress, status, fieldId, handleUpload };
