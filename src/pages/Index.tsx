import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowUp, Upload, Search, Share2, Users, Clock, Star, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Import the robot illustration
import robotStudentImg from "/lovable-uploads/729758e3-6aff-4c75-a19f-791bf0fd4acc.png";

const Index = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Upload,
      title: "Upload Your Materials",
      description: "Drop PDFs, slides, or paste YouTube lecture links"
    },
    {
      icon: Search,
      title: "AI Processing",
      description: "Our AI analyzes and creates smart study content"
    },
    {
      icon: Star,
      title: "Study & Master",
      description: "Use flashcards, quizzes, and memory coaching"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "QuizWhiz helped me ace my anatomy exam! The flashcards generated from my lecture videos were spot-on.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Student",
      content: "The memory coach feature is incredible. It knows exactly when to review concepts for maximum retention.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Psychology Major",
      content: "Group study mode made studying with classmates so much more engaging and competitive.",
      rating: 5
    }
  ];

  const trustBadges = [
    "University of Stanford",
    "MIT OpenCourseWare",
    "Harvard Extension",
    "Khan Academy",
    "Coursera"
  ];

  // Use reduced padding variables
  const pxSection = "px-1 sm:px-1.5 lg:px-2";

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeUrl.trim()) {
      // Navigate to upload page with the YouTube URL
      navigate('/upload', { state: { youtubeUrl: youtubeUrl.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-quiz-bg">
      <Navigation />

      {/* Hero Section: Two-column above fold */}
      <section className={`max-w-7xl mx-auto ${pxSection} pt-20 pb-16`}>
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center md:items-start animate-fade-in">
          {/* Left: Main text, badge, upload, YouTube input */}
          <div className="w-full md:w-1/2">
            <Badge className="mb-6 bg-quiz-purple/10 text-quiz-purple border-quiz-purple/20">
              ✨ AI-Powered Learning
            </Badge>

            <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-quiz-text mb-4 leading-tight">
              <span className="block">
                Transform Your Study<br />
                <span className="text-quiz-teal">Materials</span>
              </span>
              <span className="block">
                Into Smart Quizzes
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              AI-powered learning: Upload content to generate personalized study materials.
            </p>

            {/* Upload CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link to="/upload">
                <Button className="quiz-button text-base md:text-lg px-8 py-4 animate-bounce-gentle">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your Notes
                </Button>
              </Link>
            </div>

            {/* YouTube URL Input */}
            <div className="mt-3">
              <label className="block text-quiz-text mb-2 font-medium">
                Or paste a YouTube lecture link:
              </label>
              <form
                className="flex group relative items-center"
                onSubmit={handleYoutubeSubmit}
              >
                <Input
                  className="rounded-l-xl text-base bg-white border-quiz-peach hover:border-quiz-teal focus:border-quiz-purple shadow-none border-2 placeholder:text-gray-400 transition focus-visible:ring-0"
                  type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  style={{ borderRight: "none" }}
                />
                <Button
                  size="icon"
                  className="rounded-r-xl border-t-2 border-b-2 border-r-2 border-quiz-peach border-l-0  hover:bg-quiz-peach/80 hover:scale-105 transition ml-[-2px]"
                  type="submit"
                  disabled={!youtubeUrl.trim()}
                >
                  <Play className="w-6 h-6 text-quiz-text" />
                </Button>
              </form>
            </div>

            {/* Small stats below hero */}
            <div className="flex gap-8 mt-10 md:mt-12">
              <div>
                <p className="font-poppins  text-2xl font-bold leading-snug">50K+</p>
                <p className="text-gray-600 text-xs uppercase font-medium">Students</p>
              </div>
              <div>
                <p className="font-poppins text-quiz-teal text-2xl font-bold leading-snug">1M+</p>
                <p className="text-gray-600 text-xs uppercase font-medium">Flashcards Created</p>
              </div>
              <div>
                <p className="font-poppins  text-2xl font-bold leading-snug">95%</p>
                <p className="text-gray-600 text-xs uppercase font-medium">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right: Robot & student illustration card */}
          <div className="w-full md:w-1/2 flex justify-center items-center mb-10 md:mb-0">
            {/* <Card className="quiz-card bg-white border-quiz-peach-border p-0 shadow-2xl" */}
              {/* style={{ maxWidth: "420px", minHeight: "340px" }}
            > */}
              {/* <CardContent className="flex items-center justify-center p-3 h-full"> */}
                <img
                  src={robotStudentImg}
                  alt="Robot high-fiving student - AI studying"
                  className="rounded-xl w-full h-auto object-contain"
                  style={{ maxHeight: "400px" }}
                />
              {/* </CardContent> */}
            {/* </Card> */}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`max-w-7xl mx-auto ${pxSection} py-16`}>
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to transform your studying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-quiz-peach-border bg-quiz-peach text-black hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 quiz-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-poppins font-semibold text-xl text-quiz-text mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className={`max-w-7xl mx-auto ${pxSection}`}>
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl text-quiz-text mb-4">
              Loved by Students Everywhere
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students who've transformed their study habits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-quiz-peach-border bg-quiz-peach text-black"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-quiz-almond fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-800 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-medium text-quiz-text">{testimonial.name}</p>
                    <p className="text-sm text-gray-700">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className={`max-w-7xl mx-auto ${pxSection} py-16`}>
        <div className="text-center mb-12">
          <h3 className="font-poppins font-semibold text-2xl text-quiz-text mb-4">
            Trusted by Students at Top Universities
          </h3>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {trustBadges.map((badge, index) => (
            <div key={index} className="px-6 py-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium">{badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="quiz-gradient py-16">
        <div className="max-w-4xl mx-auto px-1 sm:px-1.5 lg:px-2 text-center">
          <h2 className="font-poppins font-bold text-4xl text-white mb-6">
            Ready to Ace Your Next Exam?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who've already transformed their study habits with AI
          </p>
          <Link to="/upload">
            <Button className="bg-white text-quiz-purple hover:bg-gray-100 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200">
              Start Studying Smarter Today
              <ArrowUp className="w-5 h-5 ml-2 rotate-45" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-quiz-text text-white py-12">
        <div className={`max-w-7xl mx-auto ${pxSection}`}>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 quiz-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Q</span>
                </div>
                <span className="font-poppins font-bold text-xl">QuizWhiz</span>
              </div>
              <p className="text-gray-400">
                AI-powered study tools for the next generation of learners.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/flashcards" className="hover:text-white">Flashcards</Link></li>
                <li><Link to="/quiz" className="hover:text-white">Quizzes</Link></li>
                <li><Link to="/memory-coach" className="hover:text-white">Memory Coach</Link></li>
                <li><Link to="/group-study" className="hover:text-white">Group Study</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Users className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuizWhiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
