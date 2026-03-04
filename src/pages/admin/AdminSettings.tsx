import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Shield, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettingsId(data.id);
          setMaintenanceMode(data.maintenance_mode);
          setMaintenanceMessage(data.maintenance_message || "");
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!settingsId) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage,
      })
      .eq("id", settingsId);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } else {
      toast({ title: "Settings saved", description: maintenanceMode ? "Maintenance mode is now active." : "Site is live." });
    }
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Site Settings</h1>

      {/* Maintenance Mode */}
      <div className="glass rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Shield size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold">Maintenance Mode</h2>
            <p className="text-xs text-muted-foreground">Block public access while making changes</p>
          </div>
        </div>

        <label className="flex items-center gap-3 mb-4 cursor-pointer group">
          <div
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
              maintenanceMode ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform duration-300 ${
                maintenanceMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm font-medium">
            {maintenanceMode ? (
              <span className="text-primary">🔴 Maintenance Active</span>
            ) : (
              <span className="text-muted-foreground">Site is Live</span>
            )}
          </span>
        </label>

        {maintenanceMode && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-muted-foreground mb-1">Custom Message (optional)</label>
            <textarea
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="We'll be back shortly with exciting updates..."
              maxLength={500}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-gradient px-6 py-2.5 text-sm text-primary-foreground disabled:opacity-50"
      >
        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Settings size={14} /> Save Settings</>}
      </button>
    </div>
  );
};

export default AdminSettings;
