import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy · Haq Sahayak",
  description: "How Haq Sahayak handles your data: it stays in your browser on this device.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
