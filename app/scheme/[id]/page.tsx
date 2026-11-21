import { notFound } from "next/navigation";
import SchemeDetail from "@/components/scheme/SchemeDetail";
import { getDocument, getScheme, getSchemes } from "@/lib/data";
import type { DocumentType } from "@/lib/types";

export function generateStaticParams() {
  return getSchemes().map((s) => ({ id: s.id }));
}

export default async function SchemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scheme = getScheme(id);
  if (!scheme) notFound();

  const documents = scheme.documents
    .map((docId) => getDocument(docId))
    .filter((d): d is DocumentType => d !== undefined);

  // Language is chosen in the browser, so the text is rendered by a small client component.
  return <SchemeDetail scheme={scheme} documents={documents} />;
}
