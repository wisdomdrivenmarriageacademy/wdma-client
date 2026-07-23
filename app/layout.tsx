import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/auth-context";
import InstructorProvider from "@/context/instructor-context";
import StudentProvider from "@/context/student-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wisdom Driven Marriage Academy",
    template: "%s | Wisdom Driven Marriage Academy",
  },
  description:
    "Practical, wisdom-led learning for healthier relationships and stronger marriages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <InstructorProvider>
            <StudentProvider>{children}</StudentProvider>
          </InstructorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
