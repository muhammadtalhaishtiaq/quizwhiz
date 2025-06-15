
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useState } from "react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  selectedAnswer: string;
  onSelectAnswer: (val: string) => void;
  showCorrect: boolean;
  setShowCorrect: (show: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  correct,
  explanation,
  selectedAnswer,
  onSelectAnswer,
  showCorrect,
  setShowCorrect,
}) => {
  console.log('QuizQuestion Debug:', {
    correct,
    showCorrect,
    selectedAnswer,
    options: options.length
  });

  return (
    <Card className="quiz-card mb-8 animate-scale-in">
      <CardContent className="p-8">
        <h2 className="font-poppins font-semibold text-2xl text-quiz-text mb-8 leading-relaxed">
          {question}
        </h2>
        <RadioGroup
          value={selectedAnswer}
          onValueChange={onSelectAnswer}
          className="space-y-4"
        >
          {options.map((option, index) => {
            const isSelected = selectedAnswer === index.toString();
            const isCorrect = index === correct;

            console.log(`Option ${index}:`, {
              option,
              isSelected,
              isCorrect,
              showCorrect,
              shouldHighlight: showCorrect && isCorrect
            });

            // Highlighting logic - simplified and more explicit
            let optionClasses = "flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 group cursor-pointer min-h-[60px]";
            
            if (showCorrect && isCorrect) {
              // Highlight correct answer when toggle is ON - make it very visible
              optionClasses += " border-green-500 bg-green-100 border-2 border-l-8 border-l-green-500 shadow-lg";
            } else if (isSelected) {
              // User's selected answer
              optionClasses += " border-quiz-purple bg-quiz-purple/5 border-2";
            } else {
              // Default state
              optionClasses += " border-gray-200 bg-white border-2 hover:border-blue-300";
            }

            return (
              <div
                key={index}
                className={optionClasses}
                onClick={() => {
                  onSelectAnswer(index.toString());
                }}
                data-testid={`option-row-${index}`}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  disabled={false}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex-1 cursor-pointer text-lg select-none ${
                    showCorrect && isCorrect ? "text-green-900 font-bold" : ""
                  }`}
                >
                  {option}
                </Label>
                {/* Show check mark only on correct option when toggle is ON */}
                {showCorrect && isCorrect && (
                  <span className="ml-2 flex items-center font-semibold text-green-600 text-sm animate-fade-in">
                    <Check className="w-5 h-5 mr-1 text-green-600" /> Correct
                  </span>
                )}
              </div>
            );
          })}
        </RadioGroup>

        {/* Show correct toggle */}
        <div className="flex items-center gap-3 mt-8">
          <Switch
            id="show-correct"
            checked={showCorrect}
            onCheckedChange={setShowCorrect}
            style={{
              backgroundColor: showCorrect ? "#ffe600" : undefined,
              borderColor: showCorrect ? "#cccc00" : undefined,
            }}
            data-testid="show-correct-switch"
          />
          <Label htmlFor="show-correct" className="font-medium text-gray-650">
            Show correct option
          </Label>
        </div>

        {/* Debug info - remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 text-xs">
            Debug: correct={correct}, showCorrect={showCorrect}, selectedAnswer={selectedAnswer}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
