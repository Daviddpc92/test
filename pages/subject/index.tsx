import RenderQuestion from "@/components/molecules/render";
import { ANSWERS_EXAM_FROM_QUIZ_JSON } from "@/lib/quizDataAdapter";
import { JSX } from "react";

export default function SyllabusCard(): JSX.Element {
  return <RenderQuestion answer={ANSWERS_EXAM_FROM_QUIZ_JSON} />;
}
