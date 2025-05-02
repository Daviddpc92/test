import Head from "next/head";
import SyllabusCard from "./subject";
import { useState } from "react";
import ExamCard from "./examen";
import Link from "next/link";
import AnimatedBackground from "@/components/atoms/background";

export default function Home() {
  const [showTest, setShowTest] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Examen</title>
        <meta name="description" content="Examen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="z-10 flex min-h-screen flex-col items-center justify-between p-4">
        <Link href="/">
          <img
            src="/logo.png"
            alt={"logo"}
            className="w-32 h-32 object-cover rounded-full shadow-lg"
          />
        </Link>

        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <button
            onClick={() => setShowTest(!showTest)}
            className="w-44 bg-blue-600 text-white text-center py-3 font-medium transition-transform duration-300 hover:bg-blue-700 rounded-lg"
          >
            {!showTest ? "Ver Temario" : "Examen"}
          </button>

          <div className="w-full flex justify-center rounded-lg shadow-lg overflow-auto lg:max-w-5xl">
            {!showTest ? <ExamCard /> : <SyllabusCard />}
          </div>
        </div>
      </main>
      <AnimatedBackground />
    </>
  );
}
