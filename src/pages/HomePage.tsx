import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { Comparison } from "../components/Comparison";
import { Templates } from "../components/Templates";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <Hero />
      <Features />
      <Comparison />
      <Templates />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
