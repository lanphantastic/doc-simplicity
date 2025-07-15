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
  const router = useRouter();

  // --- Observer Callbacks ---
  const handleStateChanged = (snapshot: any) => {
    const percent = calculatePercent(snapshot);
    setStatus(StatusText.UPLOADING);
    setProgress(percent);
  };

  const handleError = (
    error: any,
    unsubscribe: () => void,
    reject: (reason?: any) => void
  ) => {
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
    unsubscribe();
    reject(errorMessage);
  };

  const handleSuccess = async (
    uploadTask: any,
    file: File,
    user: any,
    fileIdToUploadTo: string,
    unsubscribe: () => void,
    resolve: (value: string) => void,
    reject: (reason?: any) => void
  ) => {
    setStatus(StatusText.UPLOADED);
    try {
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
      await generateEmbeddings(fileIdToUploadTo);
      setFileId(fileIdToUploadTo);
      resolve(fileIdToUploadTo);
    } catch (err) {
      setError("File uploaded but failed to process. Please try again.");
      setProgress(null);
      setStatus(null);
      reject("File uploaded but failed to process. Please try again.");
    } finally {
      unsubscribe();
    }
  };

  const handleUpload = async (file: File): Promise<string> => {
    if (!file || !user) {
      setError("No file selected or user not authenticated");
      return Promise.reject("No file selected or user not authenticated");
    }

    // Reset state
    setError(null);
    setProgress(null);
    setStatus(null);
    setFileId(null);

    // TODO: FREE/Pro Plan

    const fileIdToUploadTo = uuidv4();
    const storageRef = ref(
      storage,
      `users/${user.id}/files/${fileIdToUploadTo}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      const unsubscribe = uploadTask.on(
        "state_changed",
        (snapshot) => handleStateChanged(snapshot),
        (error) => handleError(error, unsubscribe, reject),
        () =>
          handleSuccess(
            uploadTask,
            file,
            user,
            fileIdToUploadTo,
            unsubscribe,
            resolve,
            reject
          )
      );
    });
  };

  return { progress, status, fileId, handleUpload, error };
}

export default useUpload;
