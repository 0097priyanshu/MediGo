import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

/**
 * Premium Login page containing traditional credential sign-in and redirect to Google OAuth role selection.
 */
const Login = () => {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError(null);

    if (!email || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      // Traditional redirect based on role
      const user = data.user;
      if (user.role === "store") {
        if (!user.shopName || !user.isApproved) {
          navigate("/store-registration");
        } else {
          navigate("/store-dashboard");
        }
      } else if (user.role === "delivery") {
        navigate("/delivery-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("[Login] Traditional authentication failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    setError(null);
    setLocalError("");
    navigate("/role-selection", { state: { from: location.state?.from } });
  };

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-teal-50/20 px-4 py-12">
        <Card className="w-full max-w-md border-teal-100/80 shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-3xl font-extrabold text-teal-850 tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-sm text-slate-500 max-w-[280px] mx-auto">
              Access your medical accounts, dispatches, or manage your pharmacy store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(localError || error) && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100 transition-all duration-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-650" />
                <p className="font-medium">{localError || error}</p>
              </div>
            )}

            {/* Google Authentication Trigger */}
            <Button
              onClick={handleGoogleRedirect}
              type="button"
              className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-6 text-sm font-semibold rounded-xl flex justify-center items-center shadow-sm gap-2"
            >
              {/* Decorative Google logo symbol */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.99 1 12 1 7.24 1 3.21 3.73 1.25 7.72l3.89 3.02C6.07 7.7 8.82 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.11 2.73-2.37 3.58l3.69 2.87c2.16-1.99 3.41-4.91 3.41-8.6z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.14 14.74c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.25 7.72C.45 9.34 0 11.12 0 13s.45 3.66 1.25 5.28l3.89-3.54z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.96 1.09-3.18 0-5.93-2.66-6.89-5.71l-3.89 3.02C3.21 20.27 7.24 23 12 23z"
                />
              </svg>
              Sign In with Google
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100" />
              </div>
              <span className="relative bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Or Continue With
              </span>
            </div>

            {/* Traditional Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-teal-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50"
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

              <Button
                type="submit"
                className="w-full bg-teal-700 py-6 text-sm font-semibold text-white hover:bg-teal-800 transition-all rounded-xl mt-6 flex justify-center items-center shadow-md hover:shadow-lg disabled:bg-teal-350"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-slate-500 pt-2">
              Don't have an account?{" "}
              <Link
                to="/role-selection"
                onClick={() => setError(null)}
                className="font-bold text-teal-700 hover:underline hover:text-teal-800 transition"
              >
                Choose role & Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
export { Login };
