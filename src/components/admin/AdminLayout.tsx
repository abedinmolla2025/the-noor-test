import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { ProtectedRoute } from './ProtectedRoute';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        <main className="flex-1 overflow-auto">
          {/* Mobile top app bar with menu button */}
          <div className="flex items-center justify-between border-b border-border px-3 py-3 sm:px-4 sm:py-4 md:hidden">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Admin
              </p>
              <h1 className="text-base font-semibold leading-tight">NOOR Panel</h1>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open admin navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r border-border">
                <AdminSidebar />
              </SheetContent>
            </Sheet>
          </div>

          <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};
