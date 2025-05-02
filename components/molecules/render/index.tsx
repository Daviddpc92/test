import { JSX, useEffect, useState } from "react";
import {
  ArrowLeft,
  EyeClosed,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Answer,
  AnswerResult,
  ExamAnswer,
  GroupedAnswers,
  StatsRecord,
} from "./types";

export default function RenderQuestion({
  answer,
}: {
  answer: ExamAnswer[];
}): JSX.Element {
  const [groupedAnswers, setGroupedAnswers] = useState<GroupedAnswers>({});
  const [subjectStats, setSubjectStats] = useState<StatsRecord>({});
  const [showTest, setShowTest] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Answer | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);
  const [showMistakes, setShowMistakes] = useState<boolean>(false);

  useEffect(() => {
    const loadStats = () => {
      const savedStats = localStorage.getItem("examStats");
      if (savedStats) {
        try {
          const parsedStats = JSON.parse(savedStats) as StatsRecord;
          setSubjectStats(parsedStats);
        } catch (error) {
          console.error("Error parsing stats from localStorage:", error);
          setSubjectStats({});
        }
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const grouped = answer.reduce<GroupedAnswers>((acc, item) => {
      if (!acc[item.subject]) acc[item.subject] = [];
      acc[item.subject].push(item as Answer);
      return acc;
    }, {});
    setGroupedAnswers(grouped);
  }, [answer]);

  const updateStats = (subject: string, newScore: number) => {
    const currentStats = { ...subjectStats };

    if (!currentStats[subject]) {
      currentStats[subject] = {
        attempts: 0,
        highestScore: 0,
      };
    }

    currentStats[subject].attempts += 1;
    currentStats[subject].highestScore = Math.max(
      currentStats[subject].highestScore,
      newScore
    );

    setSubjectStats(currentStats);

    // Save to localStorage
    localStorage.setItem("examStats", JSON.stringify(currentStats));
  };

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
    setAnswerResults([]);
    setShowMistakes(false);
  };

  const checkAnswer = (answer: string): void => {
    setSelectedAnswer(answer);
    if (currentQuestion) {
      const correct = answer === currentQuestion.correct_answer;
      setIsCorrect(correct);

      if (correct) {
        setScore(score + 1);
      }

      const currentResults = [...answerResults];
      const existingIndex = currentResults.findIndex(
        (result) => result.question.title === currentQuestion.title
      );

      const result: AnswerResult = {
        question: currentQuestion,
        selectedAnswer: answer,
        isCorrect: correct,
      };

      if (existingIndex >= 0) {
        currentResults[existingIndex] = result;
      } else {
        currentResults.push(result);
      }

      setAnswerResults(currentResults);
    }
    setShowAnswer(false);
  };

  const goToQuestion = (index: number): void => {
    if (
      selectedSubject &&
      index >= 0 &&
      index < groupedAnswers[selectedSubject].length
    ) {
      const nextQuestion = groupedAnswers[selectedSubject][index];
      setCurrentQuestionIndex(index);
      setCurrentQuestion(nextQuestion);

      const existingResult = answerResults.find(
        (result) => result.question.title === nextQuestion.title
      );

      if (existingResult) {
        setSelectedAnswer(existingResult.selectedAnswer);
        setIsCorrect(existingResult.isCorrect);
      } else {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }

      setShowAnswer(false);
    }
  };

  const prevQuestion = (): void => {
    goToQuestion(currentQuestionIndex - 1);
  };

  const nextQuestion = (): void => {
    if (selectedAnswer === null) {
      goToQuestion(currentQuestionIndex + 1);
      return;
    }

    if (selectedSubject) {
      const questions = groupedAnswers[selectedSubject];
      if (currentQuestionIndex < questions.length - 1) {
        goToQuestion(currentQuestionIndex + 1);
      } else {
        finishTest();
      }
    }
  };

  const finishTest = (): void => {
    if (selectedSubject) {
      const totalQuestions = groupedAnswers[selectedSubject].length;
      const scorePercentage = Math.round((score / totalQuestions) * 100);
      updateStats(selectedSubject, scorePercentage);
    }
    setTestCompleted(true);
  };

  const goBackToCourses = (): void => {
    setShowTest(false);
    setSelectedSubject(null);
    setCurrentQuestion(null);
    setShowAnswer(false);
    setShowMistakes(false);
  };

  const toggleMistakesView = (): void => {
    setShowMistakes(!showMistakes);
  };

  const getScorePercentage = (score: number, total: number): number => {
    return Math.round((score / total) * 100);
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

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 ">
          {selectedSubject}
        </h1>

        {testCompleted ? (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">
              Test Completado
            </h2>
            <p className="text-xl text-center mb-4">
              Tu puntuación: {score} de{" "}
              {selectedSubject && groupedAnswers[selectedSubject].length} ({" "}
              {selectedSubject &&
                getScorePercentage(
                  score,
                  groupedAnswers[selectedSubject].length
                )}
              % )
            </p>

            {selectedSubject && subjectStats[selectedSubject] && (
              <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="flex items-center justify-center gap-2 text-blue-700 font-medium">
                  <Trophy size={20} className="text-yellow-500" />
                  Mejor puntuación: {subjectStats[selectedSubject].highestScore}
                  %
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Has realizado este test{" "}
                  {subjectStats[selectedSubject].attempts}{" "}
                  {subjectStats[selectedSubject].attempts === 1
                    ? "vez"
                    : "veces"}
                </p>
              </div>
            )}

            <div className="text-center mt-4 mb-6">
              <button
                onClick={toggleMistakesView}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {showMistakes ? "Ocultar errores" : "Ver preguntas falladas"}
              </button>
            </div>

            {showMistakes && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Revisión de errores
                </h3>
                {answerResults.filter((result) => !result.isCorrect).length >
                0 ? (
                  answerResults
                    .filter((result) => !result.isCorrect)
                    .map((result, index) => (
                      <div
                        key={index}
                        className="mb-6 pb-6 border-b last:border-b-0"
                      >
                        <p className="font-semibold mb-2">
                          {result.question.title}
                        </p>
                        <p className="mb-1 text-red-600">
                          Tu respuesta: {result.selectedAnswer}
                        </p>
                        <p className="text-green-600">
                          Respuesta correcta: {result.question.correct_answer}
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-green-600 font-medium">
                    ¡Felicidades! No has cometido ningún error.
                  </p>
                )}
              </div>
            )}

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
            <div className="flex justify-between items-center mb-4">
              <div className="text-black text-sm">
                Pregunta {currentQuestionIndex + 1} de{" "}
                {groupedAnswers[selectedSubject].length}
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showAnswer ? <Eye size={16} /> : <EyeClosed size={16} />}
                  {showAnswer ? "Ocultar respuesta" : "Ver respuesta"}
                </button>
              </div>
            </div>

            <h2 className="text-xl text-black font-semibold mb-6">
              {currentQuestion.title}
            </h2>

            {showAnswer && (
              <p className="text-sm text-green-600 mb-4 font-medium">
                Respuesta correcta: {currentQuestion.correct_answer}
              </p>
            )}

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

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentQuestionIndex === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
              >
                <ChevronLeft size={16} className="mr-1" />
                Anterior
              </button>

              <div className="flex gap-4">
                {currentQuestionIndex ===
                  groupedAnswers[selectedSubject].length - 1 && (
                  <button
                    onClick={finishTest}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Finalizar
                  </button>
                )}

                {currentQuestionIndex <
                  groupedAnswers[selectedSubject].length - 1 && (
                  <button
                    onClick={nextQuestion}
                    className={`flex items-center px-4 py-2 rounded-lg ${
                      selectedAnswer === null
                        ? "bg-blue-400 text-white hover:bg-blue-500"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Siguiente
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">Cargando test...</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        {Object.entries(groupedAnswers).map(
          ([subject, questions]: [string, Answer[]]) => (
            <div key={subject} className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6 h-24">
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

                <div className="p-6 h-64 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Curso
                    </span>
                    <span className="text-xs text-gray-500">
                      {questions.length} preguntas
                    </span>
                  </div>

                  <h2 className="font-bold text-xl mb-2 text-gray-800 truncate">
                    {subject}
                  </h2>

                  {subjectStats[subject] ? (
                    <div className="mt-2 mb-4">
                      <div className="flex items-center gap-1 text-blue-700">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium">
                          Mejor: {subjectStats[subject].highestScore}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Intentos: {subjectStats[subject].attempts}
                      </p>
                    </div>
                  ) : (
                    <div className="h-14"></div>
                  )}

                  <div className="mt-4">
                    <Button onClick={() => startTest(subject)}>
                      Comenzar Test
                    </Button>
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
