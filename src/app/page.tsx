import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Navbar } from "@/components/navbar/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
    </main>
  );
}
