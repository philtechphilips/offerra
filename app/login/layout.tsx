import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Your Dashboard",
  description: "Access your Offerra job tracking dashboard and manage your career progression with AI-powered tools.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
