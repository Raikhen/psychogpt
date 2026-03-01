import type { Metadata } from "next";
import { Inter, Rock_Salt, Pangolin } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rockSalt = Rock_Salt({ weight: "400", subsets: ["latin"], variable: "--font-rock-salt" });
const pangolin = Pangolin({ weight: "400", subsets: ["latin"], variable: "--font-pangolin" });

export const metadata: Metadata = {
  title: "PsychoGPT",
  description:
    "Red-teaming LLMs with psychotic delusions — based on Tim Hua's AI Psychosis experiment",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🫠</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${rockSalt.variable} ${pangolin.variable} font-sans bg-surface-0 text-text-primary antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
