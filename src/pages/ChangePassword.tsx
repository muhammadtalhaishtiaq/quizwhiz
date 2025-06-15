import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMsg(error.message);
    else setMsg("Password updated successfully!");
    setLoading(false);
    setPassword("");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-quiz-bg">
      <div className="bg-white px-8 py-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 font-poppins text-quiz-purple">Change Password</h2>
        <form onSubmit={handleChange} className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button className="w-full quiz-button" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
          </Button>
        </form>
        {msg && <div className={`mt-4 text-center ${msg.includes("success") ? "text-green-600" : "text-destructive"}`}>{msg}</div>}
      </div>
    </div>
  );
};

export default ChangePassword;
