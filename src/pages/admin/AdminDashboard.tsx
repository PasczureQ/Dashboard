import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderOpen, Users, Mail, Rocket, Wrench, Briefcase, Code, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    projects: 0, live: 0, inDev: 0, maintenance: 0,
    brands: 0, staff: 0, messages: 0,
  });
  const [activity, setActivity] = useState<{ id: string; action: string; entity_type: string; entity_name: string | null; created_at: string }[]>([]);

  useEffect(() => {
    const fetchCounts = async () => {
      const [p, live, dev, maint, b, s, m] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["live", "released"]),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "in_development"),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "maintenance"),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("category", "brand"),
        supabase.from("staff").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: p.count ?? 0,
        live: live.count ?? 0,
        inDev: dev.count ?? 0,
        maintenance: maint.count ?? 0,
        brands: b.count ?? 0,
        staff: s.count ?? 0,
        messages: m.count ?? 0,
      });
    };
    const fetchActivity = async () => {
      const { data } = await supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10);
      setActivity((data as any[]) ?? []);
    };
    fetchCounts();
    fetchActivity();
  }, []);

  const stats = [
    { label: "Total Projects", value: counts.projects, icon: FolderOpen },
    { label: "Live", value: counts.live, icon: Rocket },
    { label: "In Development", value: counts.inDev, icon: Code },
    { label: "Maintenance", value: counts.maintenance, icon: Wrench },
    { label: "Ventures", value: counts.brands, icon: Briefcase },
    { label: "Team Members", value: counts.staff, icon: Users },
    { label: "Messages", value: counts.messages, icon: Mail },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Control Center</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-6 card-hover">
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

      {/* Activity Log */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-primary" />
          <h2 className="font-display font-bold">Recent Activity</h2>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-foreground">{a.action}</span>
                  {a.entity_name && <span className="text-primary font-medium"> — {a.entity_name}</span>}
                  <span className="text-xs text-muted-foreground block mt-0.5">{new Date(a.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
