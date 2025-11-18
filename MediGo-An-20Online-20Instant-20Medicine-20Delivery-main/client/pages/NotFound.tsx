import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
        <div className="text-center">
          <div className="mb-6">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          </div>
          <h1 className="text-6xl font-bold mb-2 text-foreground">404</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you're looking for doesn't exist. It might have been moved
            or deleted.
          </p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
