import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const MaintenancePage = lazy(() => import("@/pages/Maintenance"));
import { lazy, Suspense } from "react";

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();
  const fetchedRef = useRef(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Only fetch once — maintenance state doesn't change per route
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    supabase
      .from("site_settings")
      .select("maintenance_mode, maintenance_message")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setMaintenance(data.maintenance_mode);
          setMessage(data.maintenance_message || "");
        }
        setChecked(true);
      })
      .catch(() => {
        setChecked(true); // Don't block on error
      });
  }, []);

  // Show children immediately while checking — don't block render
  if (!checked) {
    return <>{children}</>;
  }

  if (maintenance && !isAdmin && !isAdminRoute) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <MaintenancePage message={message} />
      </Suspense>
    );
  }

  return (
    <>
      {maintenance && isAdmin && (
        <div className="maintenance-banner fixed top-0 left-0 right-0 z-[60] py-1.5 text-center text-xs font-medium text-primary">
          🔴 Maintenance Mode Active — Only admins can view the site
        </div>
      )}
      {children}
    </>
  );
};

export default MaintenanceGuard;
