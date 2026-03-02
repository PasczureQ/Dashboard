import { useEffect, useState } from "react";
import { ExternalLink, Wrench, Search, ArrowUpDown, Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;
type Filter = "all" | "live" | "in_development" | "maintenance";
type Sort = "newest" | "oldest" | "status";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "in_development", label: "In Development" },
  { key: "maintenance", label: "Maintenance" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  live: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  released: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  in_development: { label: "In Development", className: "border border-accent/40 text-accent bg-accent/5" },
  maintenance: { label: "Maintenance", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/50 animate-pulse" },
};

const StudioProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    supabase.from("projects").select("*").neq("category", "brand").order("display_order").then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = projects
    .filter((p) => {
      const matchesFilter =
        filter === "all" ? true :
        filter === "live" ? (p.status === "live" || p.status === "released") :
        p.status === filter;
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return (a.status ?? "").localeCompare(b.status ?? "");
    });

  const isLive = (status: string) => status === "live" || status === "released";

  return (
    <div className="page-transition" ref={scrollRef}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Game Development</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Studio Projects</h1>
          <p className="text-muted-foreground max-w-lg mb-10">Explore our game experiences and interactive builds.</p>

          {/* Search + Filters + Sort */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-shadow"
                />
              </div>
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                    filter === f.key
                      ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(0_100%_36%/0.3)]"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {f.label}
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
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig[project.status]?.className || "bg-muted text-muted-foreground"}`}>
                        {statusConfig[project.status]?.label || project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Code size={12} className="text-primary" />
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{project.category}</span>
                    </div>
                    <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

                    {isLive(project.status) && project.game_link ? (
                      <a href={project.game_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]">
                        <ExternalLink size={14} /> Launch Experience
                      </a>
                    ) : project.status === "in_development" ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent text-sm font-semibold rounded-md">
                        <Code size={14} /> In Development
                      </span>
                    ) : project.status === "maintenance" ? (
                      <button disabled className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md cursor-not-allowed">
                        <Wrench size={14} /> Under Maintenance
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

export default StudioProjects;
