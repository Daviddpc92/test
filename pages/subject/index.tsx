import RenderQuestion from "@/components/molecules/render";
import { ANSWERS } from "@/lib/const";
import { JSX } from "react";

export default function SyllabusCard(): JSX.Element {
  return <RenderQuestion answer={ANSWERS} />;
}
