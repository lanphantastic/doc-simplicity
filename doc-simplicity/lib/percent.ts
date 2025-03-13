import { UploadTaskSnapshot } from "firebase/storage";

export const calculatePercent = (snapshot: UploadTaskSnapshot) =>
  Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
