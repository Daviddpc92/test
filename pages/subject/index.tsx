import { JSX, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { ArrowLeft, EyeClosed, Eye } from "lucide-react";

// Definición de tipos
interface Answer {
  id: number;
  created_at: string;
  title: string;
  answer_1: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  correct_answer: string;
  subject: string;
}

type GroupedAnswers = Record<string, Answer[]>;

async function fetchAnswers(): Promise<Answer[]> {
  const { data, error } = await supabase.from("answers").select("*");
  if (error) {
    console.error("Error al obtener datos:", error.message);
    return [];
  }
  return data as Answer[];
}

export function AnimatedCards(): JSX.Element {
  const [groupedAnswers, setGroupedAnswers] = useState<GroupedAnswers>({});
  const [showTest, setShowTest] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Answer | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  useEffect(() => {
    fetchAnswers().then((answers) => {
      const grouped = answers.reduce<GroupedAnswers>((acc, item) => {
        if (!acc[item.subject]) acc[item.subject] = [];
        acc[item.subject].push(item);
        return acc;
      }, {});
      setGroupedAnswers(grouped);
    });
  }, []);

  const startTest = (subject: string): void => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTestCompleted(false);
    setCurrentQuestion(groupedAnswers[subject][0]);
    setShowTest(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const checkAnswer = (answer: string): void => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      const correct = answer === currentQuestion.correct_answer;
      setIsCorrect(correct);
      if (correct) {
        setScore(score + 1);
      }
    }
    setShowAnswer(false);
  };

  const nextQuestion = (): void => {
    if (selectedSubject) {
      const questions = groupedAnswers[selectedSubject];
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setTestCompleted(true);
      }
      setShowAnswer(false);
    }
  };

  const goBackToCourses = (): void => {
    setShowTest(false);
    setSelectedSubject(null);
    setCurrentQuestion(null);
    setShowAnswer(false);
  };

  if (showTest) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-8 text-black">
        <button
          onClick={goBackToCourses}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a cursos
        </button>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {selectedSubject}
        </h1>

        {testCompleted ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Test Completado
            </h2>
            <p className="text-xl text-center mb-4">
              Tu puntuación: {score} de{" "}
              {selectedSubject && groupedAnswers[selectedSubject].length}
            </p>
            <div className="text-center mt-8">
              <button
                onClick={goBackToCourses}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver otros cursos
              </button>
            </div>
          </div>
        ) : currentQuestion && selectedSubject ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-2 text-black text-sm">
              Pregunta {currentQuestionIndex + 1} de{" "}
              {groupedAnswers[selectedSubject].length}
            </div>
            <h2 className="text-xl text-black font-semibold mb-6">
              {currentQuestion.title}
            </h2>
            <div className="flex gap-4 p-4 pl-0 items-center ">
              <button
                className="cursor-pointer"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? <Eye /> : <EyeClosed />}
              </button>
              {showAnswer && (
                <p className="text-sm text-black">
                  {currentQuestion.correct_answer}
                </p>
              )}
            </div>
            <div className="space-y-3 mb-8">
              {(["answer_1", "answer_2", "answer_3", "answer_4"] as const).map(
                (answerKey) => (
                  <button
                    key={answerKey}
                    onClick={() => checkAnswer(currentQuestion[answerKey])}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 border rounded-lg transition-colors text-black ${
                      selectedAnswer === currentQuestion[answerKey]
                        ? isCorrect
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500"
                        : currentQuestion.correct_answer ===
                            currentQuestion[answerKey] &&
                          selectedAnswer !== null
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {currentQuestion[answerKey]}
                  </button>
                )
              )}
            </div>

            {selectedAnswer && (
              <div className="flex justify-end">
                <button
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {currentQuestionIndex <
                  groupedAnswers[selectedSubject].length - 1
                    ? "Siguiente pregunta"
                    : "Ver resultados"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">Cargando test...</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        FORMACIÓN
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        {Object.entries(groupedAnswers).map(
          ([subject, questions]: [string, Answer[]]) => (
            <div key={subject} className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                {subject}
              </h2>

              <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl mx-auto">
                <div className="relative">
                  <img
                    src="https://fepfi.es/wp-content/uploads/2021/10/placeholder-1.png"
                    alt={subject}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Curso
                    </span>
                    <span className="text-xs text-gray-500">
                      {questions.length} preguntas
                    </span>
                  </div>

                  <h2 className="font-bold text-xl mb-2 text-gray-800 h-24">
                    {subject}
                  </h2>

                  <div className="mt-6">
                    <button
                      onClick={() => startTest(subject)}
                      className="w-full bg-blue-600 text-white text-center py-3 font-medium transition-transform duration-300 hover:bg-blue-700 rounded-lg"
                    >
                      Comenzar Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function Page(): JSX.Element {
  return <AnimatedCards />;
}
