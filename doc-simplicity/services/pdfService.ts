import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export class PDFService {
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
