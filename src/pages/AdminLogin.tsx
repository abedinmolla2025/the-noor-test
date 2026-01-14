import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { Loader2 } from "lucide-react";

const UNLOCK_KEY = "noor_admin_unlock";

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAdmin();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const unlocked = localStorage.getItem(UNLOCK_KEY) === "1";
    if (!unlocked) {
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, []);

  // If already logged in as admin, go straight to admin panel
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // Block direct access if hidden unlock not performed
  if (allowed === false) {
    return <Navigate to="/" replace />;
  }

  if (allowed === null || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleAdminLogin = useCallback(async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error("Error during admin Google login", error);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Admin Login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your admin account to access the NOOR control panel.
        </p>
        <Button onClick={handleAdminLogin} className="mx-auto">
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default AdminLogin;
