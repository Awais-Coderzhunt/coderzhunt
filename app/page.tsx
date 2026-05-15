import Header from "./components/Header";
import Hero from "./components/Hero";
import HeroStats from "./components/HeroStats";
import About from "./components/About";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroStats />
        <About />
      </main>
    </>
  );
}
