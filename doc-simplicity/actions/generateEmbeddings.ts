"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type GenerateEmbeddingsResult = { completed: boolean; error?: string };

export async function generateEmbeddings(
  docId: string
): Promise<GenerateEmbeddingsResult> {
  try {
    auth.protect(); // Protect this route with Clerk

    // If needed, fetch the document from the database here before generating embeddings
    await generateEmbeddingsInPineconeVectorStore(docId);

    revalidatePath("/dashboard");

    return { completed: true };
  } catch (error) {
    // Optionally log the error here
    return { completed: false, error: (error as Error).message };
  }
}
