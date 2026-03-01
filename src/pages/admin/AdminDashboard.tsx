import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, Users, Mail } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ projects: 0, staff: 0, messages: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [p, s, m] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("staff").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: p.count ?? 0,
        staff: s.count ?? 0,
        messages: m.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: "Projects", value: counts.projects, icon: FolderOpen },
    { label: "Staff", value: counts.staff, icon: Users },
    { label: "Messages", value: counts.messages, icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <s.icon size={20} className="text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-3xl font-display font-bold">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
