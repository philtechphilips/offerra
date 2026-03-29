import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account",
  description: "Join Offerra today and start tracking your job applications with the power of AI. Your dream career starts here.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
