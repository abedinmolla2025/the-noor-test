import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Activity, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersResult, contentResult, activityResult, contentByStatus] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('admin_content').select('id', { count: 'exact', head: true }),
        supabase.from('user_activity').select('id', { count: 'exact', head: true }),
        supabase.from('admin_content').select('status'),
      ]);

      const statusCounts = {
        draft: 0,
        in_review: 0,
        scheduled: 0,
        published: 0,
        archived: 0,
      };

      contentByStatus.data?.forEach((item: any) => {
        if (item.status in statusCounts) {
          statusCounts[item.status as keyof typeof statusCounts]++;
        }
      });

      return {
        totalUsers: usersResult.count || 0,
        totalContent: contentResult.count || 0,
        totalActivity: activityResult.count || 0,
        revenue: 0,
        contentByStatus: statusCounts,
      };
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-admin-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'Content Items',
      value: stats?.totalContent || 0,
      icon: BookOpen,
      description: 'Published content',
    },
    {
      title: 'User Activity',
      value: stats?.totalActivity || 0,
      icon: Activity,
      description: 'Total interactions',
    },
    {
      title: 'Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: DollarSign,
      description: 'Total earnings',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Control Center</h1>
        <p className="text-muted-foreground mt-2">Overview of NOOR CMS Activity & Performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Content by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
              <span className="text-2xl font-bold">{stats?.contentByStatus.draft || 0}</span>
              <Badge variant="secondary" className="mt-2">Draft</Badge>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
              <span className="text-2xl font-bold">{stats?.contentByStatus.in_review || 0}</span>
              <Badge variant="outline" className="mt-2">In Review</Badge>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
              <span className="text-2xl font-bold">{stats?.contentByStatus.scheduled || 0}</span>
              <Badge variant="outline" className="mt-2">
                <Clock className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/20 rounded-lg">
              <span className="text-2xl font-bold">{stats?.contentByStatus.published || 0}</span>
              <Badge className="mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Published
              </Badge>
            </div>
            <div className="flex flex-col items-center p-4 bg-destructive/10 rounded-lg">
              <span className="text-2xl font-bold">{stats?.contentByStatus.archived || 0}</span>
              <Badge variant="destructive" className="mt-2">Archived</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline (Last 24h) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity (Last 10 Actions)</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono max-w-[120px] truncate">
                      {log.actor_id}
                    </TableCell>
                    <TableCell className="text-xs font-mono max-w-[120px] truncate">
                      {log.resource_id || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(log.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
