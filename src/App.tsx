import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import StudioProjects from "./pages/StudioProjects";
import Ventures from "./pages/Ventures";
import VentureDetail from "./pages/VentureDetail";
import Team from "./pages/Team";
import Connect from "./pages/Connect";
import Network from "./pages/Network";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminSocials from "./pages/admin/AdminSocials";
import AdminMessages from "./pages/admin/AdminMessages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/studio-projects" element={<Layout><StudioProjects /></Layout>} />
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
            </Route>

            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
