export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings. This will only take a few seconds...",
}

export type Status = StatusText[keyof StatusText];
