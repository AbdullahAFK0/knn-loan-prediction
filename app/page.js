import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeClient from "./HomeClient";

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: "100vh", background: "var(--background)" }}>
        <HomeClient />
      </main>
      <Footer />
    </>
  );
}
