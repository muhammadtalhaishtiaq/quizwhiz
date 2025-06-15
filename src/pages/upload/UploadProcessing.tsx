
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import React from "react";
import Navigation from "@/components/Navigation";

interface UploadProcessingProps {
  processingProgress: number;
  currentQuote: string;
}

const UploadProcessing: React.FC<UploadProcessingProps> = ({ processingProgress, currentQuote }) => {
  // Cap the progress at 90% to show it's still processing even when API call is ongoing
  const displayProgress = Math.min(processingProgress, 90);
  
  return (
    <div className="min-h-screen bg-quiz-bg">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 pt-20">
        <Card className="quiz-card">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 quiz-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-poppins font-bold text-3xl text-quiz-text mb-4">
                AI is Working Its Magic! ✨
              </h2>
              <p className="text-gray-600 mb-8">
                Our AI is analyzing your content and creating personalized study materials...
              </p>
            </div>
            <div className="mb-8">
              <Progress value={displayProgress} className="h-3 mb-4" />
              <p className="text-quiz-purple font-medium">
                {displayProgress}% Complete
              </p>
            </div>
            <div className="bg-quiz-peach/10 border border-quiz-peach-border rounded-xl p-6 animate-fade-in">
              <p className="text-quiz-text font-medium">
                {currentQuote}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadProcessing;
