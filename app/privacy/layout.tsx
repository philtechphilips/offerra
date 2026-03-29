import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Offerra protects your data and privacy while you use our AI career assistant.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
