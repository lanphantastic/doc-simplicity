"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase";
import { calculatePercent } from "@/lib/percent";
import { Status, StatusText } from "@/types/status";
import { useUser } from "@clerk/nextjs";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

function useUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  const router = useRouter;

  const handleUpload = async (file: File) => {
    if (!file || !user) {
      setError("No file selected or user not authenticated");
      return;
    }

    // Reset error state
    setError(null);

    // TODO: FREE/Pro Plan

    const fileIdToUploadTo = uuidv4();

    const storageRef = ref(
      storage,
      `users/${user.id}/files/${fileIdToUploadTo}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const percent = calculatePercent(snapshot);
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file", error);
        let errorMessage = "An error occurred during upload";

        switch (error.code) {
          case "storage/unauthorized":
            errorMessage = "You don't have permission to upload files";
            break;
          case "storage/canceled":
            errorMessage = "Upload was canceled";
            break;
          case "storage/unknown":
            errorMessage = "Unknown error occurred during upload";
            break;
          default:
            errorMessage = error.message || "Upload failed";
        }

        setError(errorMessage);
        setProgress(null);
        setStatus(null);
      },
      async () => {
        setStatus(StatusText.UPLOADED);

        try {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          setStatus(StatusText.SAVING);
          await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl: downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: serverTimestamp(),
          });

          setStatus(StatusText.GENERATING);
          // Generate AI embeddings using the fileIdToUploadTo
          await generateEmbeddings(fileIdToUploadTo);
          setFileId(fileIdToUploadTo);
        } catch (err) {
          console.error("Error in post-upload processing:", err);
          setError("File uploaded but failed to process. Please try again.");
          setProgress(null);
          setStatus(null);
        }
      }
    );
  };

  return { progress, status, fileId, handleUpload, error };
}

export default useUpload;
