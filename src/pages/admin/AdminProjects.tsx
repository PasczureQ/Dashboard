import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const categories = ["roblox", "brand"];
const statuses: Record<string, string[]> = {
  roblox: ["released", "maintenance"],
  brand: ["construction", "out"],
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    setProjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `projects/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!editing?.name) return;
    const payload = {
      name: editing.name,
      category: editing.category || "roblox",
      status: editing.status || "released",
      description: editing.description || "",
      thumbnail_url: editing.thumbnail_url || null,
      game_link: editing.game_link || null,
      brand_type: editing.brand_type || null,
      display_order: editing.display_order ?? 0,
    };

    if (editing.id) {
      await supabase.from("projects").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("projects").insert(payload);
    }
    setEditing(null);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Projects</h1>
        <button
          onClick={() => setEditing({ category: "roblox", status: "released" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-bold">{editing.id ? "Edit" : "Add"} Project</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <select
                  value={editing.category || "roblox"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value, status: statuses[e.target.value][0] })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={editing.status || "released"}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {(statuses[editing.category || "roblox"] || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {editing.category === "roblox" && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Game Link</label>
                  <input
                    value={editing.game_link || ""}
                    onChange={(e) => setEditing({ ...editing, game_link: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://www.roblox.com/games/..."
                  />
                </div>
              )}
              {editing.category === "brand" && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Brand Type</label>
                  <input
                    value={editing.brand_type || ""}
                    onChange={(e) => setEditing({ ...editing, brand_type: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="T-shirt brand, Electronics, etc."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await uploadThumbnail(file);
                      if (url) setEditing({ ...editing, thumbnail_url: url });
                    }
                  }}
                  className="w-full text-sm text-muted-foreground"
                />
                {editing.thumbnail_url && (
                  <img src={editing.thumbnail_url} alt="" className="mt-2 h-20 rounded-md object-cover" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow">
                  Save
                </button>
                <button onClick={() => setEditing(null)} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
            {p.thumbnail_url ? (
              <img src={p.thumbnail_url} alt="" className="w-16 h-12 rounded object-cover" />
            ) : (
              <div className="w-16 h-12 rounded bg-secondary" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{p.name}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">{p.category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary capitalize">{p.status}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No projects yet. Add your first one!</p>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
