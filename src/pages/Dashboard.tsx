import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Dashboard = () => {
  // Mock data - replace with actual data from your backend
  const [stats, setStats] = useState({
    questions: 24,
    flashcards: 18,
    shared: 8
  });

  const [recentQuizzes] = useState([
    { id: 1, title: "Biology Chapter 5", type: "MCQ", date: "2024-01-15", questions: 10 },
    { id: 2, title: "Chemistry Basics", type: "Flashcards", date: "2024-01-14", cards: 15 },
    { id: 3, title: "Physics Laws", type: "MCQ", date: "2024-01-13", questions: 8 },
  ]);

  const chartData = [
    { name: 'Questions', count: stats.questions },
    { name: 'Flashcards', count: stats.flashcards },
    { name: 'Shared', count: stats.shared },
  ];

  return (
    <div className="flex">
      <DashboardSidebar />
      <main className="flex-1 ml-60 p-10">
        <h1 className="font-poppins text-3xl mb-6">Welcome to your Dashboard!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Your Quiz Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Quizzes List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">{quiz.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {quiz.type === 'MCQ' ? `${quiz.questions} Questions` : `${quiz.cards} Cards`}
                        </Badge>
                        <Link 
                          to={`/study-mode/${quiz.id}`} 
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
