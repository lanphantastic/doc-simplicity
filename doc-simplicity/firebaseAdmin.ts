import { initializeApp, getApps, App, getApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (getApps().length === 0) {
  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || "doc-simplicity",
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  };

  app = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
