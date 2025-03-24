import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import pineconeClient from "./pinecone";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
  cache: true,
});

export const indexName = "simplicity-ai";

class AuthService {
  async getUserId() {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return userId;
  }
}

class FirestoreService {
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

class PDFService {
  async loadPDF(downloadUrl: string) {
    const response = await fetch(downloadUrl);
    const data = await response.blob();
    const loader = new PDFLoader(data);
    return await loader.load();
  }

  async splitPDF(docs: any) {
    const textSplitter = new RecursiveCharacterTextSplitter();
    return await textSplitter.splitDocuments(docs);
  }
}

class PineconeService {
  async namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No namespace value provided");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  }

  async getIndex() {
    return await pineconeClient.index(indexName);
  }

  async storeEmbeddings(
    index: Index<RecordMetadata>,
    namespace: string,
    docs: any,
    embeddings: OpenAIEmbeddings
  ) {
    return await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespace,
    });
  }

  async reuseEmbeddings(
    index: Index<RecordMetadata>,
    namespace: string,
    embeddings: OpenAIEmbeddings
  ) {
    return await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: namespace,
    });
  }
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const authService = new AuthService();
  const firestoreService = new FirestoreService();
  const pdfService = new PDFService();
  const pineconeService = new PineconeService();

  const userId = await authService.getUserId();
  const index = await pineconeService.getIndex();
  const namespaceAlreadyExists = await pineconeService.namespaceExists(
    index,
    docId
  );

  const embeddings = new OpenAIEmbeddings();

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reusing existing embeddings... ---`
    );
    return await pineconeService.reuseEmbeddings(index, docId, embeddings);
  } else {
    const downloadUrl = await firestoreService.getDownloadUrl(userId, docId);
    const docs = await pdfService.loadPDF(downloadUrl);
    const splitDocs = await pdfService.splitPDF(docs);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`
    );
    return await pineconeService.storeEmbeddings(
      index,
      docId,
      splitDocs,
      embeddings
    );
  }
}
