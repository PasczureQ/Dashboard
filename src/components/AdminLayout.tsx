import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, Users, Share2, Mail, LogOut } from "lucide-react";

const adminNav = [
  { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", path: "/admin/projects", icon: FolderOpen },
  { label: "Team", path: "/admin/staff", icon: Users },
  { label: "Network", path: "/admin/socials", icon: Share2 },
  { label: "Messages", path: "/admin/messages", icon: Mail },
];

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="red-dot animate-pulse-glow" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="page-transition min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col fixed top-16 bottom-0">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-bold text-primary">Control Center</h2>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-card border-b border-border overflow-x-auto">
        <div className="flex p-2 gap-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          ))}
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 md:ml-64 pt-0 md:pt-0 mt-12 md:mt-0">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
