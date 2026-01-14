import { NavLink } from '@/components/NavLink';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  Bell,
  Image,
  BarChart3,
  Settings,
  LogOut,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

export const AdminSidebar = () => {
  const { user } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/content', icon: BookOpen, label: 'Content' },
    { to: '/admin/ads', icon: DollarSign, label: 'Ads' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { to: '/admin/finance', icon: DollarSign, label: 'Finance' },
    { to: '/admin/audit', icon: Activity, label: 'Audit' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:translate-x-0">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4 md:p-6">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-primary leading-tight">NOOR Admin</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate max-w-[160px] md:max-w-[200px]">
            {user?.email}
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-3 md:p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
