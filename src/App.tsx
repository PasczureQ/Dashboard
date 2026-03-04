import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import MaintenanceGuard from "./components/MaintenanceGuard";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const StudioProjects = lazy(() => import("./pages/StudioProjects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Ventures = lazy(() => import("./pages/Ventures"));
const VentureDetail = lazy(() => import("./pages/VentureDetail"));
const Team = lazy(() => import("./pages/Team"));
const Connect = lazy(() => import("./pages/Connect"));
const Network = lazy(() => import("./pages/Network"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"));
const AdminSocials = lazy(() => import("./pages/admin/AdminSocials"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="red-dot animate-pulse-glow" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MaintenanceGuard>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/studio-projects" element={<Layout><StudioProjects /></Layout>} />
                <Route path="/project/:slug" element={<Layout><ProjectDetail /></Layout>} />
                <Route path="/ventures" element={<Layout><Ventures /></Layout>} />
                <Route path="/ventures/:id" element={<Layout><VentureDetail /></Layout>} />
                <Route path="/team" element={<Layout><Team /></Layout>} />
                <Route path="/connect" element={<Layout><Connect /></Layout>} />
                <Route path="/network" element={<Layout><Network /></Layout>} />

                {/* Admin - multiple secret routes */}
                <Route path="/admin" element={<Layout><AdminLogin /></Layout>} />
                <Route path="/studio-access" element={<Layout><AdminLogin /></Layout>} />
                <Route path="/control-center" element={<Layout><AdminLogin /></Layout>} />
                <Route path="/root" element={<Layout><AdminLogin /></Layout>} />

                <Route element={<Layout><AdminLayout /></Layout>}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/projects" element={<AdminProjects />} />
                  <Route path="/admin/staff" element={<AdminStaff />} />
                  <Route path="/admin/socials" element={<AdminSocials />} />
                  <Route path="/admin/messages" element={<AdminMessages />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </Suspense>
          </MaintenanceGuard>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
