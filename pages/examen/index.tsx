import { JSX } from "react";
import { ANSWERS_EXAM_FROM_QUIZ_JSON } from "@/lib/quizDataAdapter";
import RenderQuestion from "@/components/molecules/render";

export default function ExamCard(): JSX.Element {
  return <RenderQuestion answer={ANSWERS_EXAM_FROM_QUIZ_JSON} />;
}
