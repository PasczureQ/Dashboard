import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MaintenancePage from "@/pages/Maintenance";

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [checked, setChecked] = useState(false);
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
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
      });
  }, [location.pathname]);

  if (!checked) return null;

  if (maintenance && !isAdmin && !isAdminRoute) {
    return <MaintenancePage message={message} />;
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
