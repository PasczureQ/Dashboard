import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Wrench, Search, ArrowUpDown, Code, Eye, X, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;
type Filter = "all" | "live" | "in_development" | "maintenance" | "beta" | "private";
type Sort = "newest" | "oldest" | "status";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "in_development", label: "In Development" },
  { key: "maintenance", label: "Maintenance" },
  { key: "beta", label: "Beta" },
  { key: "private", label: "Private" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  live: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  released: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  in_development: { label: "In Development", className: "border border-yellow-500/40 text-yellow-400 bg-yellow-500/5" },
  maintenance: { label: "Maintenance", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/50" },
  beta: { label: "Beta", className: "border border-blue-500/40 text-blue-400 bg-blue-500/5" },
  private: { label: "Private", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/30" },
  archived: { label: "Archived", className: "border border-muted-foreground/20 text-muted-foreground/60 bg-muted/20" },
};

const SkeletonCard = () => (
  <div className="glass rounded-xl overflow-hidden">
    <div className="aspect-video skeleton" />
    <div className="p-5 space-y-3">
      <div className="h-4 w-20 skeleton" />
      <div className="h-5 w-3/4 skeleton" />
      <div className="h-4 w-full skeleton" />
      <div className="h-9 w-36 skeleton" />
    </div>
  </div>
);

const StudioProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  const filter = (searchParams.get("status") as Filter) || "all";
  const sort = (searchParams.get("sort") as Sort) || "newest";
  const search = searchParams.get("q") || "";

  const setFilter = (f: Filter) => {
    const params = new URLSearchParams(searchParams);
    if (f === "all") params.delete("status"); else params.set("status", f);
    setSearchParams(params);
  };

  const setSort = (s: Sort) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", s);
    setSearchParams(params);
  };

  const setSearch = (q: string) => {
    const params = new URLSearchParams(searchParams);
    if (!q) params.delete("q"); else params.set("q", q);
    setSearchParams(params);
  };

  const resetFilters = () => setSearchParams({});

  useEffect(() => {
    supabase.from("projects").select("*").neq("category", "brand").order("display_order").then(({ data }) => {
      setProjects(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return projects
      .filter((p) => {
        const matchesFilter =
          filter === "all" ? true :
          filter === "live" ? (p.status === "live" || p.status === "released") :
          p.status === filter;
        const matchesSearch = !search || p.name.toLowerCase().includes(searchLower) || p.description?.toLowerCase().includes(searchLower);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return (a.status ?? "").localeCompare(b.status ?? "");
      });
  }, [projects, filter, sort, search]);

  const isLive = (status: string) => status === "live" || status === "released";
  const hasActiveFilters = filter !== "all" || search || sort !== "newest";

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
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
              </div>
              <div className="relative">
                <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    filter === f.key
                      ? "btn-gradient text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              {hasActiveFilters && (
                <button onClick={resetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <X size={12} /> Reset
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <div key={project.id} className="glass rounded-xl overflow-hidden card-hover group fade-up">
                  <Link to={`/project/${project.slug || project.id}`} className="block">
                    <div className="aspect-video bg-secondary overflow-hidden relative">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                      )}
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground bg-primary/80 px-4 py-2 rounded-lg">
                          <Eye size={14} /> View Details
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm badge-pulse ${statusConfig[project.status]?.className || "bg-muted text-muted-foreground"}`}>
                          {statusConfig[project.status]?.label || project.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Code size={12} className="text-primary" />
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{project.category}</span>
                    </div>
                    <Link to={`/project/${project.slug || project.id}`}>
                      <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock size={10} /> {new Date(project.updated_at).toLocaleDateString()}
                    </div>

                    {isLive(project.status) && project.game_link ? (
                      <a href={project.game_link} target="_blank" rel="noopener noreferrer" className="btn-gradient px-4 py-2 text-sm text-primary-foreground" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={14} /> Launch Experience
                      </a>
                    ) : project.status === "in_development" ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 text-sm font-semibold rounded-lg border border-yellow-500/20">
                        <Code size={14} /> In Development
                      </span>
                    ) : project.status === "maintenance" ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-lg">
                        <Wrench size={14} /> Under Maintenance
                      </span>
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
