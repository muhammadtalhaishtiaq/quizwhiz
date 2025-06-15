
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Target, Copy, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MCQ {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  category?: string;
}
interface QuizResultsProps {
  questions: MCQ[];
  answers: (string|null)[];
  score: number;
  percentage: number;
  quizCategory: string;
  onSaveQuiz: () => void;
  isSaving: boolean;
  savedSessionId: string|null;
  onShareQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  questions,
  answers,
  score,
  percentage,
  quizCategory,
  onSaveQuiz,
  isSaving,
  savedSessionId,
  onShareQuiz,
}) => {
  const getCorrectlyAnsweredQuestions = () =>
    answers.reduce<number[]>((arr, answer, idx) => {
      if (
        answer !== null &&
        answer !== '' &&
        parseInt(answer) === questions[idx].correct
      ) arr.push(idx + 1);
      return arr;
    }, []);

  const getIncorrectlyAnsweredQuestions = () =>
    answers.reduce<number[]>((arr, answer, idx) => {
      if (
        answer !== null &&
        answer !== '' &&
        parseInt(answer) !== questions[idx].correct
      ) arr.push(idx + 1);
      return arr;
    }, []);

  const shareUrl = savedSessionId ? `${window.location.origin}/quiz?session=${savedSessionId}` : null;

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <Card className="quiz-card animate-scale-in">
        <CardHeader className="text-center">
          <div className="w-20 h-20 quiz-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="font-poppins text-3xl">
            Quiz Complete! 🎉
          </CardTitle>
          <Badge className="bg-quiz-purple/10 text-quiz-purple mt-2">
            Topic: {quizCategory}
          </Badge>
        </CardHeader>
        <CardContent className="p-8">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-quiz-purple mb-2">
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">
              You got {score} out of {questions.length} questions correct
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold text-green-800 mb-2">Correct Answers</h3>
                <p className="text-2xl font-bold text-green-600">{score}</p>
                <p className="text-sm text-green-600 mt-2">
                  Questions: {getCorrectlyAnsweredQuestions().join(', ') || '–'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-red-800 mb-2">Needs Review</h3>
                <p className="text-2xl font-bold text-red-600">{questions.length - score}</p>
                <p className="text-sm text-red-600 mt-2">
                  Questions: {getIncorrectlyAnsweredQuestions().join(', ') || '–'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Review with Main Collapsible */}
          <div className="mb-8">
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border font-semibold text-left">
                <span className="font-poppins text-lg">Review Your Answers ({questions.length} questions)</span>
                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-3">
                  {questions.map((q, i) => {
                    const userSelected = answers[i];
                    const correct = q.correct;
                    const userSelectedIdx = userSelected !== null && userSelected !== "" ? parseInt(userSelected) : null;
                    const isCorrect = userSelectedIdx === correct;
                    
                    return (
                      <Collapsible key={i}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-white hover:bg-gray-50 rounded-lg border text-left">
                          <div className="flex items-center gap-3">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                            <span className="font-medium">
                              {i + 1}. {q.question.length > 80 ? q.question.substring(0, 80) + '...' : q.question}
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 flex-shrink-0" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 bg-gray-50 rounded-lg mt-2">
                            <div className="mb-3">
                              <h4 className="font-medium text-gray-800 mb-2">{q.question}</h4>
                            </div>
                            <ul className="space-y-2 mb-4">
                              {q.options.map((option, idx) => {
                                const isOptionCorrect = idx === correct;
                                const isSelected = userSelectedIdx === idx;
                                let bgClass = "bg-white";
                                let borderClass = "border-gray-200";
                                
                                if (isSelected && isOptionCorrect) {
                                  bgClass = "bg-green-100";
                                  borderClass = "border-green-300";
                                } else if (isSelected && !isOptionCorrect) {
                                  bgClass = "bg-red-100";
                                  borderClass = "border-red-300";
                                } else if (isOptionCorrect) {
                                  bgClass = "bg-green-50";
                                  borderClass = "border-green-200";
                                }
                                
                                return (
                                  <li
                                    key={idx}
                                    className={`rounded-lg px-3 py-2 border ${bgClass} ${borderClass} flex items-center justify-between`}
                                  >
                                    <div className="flex items-center">
                                      <span className="mr-3 font-medium text-gray-600">
                                        {String.fromCharCode(65 + idx)}.
                                      </span>
                                      <span>{option}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isSelected && isOptionCorrect && (
                                        <Badge className="bg-green-600 text-white text-xs">Your Answer ✓</Badge>
                                      )}
                                      {isSelected && !isOptionCorrect && (
                                        <Badge className="bg-red-600 text-white text-xs">Your Answer ✗</Badge>
                                      )}
                                      {!isSelected && isOptionCorrect && (
                                        <Badge className="bg-green-100 text-green-700 text-xs">Correct Answer</Badge>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                            
                            {/* Explanation Section */}
                            {q.explanation && (
                              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 className="font-semibold text-blue-800 mb-2">Explanation:</h5>
                                <p className="text-blue-700 text-sm">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              variant="outline" 
              className="hover:bg-quiz-teal/10"
              onClick={onSaveQuiz}
              disabled={isSaving || savedSessionId !== null}
            >
              {isSaving ? "Saving..." : savedSessionId ? "Saved" : "Save Quiz"}
            </Button>
            <Button 
              variant="outline" 
              className="hover:bg-quiz-teal/10"
              onClick={onShareQuiz}
            >
              Share Quiz
            </Button>
            <Button variant="outline" className="hover:bg-quiz-purple/10">
              Create Study Plan
            </Button>
          </div>

          {/* Generated Quiz URL Display */}
          {shareUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-2">Generated Quiz URL:</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Click this URL to share the quiz with others
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default QuizResults;
