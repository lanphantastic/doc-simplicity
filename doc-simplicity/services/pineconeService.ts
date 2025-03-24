import pineconeClient from "@/lib/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";

export class PineconeService {
  async namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace === null) throw new Error("No namespace value provided");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
  }

  async getIndex(indexName: string) {
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
