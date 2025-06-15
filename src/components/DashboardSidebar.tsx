
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, Home, Brain, Users, Settings, Lock } from "lucide-react"; // Fixed import
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useState } from "react";

const menu = [
  { label: "Dashboard", to: "/dashboard", icon: <Home className="w-5 h-5 mr-2" /> },
  { label: "Memory Coach", to: "/memory-coach", icon: <Brain className="w-5 h-5 mr-2" /> },
  { label: "Group Study", to: "/group-study", icon: <Users className="w-5 h-5 mr-2" /> }
];

const DashboardSidebar = () => {
  const { signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-100 flex flex-col py-8 px-4 fixed top-0 left-0 z-30">
      <div className="flex items-center mb-8 space-x-2">
        <div className="w-8 h-8 quiz-gradient rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">Q</span>
        </div>
        <span className="font-poppins font-bold text-xl text-quiz-text">
         <Link to="/">QuizWhiz</Link>
        </span>
      </div>
      <nav className="flex-1">
        {menu.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center px-3 py-2 rounded-lg mb-1 font-medium transition-colors ${
              location.pathname === item.to
                ? "bg-quiz-purple/10 text-quiz-purple"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <div className="mt-6 border-t border-gray-200 pt-2">
          <Button
            className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            variant="ghost"
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings className="w-5 h-5 mr-2" /> Account
          </Button>
          {showSettings && (
            <div className="ml-7 space-y-1 mt-2">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start px-3 py-2 text-quiz-purple"
                onClick={() => navigate("/profile")}
              >
                <User className="w-4 h-4 mr-2" /> Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start px-3 py-2 text-quiz-purple"
                onClick={() => navigate("/change-password")}
              >
                <Lock className="w-4 h-4 mr-2" /> Change Password
              </Button>
            </div>
          )}
        </div>
      </nav>
      <Button
        className="flex items-center justify-start px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 mt-auto"
        variant="ghost"
        onClick={signOut}
      >
        <LogOut className="w-5 h-5 mr-2" /> Logout
      </Button>
    </aside>
  );
};

export default DashboardSidebar;
