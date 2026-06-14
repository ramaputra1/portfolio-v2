import type { Metadata } from "next";
import { Caveat, Inter, Pacifico } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rama Putra - Full Stack Developer",
  description:
    "Computer Science student at BYU-Hawaii building scalable web applications with clean code.",
  openGraph: {
    title: "Rama Putra - Full Stack Developer",
    description:
      "I build scalable web applications, design intuitive user experiences, and solve problems with clean code.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable} ${pacifico.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
