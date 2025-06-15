
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Quiz from "./Quiz";
import Flashcards from "./Flashcards";
import { saveQuizSession, saveFlashcardSession } from "@/services/quizService";
import { useToast } from "@/hooks/use-toast";

const StudyMode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Expecting data from location state
  const mcqs = location.state?.mcqs || [];
  const flashcards = location.state?.flashcards || [];
  const category = location.state?.category || "General";
  const [mode, setMode] = useState<"quiz" | "flashcards">("quiz");

  // If no data, redirect back to upload
  if ((!mcqs.length && !flashcards.length)) {
    navigate("/upload");
    return null;
  }

  // Auto-save generated content when component mounts
  useEffect(() => {
    const autoSave = async () => {
      try {
        if (mcqs.length > 0) {
          await saveQuizSession(
            `${category} Quiz - ${new Date().toLocaleDateString()}`,
            category,
            mcqs.map((q: any) => ({
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation
            })),
            false
          );
        }

        if (flashcards.length > 0) {
          await saveFlashcardSession(
            `${category} Flashcards - ${new Date().toLocaleDateString()}`,
            category,
            flashcards.map((fc: any) => ({
              front: fc.front,
              back: fc.back
            })),
            false
          );
        }

        console.log('Content auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    // Only auto-save if we have fresh content from upload
    if (location.state?.mcqs || location.state?.flashcards) {
      autoSave();
    }
  }, [mcqs, flashcards, category, location.state]);

  return (
    <div className="min-h-screen bg-quiz-bg flex flex-col">
      <Navigation />
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 pt-20 pb-16 flex-1 w-full">
        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4">
            <h1 className="font-poppins font-bold text-2xl mb-2 sm:mb-0 text-quiz-text">Study Mode</h1>
            <div className="flex gap-4">
              <Button
                variant={mode === "quiz" ? "default" : "outline"}
                onClick={() => setMode("quiz")}
                className={mode === "quiz" ? "quiz-button" : ""}
              >
                MCQ Quiz
              </Button>
              <Button
                variant={mode === "flashcards" ? "default" : "outline"}
                onClick={() => setMode("flashcards")}
                className={mode === "flashcards" ? "quiz-button" : ""}
              >
                Flashcards
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Render the selected mode, passing real MCQs/flashcards */}
        <div className="w-full">
          {mode === "quiz" ? (
            <Quiz mcqs={mcqs} readOnly={false} />
          ) : (
            <Flashcards flashcards={flashcards} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudyMode;
