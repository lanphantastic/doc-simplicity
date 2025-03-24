import { ChatOpenAI } from "@langchain/openai";

import { OpenAIEmbeddings } from "@langchain/openai";

import { FirestoreService } from "@/services/firestore";
import { PDFService } from "@/services/pdfService";
import { AuthService } from "@/services/authService";
import { PineconeService } from "@/services/pineconeService";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
  cache: true,
});

export const indexName = "simplicity-ai";

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
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
