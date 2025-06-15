
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Target, Settings as SettingsIcon, Shield, Palette } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Alex Student",
    email: "alex.student@email.com",
    university: "State University",
    major: "Biology"
  });

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    weeklyProgress: true,
    achievements: true,
    groupInvites: true,
    emailDigest: false
  });

  const [studyGoals, setStudyGoals] = useState({
    dailyMinutes: 30,
    weeklyDays: 5,
    flashcardsPerDay: 20,
    quizzesPerWeek: 3
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    soundEffects: true,
    autoplay: false,
    difficulty: "medium"
  });

  const handleProfileUpdate = () => {
    console.log("Profile updated:", profile);
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleGoalUpdate = (key: string, value: number) => {
    setStudyGoals(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-quiz-bg">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 quiz-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-600">
            Customize your QuizWhiz experience
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Study Goals
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="quiz-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-poppins">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="text-xl bg-quiz-purple text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload a profile picture
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="university">University/School</Label>
                      <Input
                        id="university"
                        value={profile.university}
                        onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="major">Major/Field of Study</Label>
                      <Input
                        id="major"
                        value={profile.major}
                        onChange={(e) => setProfile(prev => ({ ...prev, major: e.target.value }))}
                        className="quiz-input"
                      />
                    </div>
                  </div>

                  <Button onClick={handleProfileUpdate} className="w-full quiz-button">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins">Account Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-quiz-purple/10 rounded-lg">
                        <p className="text-2xl font-bold text-quiz-purple">156</p>
                        <p className="text-sm text-gray-600">Cards Mastered</p>
                      </div>
                      <div className="text-center p-4 bg-quiz-teal/10 rounded-lg">
                        <p className="text-2xl font-bold text-quiz-teal">24</p>
                        <p className="text-sm text-gray-600">Quizzes Taken</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-quiz-yellow/10 rounded-lg">
                        <p className="text-2xl font-bold text-quiz-yellow">12</p>
                        <p className="text-sm text-gray-600">Day Streak</p>
                      </div>
                      <div className="text-center p-4 bg-green-100 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">87%</p>
                        <p className="text-sm text-gray-600">Accuracy</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-quiz-text">Recent Achievements</h4>
                      <div className="space-y-2">
                        <Badge className="w-full justify-start bg-quiz-purple/10 text-quiz-purple">
                          🏆 Study Master - 10 day streak
                        </Badge>
                        <Badge className="w-full justify-start bg-quiz-teal/10 text-quiz-teal">
                          🎯 Quiz Champion - 90% accuracy
                        </Badge>
                        <Badge className="w-full justify-start bg-quiz-yellow/10 text-quiz-yellow">
                          ⚡ Speed Learner - 100 cards/day
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="quiz-card animate-scale-in">
              <CardHeader>
                <CardTitle className="font-poppins">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Study Reminders</h4>
                      <p className="text-sm text-gray-600">Get reminded to review your flashcards</p>
                    </div>
                    <Switch
                      checked={notifications.studyReminders}
                      onCheckedChange={() => handleNotificationToggle('studyReminders')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Weekly Progress</h4>
                      <p className="text-sm text-gray-600">Summary of your learning progress</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyProgress}
                      onCheckedChange={() => handleNotificationToggle('weeklyProgress')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Achievement Notifications</h4>
                      <p className="text-sm text-gray-600">When you unlock new badges</p>
                    </div>
                    <Switch
                      checked={notifications.achievements}
                      onCheckedChange={() => handleNotificationToggle('achievements')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Group Study Invites</h4>
                      <p className="text-sm text-gray-600">When friends invite you to study groups</p>
                    </div>
                    <Switch
                      checked={notifications.groupInvites}
                      onCheckedChange={() => handleNotificationToggle('groupInvites')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Email Digest</h4>
                      <p className="text-sm text-gray-600">Daily email with study recommendations</p>
                    </div>
                    <Switch
                      checked={notifications.emailDigest}
                      onCheckedChange={() => handleNotificationToggle('emailDigest')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Goals Tab */}
          <TabsContent value="goals">
            <Card className="quiz-card animate-scale-in">
              <CardHeader>
                <CardTitle className="font-poppins">Study Goals</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="daily-minutes">Daily Study Time (minutes)</Label>
                      <Input
                        id="daily-minutes"
                        type="number"
                        min="15"
                        max="180"
                        value={studyGoals.dailyMinutes}
                        onChange={(e) => handleGoalUpdate('dailyMinutes', parseInt(e.target.value))}
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weekly-days">Study Days per Week</Label>
                      <Input
                        id="weekly-days"
                        type="number"
                        min="1"
                        max="7"
                        value={studyGoals.weeklyDays}
                        onChange={(e) => handleGoalUpdate('weeklyDays', parseInt(e.target.value))}
                        className="quiz-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="daily-flashcards">Flashcards per Day</Label>
                      <Input
                        id="daily-flashcards"
                        type="number"
                        min="5"
                        max="100"
                        value={studyGoals.flashcardsPerDay}
                        onChange={(e) => handleGoalUpdate('flashcardsPerDay', parseInt(e.target.value))}
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weekly-quizzes">Quizzes per Week</Label>
                      <Input
                        id="weekly-quizzes"
                        type="number"
                        min="1"
                        max="10"
                        value={studyGoals.quizzesPerWeek}
                        onChange={(e) => handleGoalUpdate('quizzesPerWeek', parseInt(e.target.value))}
                        className="quiz-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-quiz-purple/10 rounded-lg">
                  <h4 className="font-medium text-quiz-text mb-2">Your Current Goals</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Study {studyGoals.dailyMinutes} minutes daily</li>
                    <li>• Be active {studyGoals.weeklyDays} days per week</li>
                    <li>• Review {studyGoals.flashcardsPerDay} flashcards daily</li>
                    <li>• Complete {studyGoals.quizzesPerWeek} quizzes weekly</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="quiz-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-poppins">App Preferences</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, darkMode: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Sound Effects</h4>
                      <p className="text-sm text-gray-600">Play sounds for interactions</p>
                    </div>
                    <Switch
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, soundEffects: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-quiz-text">Auto-play Videos</h4>
                      <p className="text-sm text-gray-600">Automatically start video lectures</p>
                    </div>
                    <Switch
                      checked={preferences.autoplay}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoplay: checked }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Default Difficulty Level</Label>
                    <select 
                      id="difficulty"
                      value={preferences.difficulty}
                      onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="quiz-input mt-2"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="adaptive">Adaptive (AI chooses)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="font-poppins flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Privacy Policy
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    Terms of Service
                  </Button>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
