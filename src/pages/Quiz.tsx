import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { Clock, Share2, CheckCircle, XCircle, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { saveQuizSession } from "@/services/quizService";
import { useToast } from "@/hooks/use-toast";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";

interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  category?: string;
}

interface QuizProps {
  mcqs?: MCQ[];
  readOnly?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ mcqs, readOnly }) => {
  // Use props.mcqs if provided, otherwise fallback to demo questions
  const questions = mcqs && mcqs.length
    ? mcqs.map((q, i) => {
        // The API returns 'correct' field, not 'correctIndex'
        const correctIndex = q.correctIndex !== undefined ? q.correctIndex : (q as any).correct;
        console.log(`Mapping MCQ ${i}:`, {
          question: q.question.substring(0, 50),
          correctIndex: q.correctIndex,
          apiCorrect: (q as any).correct,
          finalCorrect: correctIndex,
          explanation: q.explanation
        });
        return {
          id: i + 1,
          question: q.question,
          options: q.options,
          correct: correctIndex, // Use the correct field from API
          explanation: q.explanation || "",
          category: q.category || "General",
        };
      })
    : [
        {
          id: 1,
          question: "What is the primary function of chlorophyll in photosynthesis?",
          options: [
            "To absorb light energy",
            "To store glucose", 
            "To release oxygen",
            "To break down water"
          ],
          correct: 0,
          explanation: "Chlorophyll is the green pigment that captures light energy and converts it into chemical energy during photosynthesis.",
          category: "Biology"
        },
        {
          id: 2,
          question: "During which phase of mitosis do chromosomes align at the cell's center?",
          options: [
            "Prophase",
            "Metaphase",
            "Anaphase", 
            "Telophase"
          ],
          correct: 1,
          explanation: "During metaphase, chromosomes align at the metaphase plate (cell's equator) before being separated.",
          category: "Biology"
        },
        {
          id: 3,
          question: "Which base pairs with Adenine in DNA?",
          options: [
            "Guanine",
            "Cytosine",
            "Thymine",
            "Uracil"
          ],
          correct: 2,
          explanation: "Adenine always pairs with Thymine in DNA through two hydrogen bonds (A-T base pairing).",
          category: "Biology"
        },
        {
          id: 4,
          question: "What is the main product of photosynthesis?",
          options: [
            "Carbon dioxide",
            "Water",
            "Glucose",
            "Oxygen"
          ],
          correct: 2,
          explanation: "While oxygen is released as a byproduct, glucose is the main energy-storing product of photosynthesis.",
          category: "Biology"
        }
      ];

  const { toast } = useToast();
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));

  // Calculate time based on 30 seconds per question
  const totalTime = questions.length * 30;
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  // Get category from the first question (assuming AI will categorize the whole set)
  const quizCategory = questions.length > 0 ? questions[0].category : "General";

  // Debug the current question data
  useEffect(() => {
    const currentQ = questions[currentQuestion];
    console.log('Current question debug in Quiz.tsx:', {
      questionIndex: currentQuestion,
      question: currentQ?.question?.substring(0, 50),
      correct: currentQ?.correct,
      options: currentQ?.options?.length,
      explanation: currentQ?.explanation
    });
  }, [currentQuestion, questions]);

  const handleSaveQuiz = async () => {
    if (!questions.length) return;
    
    setIsSaving(true);
    try {
      // Save the actual questions being used in the quiz (either from props or demo)
      const sessionId = await saveQuizSession(
        `${quizCategory} Quiz - ${new Date().toLocaleDateString()}`,
        quizCategory,
        questions.map(q => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correct, // Map 'correct' to 'correctIndex' for the service
          explanation: q.explanation
        })),
        true // Make it public so it can be shared
      );
      
      setSavedSessionId(sessionId);
      toast({
        title: "Quiz Saved!",
        description: "Your quiz has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareQuiz = async () => {
    if (!savedSessionId) {
      // Save first if not saved
      await handleSaveQuiz();
      return;
    }

    const shareUrl = `${window.location.origin}/quiz?session=${savedSessionId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Quiz share link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Link",
        description: shareUrl,
      });
    }
  };

  const handleCopyUrl = () => {
    if (savedSessionId) {
      const shareUrl = `${window.location.origin}/quiz?session=${savedSessionId}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Quiz share link has been copied to your clipboard.",
      });
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isQuizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleQuizComplete();
    }
  }, [timeLeft, isQuizComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Ensure selectedAnswer is always a stringified number, or '' if none
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1] || '');
      setShowCorrect(false); // hide correct on next
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
      setShowCorrect(false); // hide correct when going back
    }
  };

  const handleQuizComplete = () => {
    const finalAnswers = [...answers];
    finalAnswers[currentQuestion] = selectedAnswer;
    setAnswers(finalAnswers);
    setIsQuizComplete(true);
    setShowResults(true);
    setShowCorrect(false);
  };

  // All answer checking uses index comparison
  const calculateScore = () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (
        answer !== null &&
        answer !== '' &&
        parseInt(answer) === questions[index].correct
      ) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const getCorrectlyAnsweredQuestions = () => {
    const correctQuestions = [];
    answers.forEach((answer, index) => {
      if (
        answer !== null &&
        answer !== '' &&
        parseInt(answer) === questions[index].correct
      ) {
        correctQuestions.push(index + 1);
      }
    });
    return correctQuestions;
  };

  const getIncorrectlyAnsweredQuestions = () => {
    const incorrectQuestions = [];
    answers.forEach((answer, index) => {
      if (
        answer !== null &&
        answer !== '' &&
        parseInt(answer) !== questions[index].correct
      ) {
        incorrectQuestions.push(index + 1);
      }
    });
    return incorrectQuestions;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <QuizResults
        questions={questions}
        answers={answers}
        score={score}
        percentage={percentage}
        quizCategory={quizCategory}
        onSaveQuiz={handleSaveQuiz}
        isSaving={isSaving}
        savedSessionId={savedSessionId}
        onShareQuiz={handleShareQuiz}
      />
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  console.log('Rendering QuizQuestion with props:', {
    question: currentQ?.question?.substring(0, 50),
    correct: currentQ?.correct,
    options: currentQ?.options?.length,
    explanation: currentQ?.explanation,
    selectedAnswer
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <div>
          <h1 className="font-poppins font-bold text-3xl text-quiz-text">
            {quizCategory} Quiz
          </h1>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        {/* Timer */}
        <Card className="bg-quiz-purple text-white">
          <CardContent className="p-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question Card */}
      <QuizQuestion
        question={currentQ.question}
        options={currentQ.options}
        correct={currentQ.correct}
        explanation={currentQ.explanation}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleAnswerSelect}
        showCorrect={showCorrect}
        setShowCorrect={setShowCorrect}
      />

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-8 py-3"
        >
          Previous
        </Button>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {selectedAnswer ? 'Ready to continue?' : 'Please select an answer'}
          </p>
        </div>

        <Button
          onClick={currentQuestion === questions.length - 1 ? handleQuizComplete : handleNext}
          disabled={selectedAnswer === ''}
          className="quiz-button px-8 py-3"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>

      {/* Quiz Info */}
      <Card className="quiz-card mt-8 animate-slide-up">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-medium text-quiz-text mb-1">Questions</p>
              <p className="text-gray-600">{questions.length} total</p>
            </div>
            <div>
              <p className="font-medium text-quiz-text mb-1">Time Limit</p>
              <p className="text-gray-600">{Math.ceil(totalTime / 60)} minutes</p>
            </div>
            <div>
              <p className="font-medium text-quiz-text mb-1">Topic</p>
              <p className="text-gray-600">{quizCategory}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
