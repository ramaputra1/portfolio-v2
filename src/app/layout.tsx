import type { Metadata } from "next";
import { Caveat, Inter, Pacifico, Poppins } from "next/font/google";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rama Putra - Full Stack Developer",
  description:
    "Computer Science student at BYU-Hawaii building scalable web applications with clean code.",
  icons: {
    icon: "/images/logo-ramaap.png",
    apple: "/images/logo-ramaap.png",
  },
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
      className={`${inter.variable} ${caveat.variable} ${pacifico.variable} ${poppins.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
