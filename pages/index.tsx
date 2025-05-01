import Head from "next/head";
import { AnimatedCards } from "./subject";
import { useState } from "react";
import { ExamCard } from "./examen";

export default function Home() {
  const [showTest, setShowTest] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Quiz App</title>
        <meta name="description" content="A simple quiz app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <button
            onClick={() => setShowTest(!showTest)}
            className="w-44 bg-blue-600 text-white text-center py-3 font-medium transition-transform duration-300 hover:bg-blue-700 rounded-lg"
          >
            {showTest ? "Ver Temario" : "Examen"}
          </button>

          <div className="w-full flex justify-center rounded-lg shadow-lg overflow-auto max-w-4xl">
            {showTest ? <ExamCard /> : <AnimatedCards />}
          </div>
        </div>
      </main>
    </>
  );
}
