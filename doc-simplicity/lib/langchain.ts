import { ChatOpenAI } from "@langchain/openai";

import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

import { FirestoreService } from "@/services/firestoreService";
import { PDFService } from "@/services/pdfService";
import { AuthService } from "@/services/authService";
import { PineconeService } from "@/services/pineconeService";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
  cache: true,
});

export const indexName = "simplicity-ai";

export async function generateEmbeddingsInPineconeVectorStore(docId: string): Promise<PineconeStore> {
  try {
    const authService = new AuthService();
    const firestoreService = new FirestoreService();
    const pdfService = new PDFService();
    const pineconeService = new PineconeService();

    const userId = await authService.getUserId();
    const index = await pineconeService.getIndex(indexName);
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
      const downloadUrl = await firestoreService.getSignedDownloadUrl(userId, docId);
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
  } catch (error) {
    console.error("Error generating embeddings in Pinecone Vector Store:", error);
    throw error;
  }
}
