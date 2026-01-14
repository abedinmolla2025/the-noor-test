import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BabyNamesPage from "./pages/BabyNamesPage";
import QiblaPage from "./pages/QiblaPage";
import TasbihPage from "./pages/TasbihPage";
import DuaPage from "./pages/DuaPage";
import QuranPage from "./pages/QuranPage";
import NamesOfAllahPage from "./pages/NamesOfAllahPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import BukhariPage from "./pages/BukhariPage";
import IslamicCalendarPage from "./pages/IslamicCalendarPage";
import SettingsPage from "./pages/SettingsPage";
import QuizPage from "./pages/QuizPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminMonetization from "./pages/admin/AdminMonetization";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { AdminProvider } from "./contexts/AdminContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <AppSettingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/baby-names" element={<BabyNamesPage />} />
              <Route path="/qibla" element={<QiblaPage />} />
              <Route path="/tasbih" element={<TasbihPage />} />
              <Route path="/dua" element={<DuaPage />} />
              <Route path="/quran" element={<QuranPage />} />
              <Route path="/99-names" element={<NamesOfAllahPage />} />
              <Route path="/prayer-times" element={<PrayerTimesPage />} />
              <Route path="/bukhari" element={<BukhariPage />} />
              <Route path="/calendar" element={<IslamicCalendarPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
              <Route path="/admin/monetization" element={<ProtectedRoute><AdminMonetization /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppSettingsProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
