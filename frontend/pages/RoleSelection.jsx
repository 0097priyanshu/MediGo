import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Store, Truck, AlertCircle } from "lucide-react";
import GoogleLoginButton from "@/components/GoogleLoginButton";

/**
 * Premium RoleSelection page.
 * Prompts user to select a role before signing in with Google.
 */
const RoleSelection = () => {
  const { error, setError } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleRoleSelect = (role) => {
    setLocalError("");
    setError(null);
    setSelectedRole(role);
    // Store temporarily for the Google login callback
    localStorage.setItem("pending_role", role);
  };

  const roles = [
    {
      id: "customer",
      title: "Customer",
      description: "Browse medicines, consult our AI assistant, and order home deliveries.",
      icon: User,
      color: "from-teal-500 to-cyan-500",
      bg: "bg-teal-50/30",
      border: "border-teal-200",
      hoverBorder: "hover:border-teal-500",
      activeBorder: "border-teal-600 bg-teal-50/80 shadow-md",
      textColor: "text-teal-800"
    },
    {
      id: "store",
      title: "Store Owner",
      description: "Manage medicines inventory, update stock levels, and review client orders.",
      icon: Store,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50/20",
      border: "border-blue-200",
      hoverBorder: "hover:border-blue-500",
      activeBorder: "border-blue-600 bg-blue-50/60 shadow-md",
      textColor: "text-blue-800"
    },
    {
      id: "delivery",
      title: "Delivery Partner",
      description: "Receive assigned local medical dispatches and report delivery updates.",
      icon: Truck,
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50/20",
      border: "border-purple-200",
      hoverBorder: "hover:border-purple-500",
      activeBorder: "border-purple-600 bg-purple-50/60 shadow-md",
      textColor: "text-purple-800"
    }
  ];

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-teal-50/20 px-4 py-12 animate-fade-in">
        <Card className="w-full max-w-2xl border-teal-100/80 shadow-xl bg-white/95 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-3xl font-extrabold text-teal-850 tracking-tight">Select Your Role</CardTitle>
            <CardDescription className="text-sm text-slate-500 max-w-[400px] mx-auto">
              Please choose how you wish to proceed before authenticating with your Google Account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(localError || error) && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100 transition-all duration-300">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-650" />
                <p className="font-medium">{localError || error}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isActive = selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`flex flex-col text-left p-5 rounded-2xl border bg-white outline-none transition-all duration-300 ${
                      isActive ? role.activeBorder : `${role.border} ${role.hoverBorder}`
                    }`}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color} text-white w-fit shadow-sm mb-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className={`text-lg font-bold ${role.textColor} mb-1`}>{role.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500">{role.description}</p>
                  </button>
                );
              })}
            </div>

            {selectedRole ? (
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-4 animate-slide-up">
                <div className="text-sm font-semibold text-slate-600">
                  Ready to continue as <span className="font-extrabold capitalize text-teal-700">{selectedRole}</span>
                </div>
                <div className="w-full max-w-sm">
                  <GoogleLoginButton onError={(msg) => setLocalError(msg)} />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-sm font-medium text-slate-400 select-none animate-pulse">
                Click on a role above to unlock the Google Authentication button.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RoleSelection;
export { RoleSelection };
