import React, { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Reusable Google Sign-In button component.
 * Verifies with Google identity client and posts credentials to the backend.
 */
const GoogleLoginButton = ({ onError }) => {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // client_id retrieved from environmental backend configurations
      const GOOGLE_CLIENT_ID = "222551465544-shio57fjnurauf8gpg4nveun9h4shi05.apps.googleusercontent.com";

      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              // Retrieve selected role (stored temporarily)
              const pendingRole = localStorage.getItem("pending_role") || "customer";
              
              // Post to loginWithGoogle in AuthContext
              const data = await loginWithGoogle(response.credential, pendingRole);
              
              // Clean up temporary storage
              localStorage.removeItem("pending_role");

              // Redirect based on role and approval status
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
              console.error("[GoogleLoginButton] Callback error:", err);
              if (onError) {
                onError(err.message || "Google authentication failed. Please try again.");
              }
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        });
      }
    };

    // Wait for the window.google client script to be loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginWithGoogle, navigate, onError]);

  return (
    <div className="w-full flex justify-center items-center mt-2 min-h-[44px]">
      <div ref={buttonRef} className="w-full" />
    </div>
  );
};

export default GoogleLoginButton;
export { GoogleLoginButton };
