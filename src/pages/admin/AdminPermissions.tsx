import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface RoleCapability {
  id: string;
  role: 'user' | 'editor' | 'admin' | 'super_admin';
  capability: string;
  allowed: boolean;
}

const ROLE_ORDER = ['user', 'editor', 'admin', 'super_admin'] as const;

const CAPABILITIES = [
  'content.create',
  'content.read',
  'content.update',
  'content.delete',
  'content.publish',
  'content.approve',
  'user.read',
  'user.manage',
  'role.assign',
  'audit.read',
  'settings.manage',
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'super_admin':
      return Shield;
    case 'admin':
      return Lock;
    case 'editor':
      return Edit;
    default:
      return Eye;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'bg-destructive text-destructive-foreground';
    case 'admin':
      return 'bg-primary text-primary-foreground';
    case 'editor':
      return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function AdminPermissions() {
  const { isSuperAdmin } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCapability, setNewCapability] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: capabilities, isLoading } = useQuery<RoleCapability[]>({
    queryKey: ['role-capabilities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_capabilities')
        .select('*')
        .order('role', { ascending: true })
        .order('capability', { ascending: true });

      if (error) throw error;
      return data as RoleCapability[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, allowed }: { id: string; allowed: boolean }) => {
      const { error } = await supabase
        .from('role_capabilities')
        .update({ allowed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-capabilities'] });
      toast({ title: 'Permission updated' });
    },
    onError: () => {
      toast({ title: 'Failed to update permission', variant: 'destructive' });
    },
  });

  const addCapabilityMutation = useMutation({
    mutationFn: async (capability: string) => {
      const inserts = ROLE_ORDER.map(role => ({
        role,
        capability,
        allowed: role === 'super_admin', // Default super_admin to true
      }));

      const { error } = await supabase
        .from('role_capabilities')
        .insert(inserts);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-capabilities'] });
      toast({ title: 'Capability added to all roles' });
      setNewCapability('');
      setShowAddDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add capability',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleToggle = (id: string, currentAllowed: boolean) => {
    if (!isSuperAdmin) {
      toast({ title: 'Only super admins can modify permissions', variant: 'destructive' });
      return;
    }
    toggleMutation.mutate({ id, allowed: !currentAllowed });
  };

  const handleAddCapability = () => {
    if (!newCapability.trim()) {
      toast({ title: 'Capability name cannot be empty', variant: 'destructive' });
      return;
    }
    addCapabilityMutation.mutate(newCapability.trim());
  };

  // Build matrix: capability -> role -> capability object
  const matrix: Record<string, Record<string, RoleCapability | undefined>> = {};
  
  capabilities?.forEach(cap => {
    if (!matrix[cap.capability]) {
      matrix[cap.capability] = {};
    }
    matrix[cap.capability][cap.role] = cap;
  });

  const allCapabilities = Array.from(new Set([...CAPABILITIES, ...Object.keys(matrix)])).sort();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Permissions Matrix</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Permissions Matrix</h1>
          <p className="text-muted-foreground mt-2">
            Manage role-based capabilities for the NOOR Admin Panel
          </p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Capability
          </Button>
        )}
      </div>

      {!isSuperAdmin && (
        <Card className="border-warning">
          <CardContent className="pt-6">
            <p className="text-sm text-warning">
              <Lock className="inline h-4 w-4 mr-1" />
              You are viewing the permissions matrix in read-only mode. Only super admins can modify permissions.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Role × Capability Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold min-w-[200px]">Capability</th>
                  {ROLE_ORDER.map(role => {
                    const Icon = getRoleIcon(role);
                    return (
                      <th key={role} className="p-3 text-center min-w-[120px]">
                        <Badge className={getRoleColor(role)}>
                          <Icon className="h-3 w-3 mr-1" />
                          {role.replace('_', ' ')}
                        </Badge>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {allCapabilities.map(capability => (
                  <tr key={capability} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-mono text-sm">{capability}</td>
                    {ROLE_ORDER.map(role => {
                      const cap = matrix[capability]?.[role];
                      return (
                        <td key={`${capability}-${role}`} className="p-3 text-center">
                          {cap ? (
                            <Switch
                              checked={cap.allowed}
                              onCheckedChange={() => handleToggle(cap.id, cap.allowed)}
                              disabled={!isSuperAdmin || toggleMutation.isPending}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Capability Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Capability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="capability">Capability Name</Label>
              <Input
                id="capability"
                placeholder="e.g., media.upload"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Use dot notation: resource.action (e.g., content.publish, user.delete)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCapability}
              disabled={addCapabilityMutation.isPending || !newCapability.trim()}
            >
              {addCapabilityMutation.isPending ? 'Adding...' : 'Add Capability'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
