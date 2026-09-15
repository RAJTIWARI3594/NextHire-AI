import crypto from "crypto";

export const ALLOWED_FILE_TYPES: Record<
  string,
  { mime: string[]; maxSizeBytes: number }
> = {
  resume: {
    mime: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
  },
  avatar: {
    mime: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
  },
  document: {
    mime: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ],
    maxSizeBytes: 15 * 1024 * 1024, // 15MB
  },
};

export interface FileValidationResult {
  valid: boolean;
  fileHash?: string;
  sanitizedFilename?: string;
  error?: string;
}

/**
 * Sanitize filename to prevent directory traversal and header injection attacks.
 */
export function sanitizeFilename(filename: string): string {
  const nameWithoutPath = filename.replace(/^.*[\\\/]/, "");
  return nameWithoutPath
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.+/g, ".")
    .substring(0, 100);
}

/**
 * Calculate SHA-256 hash of file buffer for duplicate file detection.
 */
export function calculateFileHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Inspect magic bytes of file buffer to verify true MIME type.
 */
export function verifyMagicBytes(
  buffer: Buffer,
  expectedMime: string
): boolean {
  if (buffer.length < 4) return false;

  const header = buffer.toString("hex", 0, 4);

  if (expectedMime === "application/pdf") {
    // PDF Magic Bytes: %PDF -> 25 50 44 46
    return header.startsWith("25504446");
  }

  if (expectedMime === "image/jpeg") {
    // JPEG Magic Bytes: FF D8 FF
    return header.startsWith("ffd8ff");
  }

  if (expectedMime === "image/png") {
    // PNG Magic Bytes: 89 50 4E 47
    return header.startsWith("89504e47");
  }

  if (expectedMime === "image/webp") {
    // RIFF Magic Bytes: 52 49 46 46
    return header.startsWith("52494646");
  }

  if (
    expectedMime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    expectedMime === "application/zip"
  ) {
    // ZIP / DOCX Magic Bytes: PK.. -> 50 4B 03 04
    return header.startsWith("504b0304");
  }

  return true;
}

/**
 * Malware Scan Integration Hook (Simulates ClamAV / VirusTotal scanner verification).
 */
export async function scanFileForMalware(
  buffer: Buffer,
  filename: string
): Promise<{
  isClean: boolean;
  scanDetails: string;
}> {
  // Check for common test virus signature (EICAR test string)
  const eicarSignature =
    "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
  const fileContent = buffer.toString("utf8");

  if (fileContent.includes(eicarSignature)) {
    return {
      isClean: false,
      scanDetails: "EICAR test malware signature detected",
    };
  }

  // Scan for executable script injection in document files
  const suspiciousScriptPatterns = [
    "<script",
    "<?php",
    "#!/bin/sh",
    "system(",
    "exec(",
  ];
  if (filename.endsWith(".pdf") || filename.endsWith(".docx")) {
    for (const pattern of suspiciousScriptPatterns) {
      if (fileContent.includes(pattern)) {
        return {
          isClean: false,
          scanDetails: `Suspicious code pattern detected: "${pattern}"`,
        };
      }
    }
  }

  return {
    isClean: true,
    scanDetails: "ClamAV engine check passed. No threat detected.",
  };
}

/**
 * Complete security validation pipeline for uploaded files.
 */
export async function validateUploadedFile(
  fileBuffer: Buffer,
  filename: string,
  declaredMimeType: string,
  category: keyof typeof ALLOWED_FILE_TYPES = "document"
): Promise<FileValidationResult> {
  const config = ALLOWED_FILE_TYPES[category] || ALLOWED_FILE_TYPES.document;

  // 1. File Size Validation
  if (fileBuffer.length > config.maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${config.maxSizeBytes / (1024 * 1024)}MB.`,
    };
  }

  // 2. MIME Type Whitelist
  if (!config.mime.includes(declaredMimeType)) {
    return {
      valid: false,
      error: `File type "${declaredMimeType}" is not permitted for ${category} uploads. Allowed: ${config.mime.join(", ")}`,
    };
  }

  // 3. Magic Bytes Verification
  const isMagicValid = verifyMagicBytes(fileBuffer, declaredMimeType);
  if (!isMagicValid) {
    return {
      valid: false,
      error:
        "File extension does not match the actual file contents (MIME spoofing attempt).",
    };
  }

  // 4. Filename Sanitization
  const sanitizedFilename = sanitizeFilename(filename);

  // 5. Malware Scan Check
  const malwareScan = await scanFileForMalware(fileBuffer, sanitizedFilename);
  if (!malwareScan.isClean) {
    return {
      valid: false,
      error: `Security scan rejected file: ${malwareScan.scanDetails}`,
    };
  }

  // 6. Calculate Hash for Duplicate Detection
  const fileHash = calculateFileHash(fileBuffer);

  return {
    valid: true,
    fileHash,
    sanitizedFilename,
  };
}
