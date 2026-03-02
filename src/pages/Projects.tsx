import { useEffect, useState } from "react";
import { ExternalLink, Wrench, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;
type Filter = "all" | "released" | "maintenance" | "roblox" | "brand";

const filters: Filter[] = ["all", "released", "maintenance", "roblox", "brand"];

const statusConfig: Record<string, { label: string; className: string }> = {
  released: { label: "Released", className: "border border-primary/40 text-primary bg-primary/5" },
  maintenance: { label: "Maintenance", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/50 animate-pulse" },
  construction: { label: "Coming Soon", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/50" },
  out: { label: "Released", className: "border border-primary/40 text-primary bg-primary/5" },
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    supabase.from("projects").select("*").order("display_order").then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = projects.filter((p) => {
    const matchesFilter =
      filter === "all" ? true :
      filter === "released" ? (p.status === "released" || p.status === "out") :
      filter === "maintenance" ? (p.status === "maintenance" || p.status === "construction") :
      p.category === filter;

    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-transition" ref={scrollRef}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground max-w-lg mb-10">Explore my Roblox games and brand ventures.</p>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 capitalize ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(0_100%_36%/0.3)]"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div key={project.id} className="glass rounded-xl overflow-hidden card-hover group fade-up">
                  <div className="aspect-video bg-secondary overflow-hidden relative">
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                    )}
                    {/* Status badge overlay */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig[project.status]?.className || "bg-muted text-muted-foreground"}`}>
                        {statusConfig[project.status]?.label || project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{project.category}</span>
                    <h3 className="text-lg font-display font-semibold mt-3 mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                    {project.category === "roblox" && (project.status === "released") && project.game_link ? (
                      <a href={project.game_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]">
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
