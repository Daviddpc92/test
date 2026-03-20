import type { ExamAnswer } from "@/components/molecules/render/types";
import quizData from "./quiz_data.json";

type OptionLetter = "A" | "B" | "C" | "D";

type QuizOpciones = Partial<Record<OptionLetter, string>>;

interface QuizQuestionRow {
  test: string;
  pregunta: string;
  opciones: QuizOpciones;
  respuesta_correcta: string;
}

type QuizDataFile = Record<string, QuizQuestionRow[]>;

function normalizeCorrectKey(raw: string): OptionLetter | null {
  const k = raw.trim().toUpperCase();
  if (k === "A" || k === "B" || k === "C" || k === "D") return k;
  return null;
}

/** Convierte `quiz_data.json` al formato `ExamAnswer[]` usado por `RenderQuestion`. */
export function adaptQuizDataToExamAnswers(
  data: QuizDataFile = quizData as QuizDataFile
): ExamAnswer[] {
  const out: ExamAnswer[] = [];

  for (const [subject, rows] of Object.entries(data)) {
    if (!Array.isArray(rows)) continue;

    for (const row of rows) {
      const op = row.opciones ?? {};
      const answer_1 = op.A ?? "";
      const answer_2 = op.B ?? "";
      const answer_3 = op.C ?? "";
      const answer_4 = op.D ?? "";
      const letter = normalizeCorrectKey(row.respuesta_correcta);
      const correct_answer = letter ? (op[letter] ?? "") : "";

      out.push({
        subject,
        title: row.pregunta,
        answer_1,
        answer_2,
        answer_3,
        answer_4,
        correct_answer,
      });
    }
  }

  return out;
}

/** Preguntas del examen leídas desde `lib/quiz_data.json`. */
export const ANSWERS_EXAM_FROM_QUIZ_JSON = adaptQuizDataToExamAnswers();
