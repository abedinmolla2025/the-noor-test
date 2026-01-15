import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getDeviceFingerprint } from "@/lib/adminSecurity";

type AuditRow = {
  id: string;
  created_at: string;
  action: string;
  actor_id: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: any;
};

const AdminSecurity = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const [requireFingerprint, setRequireFingerprint] = useState(false);
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [events, setEvents] = useState<AuditRow[]>([]);

  const canChange = useMemo(
    () => currentPasscode.trim().length >= 6 && newPasscode.trim().length >= 6 && newPasscode.length <= 128,
    [currentPasscode, newPasscode]
  );

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-security", {
        body: { action: "get_config" },
      });
      if (error) throw error;
      setRequireFingerprint(Boolean(data?.require_fingerprint));

      const { data: eventsData, error: eventsError } = await supabase.functions.invoke("admin-security", {
        body: { action: "history" },
      });
      if (eventsError) throw eventsError;
      setEvents((eventsData?.events as AuditRow[]) ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveFingerprintSetting = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke("admin-security", {
        body: { action: "set_require_fingerprint", require_fingerprint: requireFingerprint },
      });
      if (error) throw error;
      toast({ title: "Security setting updated" });
      await load();
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasscode = async () => {
    if (!canChange) return;
    setSaving(true);
    try {
      const fingerprint = await getDeviceFingerprint();
      const { data, error } = await supabase.functions.invoke("admin-security", {
        body: {
          action: "change_passcode",
          current_passcode: currentPasscode,
          new_passcode: newPasscode,
          device_fingerprint: fingerprint,
        },
      });
      if (error) throw error;

      toast({
        title: data?.ok ? "Passcode updated" : "Failed",
        description: data?.ok ? "Your admin passcode has been changed." : "Invalid current passcode.",
        variant: data?.ok ? "default" : "destructive",
      });

      if (data?.ok) {
        setCurrentPasscode("");
        setNewPasscode("");
        await load();
      }
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setRevoking(true);
    try {
      const { error } = await supabase.functions.invoke("admin-security", {
        body: { action: "revoke_sessions" },
      });
      if (error) throw error;
      toast({ title: "All sessions revoked" });
      await supabase.auth.signOut();
      localStorage.removeItem("noor_admin_unlocked");
      localStorage.removeItem("noor_admin_last_activity");
      localStorage.removeItem("noor_admin_device_fingerprint");
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">Security</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Admin Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium">Require device fingerprint</p>
              <p className="text-xs text-muted-foreground">If enabled, unlock only works on the same device.</p>
            </div>
            <Switch checked={requireFingerprint} onCheckedChange={setRequireFingerprint} />
          </div>

          <Button variant="outline" onClick={handleSaveFingerprintSetting} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save security settings
          </Button>

          <Separator />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current">Current passcode</Label>
              <Input id="current" type="password" value={currentPasscode} onChange={(e) => setCurrentPasscode(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next">New passcode</Label>
              <Input id="next" type="password" value={newPasscode} onChange={(e) => setNewPasscode(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleChangePasscode} disabled={!canChange || saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
            Change passcode
          </Button>

          <Separator />

          <Button variant="destructive" onClick={handleRevokeAllSessions} disabled={revoking}>
            {revoking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Revoke all sessions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Unlock History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          ) : (
            <div className="space-y-2">
              {events.map((e) => (
                <div key={e.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{e.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
                  </div>
                  {e.metadata && (
                    <pre className="mt-2 overflow-auto rounded-md bg-muted p-2 text-[11px] text-muted-foreground">
                      {JSON.stringify(e.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;
