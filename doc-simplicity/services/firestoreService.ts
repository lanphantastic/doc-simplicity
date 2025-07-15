import { adminDb, adminStorage } from "@/firebaseAdmin";

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

  async getSignedDownloadUrl(userId: string, docId: string) {
    const fileRef = await adminDb
      .collection("users")
      .doc(userId)
      .collection("files")
      .doc(docId)
      .get();

    const fileData = fileRef.data();
    if (!fileData?.ref) {
      throw new Error("File reference not found in Firestore");
    }

    // Generate a signed URL that expires in 1 hour
    const bucket = adminStorage.bucket();
    const file = bucket.file(fileData.ref);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return signedUrl;
  }
}
