import { FormEvent, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const UNLOCK_KEY = "noor_admin_unlock";

const resetSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Valid admin email required" })
    .max(255, { message: "Email is too long" }),
});

const AdminResetPassword = () => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem(UNLOCK_KEY) === "1";
    if (!unlocked) {
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, []);

  if (allowed === false) {
    return <Navigate to="/" replace />;
  }

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const parsed = resetSchema.safeParse({ email });
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid email";
      setError(firstError);
      return;
    }

    setSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        parsed.data.email,
        {
          redirectTo: window.location.origin + "/admin/login",
        }
      );

      if (resetError) {
        setError("Unable to send reset link. Please try again.");
        return;
      }

      setSuccess("If this email belongs to an admin account, a reset link has been sent.");
    } catch (err) {
      console.error("Error sending admin reset email", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Reset Admin Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin email address and we&apos;ll send you a secure reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Admin email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-emerald-500" role="status">
              {success}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
