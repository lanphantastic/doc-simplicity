export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
}

export class FileValidator {
  private config: FileValidationConfig;

  constructor(config: FileValidationConfig) {
    this.config = config;
  }

  validate(file: File): FileValidationResult {
    // Check file size
    if (file.size > this.config.maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${this.formatFileSize(this.config.maxSize)}`,
      };
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${this.config.allowedTypes.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  private formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  }
}

// Default configuration for PDF files
export const defaultPdfConfig: FileValidationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["application/pdf"],
};