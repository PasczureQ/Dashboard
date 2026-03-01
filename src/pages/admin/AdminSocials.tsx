import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Social = Tables<"socials">;

const AdminSocials = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("socials").select("*").order("display_order").then(({ data }) => {
      setSocials(data ?? []);
      setLoading(false);
    });
  }, []);

  const updateSocial = (id: string, updates: Partial<Social>) => {
    setSocials((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    for (const s of socials) {
      await supabase.from("socials").update({ url: s.url, enabled: s.enabled }).eq("id", s.id);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Social Links</h1>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="space-y-4">
        {socials.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.enabled ?? false}
                  onChange={(e) => updateSocial(s.id, { enabled: e.target.checked })}
                  className="accent-primary w-4 h-4"
                />
                <span className="font-semibold min-w-[100px]">{s.platform}</span>
              </label>
              <input
                value={s.url || ""}
                onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSocials;
