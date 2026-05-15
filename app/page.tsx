import Header from "./components/Header";
import Hero from "./components/Hero";
import HeroStats from "./components/HeroStats";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HeroStats />
      </main>
    </>
  );
}
