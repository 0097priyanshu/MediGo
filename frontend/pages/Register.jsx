import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

/**
 * Premium Register Page component.
 * Allows user registration.
 */
const Register = () => {
  const { register, error, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      console.error("[Register] Sign up failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-teal-50/20 px-4 py-12">
        <Card className="w-full max-w-md border-teal-100/80 shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-3xl font-extrabold text-teal-850 tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-sm text-slate-500 max-w-[280px] mx-auto">
              Register now to start ordering medicines and track deliveries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(localError || error) && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100 transition-all duration-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-650" />
                <p className="font-medium">{localError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-teal-700 transition"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-700 py-6 text-sm font-semibold text-white hover:bg-teal-800 transition-all rounded-xl mt-6 flex justify-center items-center shadow-md hover:shadow-lg disabled:bg-teal-350"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={() => setError(null)}
                className="font-bold text-teal-700 hover:underline hover:text-teal-800 transition"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
