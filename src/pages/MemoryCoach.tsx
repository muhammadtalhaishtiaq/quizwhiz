
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Brain, TrendingUp, Calendar, Volume1, Target, Zap } from "lucide-react";

const MemoryCoach = () => {
  const retentionData = [
    { topic: "Photosynthesis", strength: 85, lastReviewed: "2 days ago", nextReview: "Today" },
    { topic: "Cell Division", strength: 65, lastReviewed: "5 days ago", nextReview: "Tomorrow" },
    { topic: "DNA Structure", strength: 90, lastReviewed: "1 day ago", nextReview: "3 days" },
    { topic: "Genetics", strength: 45, lastReviewed: "1 week ago", nextReview: "Now" },
  ];

  const weeklySchedule = [
    { day: "Mon", sessions: 3, completed: 3 },
    { day: "Tue", sessions: 2, completed: 2 },
    { day: "Wed", sessions: 4, completed: 1 },
    { day: "Thu", sessions: 3, completed: 0 },
    { day: "Fri", sessions: 2, completed: 0 },
    { day: "Sat", sessions: 1, completed: 0 },
    { day: "Sun", sessions: 2, completed: 0 },
  ];

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600 bg-green-100";
    if (strength >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return "Strong";
    if (strength >= 60) return "Moderate";
    return "Weak";
  };

  return (
    <div className="min-h-screen bg-quiz-bg flex">
      <DashboardSidebar />
      <div className="flex-1 ml-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Header */}
          {/* <div className="text-center mb-12 animate-fade-in">
            <div className="w-16 h-16 quiz-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
              Memory Coach Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered spaced repetition for optimal learning retention
            </p>
          </div> */}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="quiz-card animate-scale-in">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-quiz-purple mx-auto mb-3" />
                    <h3 className="font-semibold text-quiz-text mb-2">Retention Score</h3>
                    <p className="text-3xl font-bold text-quiz-purple">78%</p>
                    <p className="text-sm text-green-600">↗ +5% this week</p>
                  </CardContent>
                </Card>

                <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-quiz-teal mx-auto mb-3" />
                    <h3 className="font-semibold text-quiz-text mb-2">Study Streak</h3>
                    <p className="text-3xl font-bold text-quiz-teal">12</p>
                    <p className="text-sm text-gray-600">days in a row</p>
                  </CardContent>
                </Card>

                <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="p-6 text-center">
                    <Zap className="w-8 h-8 text-quiz-yellow mx-auto mb-3" />
                    <h3 className="font-semibold text-quiz-text mb-2">Cards Mastered</h3>
                    <p className="text-3xl font-bold text-quiz-yellow">156</p>
                    <p className="text-sm text-gray-600">out of 200</p>
                  </CardContent>
                </Card>
              </div>

              {/* Topic Heatmap */}
              <Card className="quiz-card animate-slide-up">
                <CardHeader>
                  <CardTitle className="font-poppins">Knowledge Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {retentionData.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-quiz-text">{topic.topic}</h4>
                            <Badge className={getStrengthColor(topic.strength)}>
                              {getStrengthLabel(topic.strength)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Last reviewed: {topic.lastReviewed}</span>
                            <span>Next review: {topic.nextReview}</span>
                          </div>
                          <Progress value={topic.strength} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Schedule */}
              <Card className="quiz-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    This Week's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-2">
                    {weeklySchedule.map((day, index) => (
                      <div key={index} className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
                        <div className="space-y-1">
                          {[...Array(day.sessions)].map((_, sessionIndex) => (
                            <div
                              key={sessionIndex}
                              className={`h-3 rounded ${
                                sessionIndex < day.completed
                                  ? 'bg-quiz-purple'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {day.completed}/{day.sessions}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Controls */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full quiz-button">
                    <Volume1 className="w-4 h-4 mr-2" />
                    Voice Flashcard Practice
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-quiz-teal/10">
                    Review Weak Areas
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-quiz-yellow/10">
                    Generate Study Plan
                  </Button>
                  <Button variant="outline" className="w-full hover:bg-gray-100">
                    Export Progress Report
                  </Button>
                </CardContent>
              </Card>

              {/* Difficulty Controls */}
              <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins">Study Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="text-sm font-medium text-quiz-text mb-2 block">
                      Difficulty Level
                    </label>
                    <Slider
                      defaultValue={[70]}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Easy</span>
                      <span>Hard</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-quiz-text mb-2 block">
                      Daily Study Goal
                    </label>
                    <Slider
                      defaultValue={[30]}
                      max={120}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>15 min</span>
                      <span>2 hours</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-quiz-text mb-2 block">
                      Review Frequency
                    </label>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={25}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Less</span>
                      <span>More</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins">Retention Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-32 bg-gradient-to-t from-quiz-purple/10 to-quiz-teal/10 rounded-lg flex items-end justify-center space-x-1 p-4">
                    {[65, 70, 68, 75, 73, 78, 82].map((height, index) => (
                      <div
                        key={index}
                        className="bg-quiz-purple rounded-t"
                        style={{
                          height: `${height}%`,
                          width: '12px'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Steady improvement over the last 7 days! 📈
                  </p>
                </CardContent>
              </Card>

              {/* Motivational Quote */}
              <Card className="quiz-card bg-gradient-to-br from-quiz-purple/5 to-quiz-teal/5 animate-scale-in" style={{ animationDelay: '0.6s' }}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-poppins font-semibold text-quiz-text mb-2">
                    Daily Motivation
                  </h3>
                  <p className="text-gray-600 italic">
                    "The expert in anything was once a beginner who refused to give up."
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- Helen Hayes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryCoach;
