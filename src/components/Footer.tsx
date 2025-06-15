
import { Button } from "@/components/ui/button";
import { Share2, Users } from "lucide-react";
import { Link } from "react-router-dom";

const pxSection = "px-1 sm:px-1.5 lg:px-2";

const Footer = () => (
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
);

export default Footer;
