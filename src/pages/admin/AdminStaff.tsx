import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type StaffMember = Tables<"staff">;

const AdminStaff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [editing, setEditing] = useState<Partial<StaffMember> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    const { data } = await supabase.from("staff").select("*").order("display_order");
    setStaff(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  const uploadPicture = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `staff/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.role) return;
    const payload = {
      name: editing.name,
      role: editing.role,
      description: editing.description || "",
      contact: editing.contact || "",
      profile_picture_url: editing.profile_picture_url || null,
      display_order: editing.display_order ?? 0,
    };

    if (editing.id) {
      await supabase.from("staff").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("staff").insert(payload);
    }
    setEditing(null);
    fetchStaff();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    await supabase.from("staff").delete().eq("id", id);
    fetchStaff();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Staff</h1>
        <button
          onClick={() => setEditing({})}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold">{editing.id ? "Edit" : "Add"} Staff</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Info</label>
                <input value={editing.contact || ""} onChange={(e) => setEditing({ ...editing, contact: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Discord: ..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Profile Picture</label>
                <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const url = await uploadPicture(file); if (url) setEditing({ ...editing, profile_picture_url: url }); } }} className="w-full text-sm text-muted-foreground" />
                {editing.profile_picture_url && <img src={editing.profile_picture_url} alt="" className="mt-2 h-16 w-16 rounded-full object-cover" />}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow">Save</button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {staff.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            {s.profile_picture_url ? (
              <img src={s.profile_picture_url} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">{s.name[0]}</div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{s.name}</h3>
              <p className="text-sm text-primary">{s.role}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(s)} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {staff.length === 0 && <p className="text-center text-muted-foreground py-8">No staff yet. Add your first member!</p>}
      </div>
    </div>
  );
};

export default AdminStaff;
