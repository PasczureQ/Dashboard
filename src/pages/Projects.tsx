import { useState } from "react";
import { ExternalLink, Wrench } from "lucide-react";

type ProjectStatus = "released" | "maintenance" | "construction" | "out";
type ProjectCategory = "roblox" | "brand";

interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  brandType?: string;
}

const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Adventure Quest",
    category: "roblox",
    status: "released",
    description: "An epic adventure game with unique mechanics and immersive world.",
  },
  {
    id: "2",
    name: "Battle Arena",
    category: "roblox",
    status: "maintenance",
    description: "A competitive PvP arena game currently being updated.",
  },
  {
    id: "3",
    name: "StreetLine Apparel",
    category: "brand",
    status: "out",
    description: "Premium streetwear brand with bold designs.",
    brandType: "T-shirt brand",
  },
  {
    id: "4",
    name: "VoltTech",
    category: "brand",
    status: "construction",
    description: "Consumer electronics brand coming soon.",
    brandType: "Electronics brand",
  },
];

const filters = ["all", "released", "maintenance", "roblox", "brand"] as const;
type Filter = (typeof filters)[number];

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  released: { label: "Released", className: "bg-primary/15 text-primary" },
  maintenance: { label: "Under Maintenance", className: "bg-muted text-muted-foreground" },
  construction: { label: "Under Construction", className: "bg-muted text-muted-foreground" },
  out: { label: "Released", className: "bg-primary/15 text-primary" },
};

const Projects = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = sampleProjects.filter((p) => {
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
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
              Portfolio
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground max-w-lg mb-10">
            Explore my Roblox games and brand ventures. All content is managed dynamically.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-lg overflow-hidden card-hover group"
              >
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">Thumbnail</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusConfig[project.status].className}`}>
                      {statusConfig[project.status].label}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>

                  {project.category === "roblox" && project.status === "released" ? (
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover-glow hover:bg-primary/90 transition-colors">
                      <ExternalLink size={14} />
                      Play
                    </button>
                  ) : project.status === "maintenance" || project.status === "construction" ? (
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md cursor-not-allowed"
                    >
                      <Wrench size={14} />
                      Unavailable
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found for this filter.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
