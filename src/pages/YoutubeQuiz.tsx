
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, FileText, HelpCircle, Share2 } from "lucide-react";
import { useState } from "react";

const YoutubeQuiz = () => {
  const [selectedSegment, setSelectedSegment] = useState(0);

  const videoData = {
    title: "Introduction to Photosynthesis - Khan Academy",
    duration: "12:45",
    url: "https://youtube.com/watch?v=example",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
  };

  const timelineSegments = [
    {
      startTime: "0:00",
      endTime: "2:30",
      title: "What is Photosynthesis?",
      summary: "Introduction to the basic concept and importance of photosynthesis in plants",
      flashcards: 4,
      questions: 2,
      difficulty: "easy"
    },
    {
      startTime: "2:30", 
      endTime: "5:45",
      title: "Chemical Equation",
      summary: "Breaking down the chemical equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
      flashcards: 6,
      questions: 3,
      difficulty: "medium"
    },
    {
      startTime: "5:45",
      endTime: "8:20", 
      title: "Light and Dark Reactions",
      summary: "Understanding the two main stages of photosynthesis and where they occur",
      flashcards: 8,
      questions: 4,
      difficulty: "hard"
    },
    {
      startTime: "8:20",
      endTime: "12:45",
      title: "Factors Affecting Photosynthesis",
      summary: "Light intensity, temperature, and CO₂ concentration effects on rate",
      flashcards: 5,
      questions: 3,
      difficulty: "medium"
    }
  ];

  const transcript = `
[0:00] Welcome to this introduction to photosynthesis. Photosynthesis is one of the most important biological processes on Earth.

[0:15] In simple terms, photosynthesis is the process by which plants convert light energy, usually from the sun, into chemical energy stored in glucose.

[0:30] This process not only feeds the plant itself, but also produces oxygen as a byproduct, which is essential for most life on Earth.

[2:30] Let's look at the chemical equation for photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

[2:45] This equation tells us that six molecules of carbon dioxide plus six molecules of water, in the presence of light energy, produce one molecule of glucose and six molecules of oxygen.

[5:45] Photosynthesis actually occurs in two main stages: the light-dependent reactions and the light-independent reactions, also known as the Calvin cycle.

[6:00] The light-dependent reactions occur in the thylakoids of chloroplasts, where light energy is captured and converted into chemical energy.

[8:20] Several factors can affect the rate of photosynthesis, including light intensity, temperature, and carbon dioxide concentration.

[8:35] As light intensity increases, the rate of photosynthesis increases until it reaches a saturation point.
  `;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-quiz-bg">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
            YouTube Lecture Analysis
          </h1>
          <p className="text-xl text-gray-600">
            AI-generated study materials from video content
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Video & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="quiz-card animate-scale-in">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={videoData.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-2xl flex items-center justify-center">
                    <Button className="bg-white/90 text-quiz-purple hover:bg-white">
                      <Play className="w-6 h-6 mr-2" />
                      Play Video
                    </Button>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    {videoData.duration}
                  </Badge>
                </div>
                <div className="p-6">
                  <h2 className="font-poppins font-semibold text-xl text-quiz-text mb-2">
                    {videoData.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Educational content automatically processed by QuizWhiz
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Breakdown */}
            <Card className="quiz-card animate-slide-up">
              <CardHeader>
                <CardTitle className="font-poppins">Content Timeline</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {timelineSegments.map((segment, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedSegment === index
                          ? 'border-quiz-purple bg-quiz-purple/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSegment(index)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-quiz-text mb-1">
                            {segment.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {segment.summary}
                          </p>
                        </div>
                        <Badge className={getDifficultyColor(segment.difficulty)}>
                          {segment.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {segment.startTime} - {segment.endTime}
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {segment.flashcards} cards
                          </span>
                          <span className="flex items-center">
                            <HelpCircle className="w-3 h-3 mr-1" />
                            {segment.questions} questions
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="hover:bg-quiz-purple/10">
                            Study Cards
                          </Button>
                          <Button size="sm" className="quiz-button">
                            Take Quiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Transcript & Actions */}
          <div className="space-y-6">
            {/* Study Options */}
            <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="font-poppins">Study Options</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button className="w-full quiz-button">
                  <FileText className="w-4 h-4 mr-2" />
                  All Flashcards (23)
                </Button>
                <Button variant="outline" className="w-full hover:bg-quiz-teal/10">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Complete Quiz (12Q)
                </Button>
                <Button variant="outline" className="w-full hover:bg-quiz-yellow/10">
                  <Share2 className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
                <Button variant="outline" className="w-full hover:bg-gray-100">
                  Download Transcript
                </Button>
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="font-poppins">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Video Completed</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Flashcards Studied</span>
                      <span>0/23</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quizzes Completed</span>
                      <span>0/4</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transcript Viewer */}
            <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="font-poppins">Video Transcript</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 overflow-y-auto text-sm text-gray-600 space-y-2">
                  {transcript.split('\n').map((line, index) => (
                    <p key={index} className="leading-relaxed">
                      {line.trim() && (
                        <>
                          {line.includes('[') && (
                            <span className="text-quiz-purple font-medium">
                              {line.match(/\[.*?\]/)?.[0]}
                            </span>
                          )}
                          <span className="ml-2">
                            {line.replace(/\[.*?\]/, '').trim()}
                          </span>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="quiz-card bg-gradient-to-br from-quiz-purple/5 to-quiz-teal/5 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="font-poppins">🤖 AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/50 rounded-lg">
                    <p className="font-medium text-quiz-text mb-1">Key Concepts Identified:</p>
                    <p className="text-gray-600">Photosynthesis equation, light reactions, Calvin cycle</p>
                  </div>
                  
                  <div className="p-3 bg-white/50 rounded-lg">
                    <p className="font-medium text-quiz-text mb-1">Estimated Study Time:</p>
                    <p className="text-gray-600">45-60 minutes for full mastery</p>
                  </div>
                  
                  <div className="p-3 bg-white/50 rounded-lg">
                    <p className="font-medium text-quiz-text mb-1">Difficulty Level:</p>
                    <p className="text-gray-600">Intermediate - requires basic biology knowledge</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeQuiz;
