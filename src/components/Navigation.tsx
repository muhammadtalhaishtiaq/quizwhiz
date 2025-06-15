
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { session, signOut } = useSupabaseAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Upload", path: "/upload" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="mx-auto" style={{ maxWidth: "85rem" }}>
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 quiz-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="font-poppins font-bold text-xl text-quiz-text">
                QuizWhiz
              </span>
            </Link>
            {/* Center: Spacer for flexibility */}
            <div className="flex-1" />
            {/* Right side: Nav items + Auth/User section */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-quiz-purple"
                        : "text-gray-600 hover:text-quiz-purple"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {session ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard")}
                      className="text-gray-600 hover:text-quiz-purple"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={signOut}
                      className="quiz-button"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/auth")}
                      className="text-gray-600 hover:text-quiz-purple"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate("/auth")}
                      className="quiz-button"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-quiz-purple"
                        : "text-gray-600 hover:text-quiz-purple"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  {session ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/dashboard");
                          setIsMenuOpen(false);
                        }}
                        className="justify-start text-gray-600 hover:text-quiz-purple"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="quiz-button"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigate("/auth");
                          setIsMenuOpen(false);
                        }}
                        className="justify-start text-gray-600 hover:text-quiz-purple"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          navigate("/auth");
                          setIsMenuOpen(false);
                        }}
                        className="quiz-button"
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
