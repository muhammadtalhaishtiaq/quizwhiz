
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trophy, Clock, Star, Share2, Copy } from "lucide-react";
import { useState } from "react";

const GroupStudy = () => {
  const [activeTab, setActiveTab] = useState<'join' | 'host' | 'active'>('join');
  const [roomCode, setRoomCode] = useState('');
  const [hostingRoom, setHostingRoom] = useState(false);

  const activeRooms = [
    {
      id: 1,
      name: "Biology Final Prep",
      host: "Sarah Chen",
      players: 8,
      maxPlayers: 12,
      topic: "Cellular Biology",
      difficulty: "Medium",
      timeLeft: "15:30"
    },
    {
      id: 2,
      name: "Chemistry Study Group",
      host: "Mike Rodriguez", 
      players: 5,
      maxPlayers: 10,
      topic: "Organic Chemistry",
      difficulty: "Hard",
      timeLeft: "22:45"
    },
    {
      id: 3,
      name: "Quick Math Review",
      host: "Emma Liu",
      players: 3,
      maxPlayers: 6,
      topic: "Calculus",
      difficulty: "Easy",
      timeLeft: "8:12"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Thompson", score: 950, emoji: "🏆" },
    { rank: 2, name: "Jessica Park", score: 920, emoji: "🥈" },
    { rank: 3, name: "David Kim", score: 880, emoji: "🥉" },
    { rank: 4, name: "You", score: 750, emoji: "😊" },
    { rank: 5, name: "Rachel Green", score: 720, emoji: "😄" },
  ];

  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      console.log("Joining room:", roomCode);
      setActiveTab('active');
    }
  };

  const handleCreateRoom = () => {
    console.log("Creating new room");
    setHostingRoom(true);
    setActiveTab('active');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText('ABC123');
    console.log("Room code copied!");
  };

  if (activeTab === 'active' && hostingRoom) {
    return (
      <div className="min-h-screen bg-quiz-bg flex">
        <DashboardSidebar />
        <div className="flex-1 ml-60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            {/* Room Header */}
            <Card className="quiz-card mb-8 animate-fade-in">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h1 className="font-poppins font-bold text-3xl text-quiz-text mb-2">
                    Biology Study Room
                  </h1>
                  <p className="text-gray-600 mb-4">Waiting for players to join...</p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Badge className="bg-quiz-purple text-white px-4 py-2 text-lg">
                      Room Code: ABC123
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyRoomCode}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      3/8 Players
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Starting in 2:30
                    </span>
                  </div>
                </div>

                {/* Connected Players */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {['You (Host)', 'Sarah Chen', 'Mike Rodriguez'].map((player, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-quiz-purple rounded-full flex items-center justify-center text-white font-medium">
                        {player.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-quiz-text">{player}</p>
                        <p className="text-sm text-gray-600">Ready to play</p>
                      </div>
                      {index === 0 && (
                        <Badge className="bg-quiz-yellow text-quiz-text ml-auto">Host</Badge>
                      )}
                    </div>
                  ))}
                  
                  {/* Empty slots */}
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-400">Waiting for player...</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button className="quiz-button px-8">
                    Start
                  </Button>
                  <Button variant="outline" className="px-8">
                    Room Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-quiz-bg flex">
      <DashboardSidebar />
      <div className="flex-1 ml-60">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        {/* <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 quiz-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
            Group Study Mode
          </h1>
          <p className="text-xl text-gray-600">
            Study together, compete friendly, and learn faster with friends
          </p>
        </div> */}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <Button
              variant={activeTab === 'join' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('join')}
              className={activeTab === 'join' ? 'quiz-button' : ''}
            >
              Join Room
            </Button>
            <Button
              variant={activeTab === 'host' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('host')}
              className={activeTab === 'host' ? 'quiz-button' : ''}
            >
              Host Room
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'join' && (
              <div className="space-y-6">
                {/* Join Room */}
                <Card className="quiz-card animate-scale-in">
                  <CardHeader>
                    <CardTitle className="font-poppins text-center">
                      Join a Study Room
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-quiz-text mb-2">
                          Room Code
                        </label>
                        <Input
                          placeholder="Enter 6-digit room code"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          className="quiz-input text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                      <Button
                        onClick={handleJoinRoom}
                        disabled={roomCode.length !== 6}
                        className="w-full quiz-button text-lg py-3"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Join Room
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Rooms */}
                <Card className="quiz-card animate-slide-up">
                  <CardHeader>
                    <CardTitle className="font-poppins">Active Study Rooms</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {activeRooms.map((room) => (
                        <div key={room.id} className="p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-quiz-text">{room.name}</h3>
                              <p className="text-sm text-gray-600">Hosted by {room.host}</p>
                            </div>
                            <Button size="sm" className="quiz-button">
                              Join
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center text-gray-600">
                                <Users className="w-3 h-3 mr-1" />
                                {room.players}/{room.maxPlayers}
                              </span>
                              <Badge className={getDifficultyColor(room.difficulty)}>
                                {room.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {room.topic}
                              </Badge>
                            </div>
                            <span className="text-quiz-purple font-medium">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {room.timeLeft}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'host' && (
              <Card className="quiz-card animate-scale-in">
                <CardHeader>
                  <CardTitle className="font-poppins text-center">
                    Host a Study Room
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-quiz-text mb-2">
                        Room Name
                      </label>
                      <Input
                        placeholder="My Awesome Study Room"
                        className="quiz-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-quiz-text mb-2">
                        Study Topic
                      </label>
                      <Input
                        placeholder="Biology, Chemistry, Math..."
                        className="quiz-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-quiz-text mb-2">
                          Max Players
                        </label>
                        <Input
                          type="number"
                          placeholder="8"
                          min="2"
                          max="20"
                          className="quiz-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-quiz-text mb-2">
                          Difficulty
                        </label>
                        <select className="quiz-input">
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={handleCreateRoom}
                      className="w-full quiz-button text-lg py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="font-poppins flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-quiz-yellow" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {leaderboard.map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        player.name === 'You' ? 'bg-quiz-purple/10 border border-quiz-purple/20' : 'bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{player.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-quiz-text">{player.name}</p>
                        <p className="text-sm text-gray-600">{player.score} points</p>
                      </div>
                      <Badge variant="outline">#{player.rank}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="quiz-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="font-poppins">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Games Played</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-semibold text-green-600">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-semibold text-quiz-purple">8 wins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Score</span>
                    <span className="font-semibold">780</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card className="quiz-card bg-gradient-to-br from-quiz-yellow/10 to-quiz-teal/10 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <h3 className="font-poppins font-semibold text-quiz-text mb-3">
                  💡 Group Study Tips
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Take turns explaining concepts</li>
                  <li>• Use friendly competition to stay motivated</li>
                  <li>• Share different perspectives on problems</li>
                  <li>• Celebrate team victories! 🎉</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default GroupStudy;
