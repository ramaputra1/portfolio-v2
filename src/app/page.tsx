import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Navbar } from "@/components/navbar/Navbar";
import { RobotDivider } from "@/components/RobotDivider";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <RobotDivider />
      <Projects />
    </main>
  );
}
