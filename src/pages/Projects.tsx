import { useEffect, useState } from "react";
import { ExternalLink, Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;
type Filter = "all" | "released" | "maintenance" | "roblox" | "brand";

const filters: Filter[] = ["all", "released", "maintenance", "roblox", "brand"];

const statusConfig: Record<string, { label: string; className: string }> = {
  released: { label: "Released", className: "bg-primary/15 text-primary" },
  maintenance: { label: "Under Maintenance", className: "bg-muted text-muted-foreground" },
  construction: { label: "Under Construction", className: "bg-muted text-muted-foreground" },
  out: { label: "Released", className: "bg-primary/15 text-primary" },
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("projects").select("*").order("display_order").then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "released") return p.status === "released" || p.status === "out";
    if (filter === "maintenance") return p.status === "maintenance" || p.status === "construction";
    return p.category === filter;
  });

  return (
    <div className="page-transition">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground max-w-lg mb-10">Explore my Roblox games and brand ventures.</p>

          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div key={project.id} className="bg-card border border-border rounded-lg overflow-hidden card-hover group">
                  <div className="aspect-video bg-secondary overflow-hidden">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusConfig[project.status]?.className || "bg-muted text-muted-foreground"}`}>
                        {statusConfig[project.status]?.label || project.status}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{project.category}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                    {project.category === "roblox" && (project.status === "released") && project.game_link ? (
                      <a href={project.game_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow hover:bg-primary/90 transition-colors">
                        <ExternalLink size={14} /> Play
                      </a>
                    ) : (project.status === "maintenance" || project.status === "construction") ? (
                      <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md cursor-not-allowed">
                        <Wrench size={14} /> Unavailable
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No projects found.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
