import { JSX } from "react";
import { ANSWERS_EXAM } from "@/lib/const";
import RenderQuestion from "@/components/molecules/render";

export default function ExamCard(): JSX.Element {
  return <RenderQuestion answer={ANSWERS_EXAM} />;
}
