import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms and conditions for using Offerra's AI-powered job tracking and career development tools.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
