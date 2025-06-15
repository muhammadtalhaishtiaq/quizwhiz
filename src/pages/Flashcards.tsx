import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Volume1, Shuffle, ArrowDown, ArrowUp, RotateCcw, Share2, Copy } from "lucide-react";
import { useState } from "react";
import { saveFlashcardSession } from "@/services/quizService";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsProps {
  flashcards?: Flashcard[];
}

const Flashcards: React.FC<FlashcardsProps> = ({ flashcards }) => {
  // Use props.flashcards if provided, otherwise fallback to demo cards
  const data = flashcards && flashcards.length
    ? flashcards.map((fc, i) => ({
        id: i + 1,
        topic: "",
        chapter: "",
        front: fc.front,
        back: fc.back,
        difficulty: undefined,
      }))
    : [
        {
          id: 1,
          topic: "Photosynthesis",
          chapter: "Chapter 3: Plant Biology",
          front: "What is the chemical equation for photosynthesis?",
          back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis process converts carbon dioxide and water into glucose and oxygen using light energy.",
          difficulty: "medium"
        },
        {
          id: 2,
          topic: "Cell Division",
          chapter: "Chapter 4: Cell Biology", 
          front: "What are the main phases of mitosis?",
          back: "1. Prophase - Chromosomes condense\n2. Metaphase - Chromosomes align at center\n3. Anaphase - Chromosomes separate\n4. Telophase - Nuclear membranes reform",
          difficulty: "hard"
        },
        {
          id: 3,
          topic: "DNA Structure",
          chapter: "Chapter 5: Genetics",
          front: "What are the four bases in DNA?",
          back: "Adenine (A), Thymine (T), Guanine (G), and Cytosine (C)\n\nA pairs with T, and G pairs with C through hydrogen bonds.",
          difficulty: "easy"
        }
      ];

  const { toast } = useToast();
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCard < data.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
      setDifficulty(null);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
      setDifficulty(null);
    }
  };

  const handleDifficultyRating = (rating: 'easy' | 'medium' | 'hard') => {
    setDifficulty(rating);
    console.log(`Card ${data[currentCard].id} rated as ${rating}`);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setCurrentCard(randomIndex);
    setIsFlipped(false);
    setDifficulty(null);
  };

  const handleGoToStart = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setDifficulty(null);
  };

  const handleSaveFlashcards = async () => {
    if (!data.length) return;
    
    setIsSaving(true);
    try {
      const sessionId = await saveFlashcardSession(
        `Flashcards - ${new Date().toLocaleDateString()}`,
        "Study Cards",
        data.map(card => ({
          front: card.front,
          back: card.back
        })),
        true // Make it public so it can be shared
      );
      
      setSavedSessionId(sessionId);
      toast({
        title: "Flashcards Saved!",
        description: "Your flashcards have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareFlashcards = async () => {
    if (!savedSessionId) {
      // Save first if not saved
      await handleSaveFlashcards();
      return;
    }

    const shareUrl = `${window.location.origin}/flashcards?session=${savedSessionId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Flashcard share link has been copied to your clipboard.",
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
      const shareUrl = `${window.location.origin}/flashcards?session=${savedSessionId}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Flashcard share link has been copied to your clipboard.",
      });
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const currentFlashcard = data[currentCard];
  const progress = ((currentCard + 1) / data.length) * 100;
  const isLastCard = currentCard === data.length - 1;
  const shareUrl = savedSessionId ? `${window.location.origin}/flashcards?session=${savedSessionId}` : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
          Flashcards
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <Badge className="bg-quiz-purple/10 text-quiz-purple">
            {currentFlashcard.chapter}
          </Badge>
          <Badge className="bg-quiz-teal/10 text-quiz-teal">
            {currentFlashcard.topic}
          </Badge>
        </div>
        
        {/* Progress */}
        <div className="max-w-md mx-auto mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentCard + 1} of {data.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={handleShuffle}
          className="hover:bg-quiz-purple/10"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle
        </Button>
        
        <Button
          variant="outline"
          onClick={() => speakText(isFlipped ? currentFlashcard.back : currentFlashcard.front)}
          className="hover:bg-quiz-teal/10"
        >
          <Volume1 className="w-4 h-4 mr-2" />
          Listen
        </Button>

        <Button
          variant="outline"
          onClick={handleSaveFlashcards}
          disabled={isSaving || savedSessionId !== null}
          className="hover:bg-quiz-purple/10"
        >
          {isSaving ? "Saving..." : savedSessionId ? "Saved" : "Save"}
        </Button>

        <Button
          variant="outline"
          onClick={handleShareFlashcards}
          className="hover:bg-quiz-teal/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Generated URL Display */}
      {shareUrl && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border max-w-2xl mx-auto">
          <h4 className="font-medium text-gray-800 mb-2">Generated Flashcard URL:</h4>
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
            Click this URL to share the flashcards with others
          </p>
        </div>
      )}

      {/* Flashcard */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <Card 
          className={`quiz-card cursor-pointer transition-all duration-500 transform ${isFlipped ? 'animate-flip' : ''} hover:shadow-xl`}
          onClick={handleCardClick}
        >
          <CardContent className="p-12 text-center min-h-[300px] flex flex-col justify-center">
            {!isFlipped ? (
              <>
                <div className="mb-6">
                  <Badge className="bg-quiz-purple text-white mb-4">Question</Badge>
                  <h2 className="font-poppins font-semibold text-2xl text-quiz-text leading-relaxed">
                    {currentFlashcard.front}
                  </h2>
                </div>
                <p className="text-gray-500 text-sm">
                  Click to reveal answer
                </p>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <Badge className="bg-quiz-teal text-white mb-4">Answer</Badge>
                  <div className="text-left">
                    <pre className="font-inter text-quiz-text whitespace-pre-wrap leading-relaxed">
                      {currentFlashcard.back}
                    </pre>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  How well did you know this?
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Difficulty Rating (only shown when flipped) */}
        {isFlipped && (
          <div className="flex justify-center gap-4 mt-6 animate-fade-in">
            <Button
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              onClick={() => handleDifficultyRating('hard')}
              className={difficulty === 'hard' ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-red-50 hover:border-red-200'}
            >
              Hard
            </Button>
            <Button
              variant={difficulty === 'medium' ? 'default' : 'outline'}
              onClick={() => handleDifficultyRating('medium')}
              className={difficulty === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' : 'hover:bg-yellow-50 hover:border-yellow-200'}
            >
              Medium
            </Button>
            <Button
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              onClick={() => handleDifficultyRating('easy')}
              className={difficulty === 'easy' ? 'bg-green-500 hover:bg-green-600' : 'hover:bg-green-50 hover:border-green-200'}
            >
              Easy
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCard === 0}
          className="px-8 py-3"
        >
          <ArrowDown className="w-4 h-4 mr-2 rotate-90" />
          Previous
        </Button>
        
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Press space or click card to flip
          </p>
        </div>
        
        {isLastCard ? (
          <Button
            onClick={handleGoToStart}
            className="quiz-button px-8 py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Go to Start
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="quiz-button px-8 py-3"
          >
            Next
            <ArrowUp className="w-4 h-4 ml-2 rotate-90" />
          </Button>
        )}
      </div>

      {/* Study Tips */}
      <Card className="quiz-card mt-12 animate-slide-up">
        <CardContent className="p-6 text-center">
          <h3 className="font-poppins font-semibold text-lg text-quiz-text mb-4">
            💡 Study Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium text-quiz-text mb-1">Active Recall</p>
              <p>Try to answer before flipping the card</p>
            </div>
            <div>
              <p className="font-medium text-quiz-text mb-1">Spaced Repetition</p>
              <p>Review harder cards more frequently</p>
            </div>
            <div>
              <p className="font-medium text-quiz-text mb-1">Understanding</p>
              <p>Focus on concepts, not just memorization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Flashcards;
