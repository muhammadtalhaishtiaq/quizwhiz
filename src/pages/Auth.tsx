
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      setLoading(false);
      return;
    }

    if (isLogin) {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
      if (!error) navigate("/dashboard", { replace: true });
    } else {
      // Signup (always add emailRedirectTo as required)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/dashboard" }
      });
      if (error) setErrorMsg(error.message);
      if (!error) setErrorMsg("Check your email for a confirmation link!");
    }
    setLoading(false);
  };

  // const handleGoogle = async () => {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: { redirectTo: window.location.origin + "/dashboard" }
  //   });
  //   if (error) setErrorMsg(error.message);
  //   setLoading(false);
  //   // Actual redirect happens outside, Supabase will handle OAuth flow
  // };

  return (
    <div className="min-h-screen flex flex-col bg-quiz-bg">
      <Navigation />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg my-12">
          <h2 className="text-2xl font-bold text-center font-poppins mb-1">{isLogin ? "Sign In" : "Create Account"}</h2>
          <p className="text-center text-gray-500 mb-6">
            {isLogin ? "Welcome back to QuizWhiz!" : "Start your learning journey."}
          </p>
          {errorMsg && <div className="text-destructive mb-4 text-center">{errorMsg}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                autoComplete={isLogin ? "current-password" : "new-password"}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full quiz-button"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : isLogin ? <LogIn className="mr-2" /> : <User className="mr-2" />}
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          {/* 
          <div className="flex items-center my-5">
            <span className="w-full border-t border-gray-200"></span>
            <span className="px-3 text-xs text-gray-400">OR</span>
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <Button
            type="button"
            className="w-full bg-white text-black border-gray-200 border hover:bg-gray-100 font-medium"
            disabled={loading}
            onClick={handleGoogle}
            variant="outline"
          >
            <span className="mr-2 text-xl">🌐</span> Continue with Google
          </Button>
          */}
          <div className="text-sm text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-quiz-purple font-semibold hover:underline"
              onClick={() => { setIsLogin((v) => !v); setErrorMsg(""); }}
              type="button"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
