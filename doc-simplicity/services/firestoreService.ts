import { adminDb } from "@/firebaseAdmin";

export class FirestoreService {
  async getDownloadUrl(userId: string, docId: string) {
    const firebaseRef = await adminDb
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(docId)
      .get();

    const downloadUrl = firebaseRef.data()?.downloadUrl;
    if (!downloadUrl) {
      throw new Error("Download URL not found in Firestore");
    }
    return downloadUrl;
  }
}
