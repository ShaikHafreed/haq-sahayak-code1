import schemesJson from "../../data/schemes.json";
import documentsJson from "../../data/documents.json";
import type { DocumentType, Scheme } from "../types";

const schemes = schemesJson as unknown as Scheme[];
const documents = documentsJson as unknown as DocumentType[];

export function getSchemes(): Scheme[] {
  return schemes;
}

export function getScheme(id: string): Scheme | undefined {
  return schemes.find((s) => s.id === id);
}

export function getDocuments(): DocumentType[] {
  return documents;
}

export function getDocument(id: string): DocumentType | undefined {
  return documents.find((d) => d.id === id);
}
