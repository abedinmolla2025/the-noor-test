import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type AppRole = "user" | "editor" | "admin" | "super_admin";

type AdminContextType = {
  user: User | null;
  roles: AppRole[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const AUTH_TIMEOUT_MS = 3000;
    let timeoutId: number | undefined;

    const logAuthState = (label: string, session: any) => {
      console.log("[AdminAuth]", label, {
        userId: session?.user?.id ?? null,
        hasSession: !!session,
      });
    };

    const finishLoading = () => {
      if (!isMounted) return;
      setLoading(false);
    };

    const loadSession = async (reason: "initial" | "timeout_refresh") => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AdminAuth] getSession error", { reason, error });
        }

        const session = data.session;
        logAuthState(`getSession (${reason})`, session);

        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRoles(session.user.id);
        } else {
          setRoles([]);
        }
      } catch (error) {
        console.error("[AdminAuth] Unexpected error in loadSession", {
          reason,
          error,
        });
        setUser(null);
        setRoles([]);
      } finally {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        finishLoading();
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AdminAuth] onAuthStateChange", {
          event,
          userId: session?.user?.id ?? null,
        });

        setUser(session?.user ?? null);

        // Log auth events to audit log
        if (session?.user && (event === "SIGNED_IN" || event === "SIGNED_OUT")) {
          try {
            await supabase.from("admin_audit_log").insert({
              action: event === "SIGNED_IN" ? "auth.login" : "auth.logout",
              actor_id: session.user.id,
              resource_type: "auth",
              metadata: { event, timestamp: new Date().toISOString() },
            });
          } catch (error) {
            console.error("[AdminAuth] Failed to log auth event", { event, error });
          }
        }

        if (session?.user) {
          await fetchUserRoles(session.user.id);
        } else {
          setRoles([]);
        }

        finishLoading();
      }
    );

    timeoutId = window.setTimeout(() => {
      console.warn(
        "[AdminAuth] Auth loading timeout reached, forcing session refresh"
      );
      loadSession("timeout_refresh");
    }, AUTH_TIMEOUT_MS);

    // Initial session load
    loadSession("initial");

    return () => {
      isMounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } else {
        setRoles(data?.map(r => r.role as AppRole) || []);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = roles.includes('admin') || roles.includes('super_admin');
  const isSuperAdmin = roles.includes('super_admin');

  return (
    <AdminContext.Provider
      value={{ user, roles, isAdmin, isSuperAdmin, loading }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
};
