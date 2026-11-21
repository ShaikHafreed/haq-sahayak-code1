import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms · Haq Sahayak",
  description: "Terms of use for Haq Sahayak, an independent guide to Andhra Pradesh education schemes.",
};

export default function TermsPage() {
  return <TermsContent />;
}
