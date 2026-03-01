import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Staff from "./pages/Staff";
import Contact from "./pages/Contact";
import Socials from "./pages/Socials";
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
            <Route element={<Layout><Routes><Route path="*" element={null} /></Routes></Layout>}>
            </Route>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/projects" element={<Layout><Projects /></Layout>} />
            <Route path="/staff" element={<Layout><Staff /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/socials" element={<Layout><Socials /></Layout>} />

            {/* Admin */}
            <Route path="/admin" element={<Layout><AdminLogin /></Layout>} />
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
