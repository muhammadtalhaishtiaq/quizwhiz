
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
}
interface Flashcard {
  front: string;
  back: string;
}

interface GeneratedResultsProps {
  mcqs: MCQ[];
  flashcards: Flashcard[];
}

const GeneratedResults: React.FC<GeneratedResultsProps> = ({ mcqs, flashcards }) => (
  <div className="mb-10">
    {mcqs.length > 0 && (
      <Card className="quiz-card mb-8">
        <CardHeader>
          <CardTitle className="font-poppins text-lg text-center">Generated Multiple Choice Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {mcqs.map((q, i) => (
            <div key={i} className="mb-6">
              <div className="font-semibold mb-2">{i + 1}. {q.question}</div>
              <ul className="mb-1">
                {q.options && q.options.map((opt, j) => (
                  <li key={j} className={`pl-3 ${j === q.correctIndex ? "text-green-600 font-bold" : ""}`}>
                    {String.fromCharCode(65 + j)}) {opt}
                  </li>
                ))}
              </ul>
              <div className="text-sm text-gray-500">
                Correct: {q.options?.[q.correctIndex] || "(unspecified)"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}
    {flashcards.length > 0 && (
      <Card className="quiz-card mb-8">
        <CardHeader>
          <CardTitle className="font-poppins text-lg text-center">Generated Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          {flashcards.map((fc, i) => (
            <div key={i} className="mb-6">
              <div className="font-semibold mb-1">Q: {fc.front}</div>
              <div className="ml-3">A: {fc.back}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    )}
  </div>
);

export default GeneratedResults;
