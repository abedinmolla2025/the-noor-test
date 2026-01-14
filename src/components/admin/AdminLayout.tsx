import { AdminSidebar } from './AdminSidebar';
import { ProtectedRoute } from './ProtectedRoute';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
