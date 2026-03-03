import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Code, Wrench, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const statusConfig: Record<string, { label: string; className: string }> = {
  live: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  released: { label: "Live", className: "border border-primary/40 text-primary bg-primary/5" },
  in_development: { label: "In Development", className: "border border-yellow-500/40 text-yellow-400 bg-yellow-500/5" },
  maintenance: { label: "Maintenance", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/50" },
  beta: { label: "Beta", className: "border border-blue-500/40 text-blue-400 bg-blue-500/5" },
  private: { label: "Private", className: "border border-muted-foreground/30 text-muted-foreground bg-muted/30" },
  archived: { label: "Archived", className: "border border-muted-foreground/20 text-muted-foreground/60 bg-muted/20" },
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      // Try slug first, then ID
      let { data } = await supabase.from("projects").select("*").eq("slug", slug).single();
      if (!data) {
        const res = await supabase.from("projects").select("*").eq("id", slug).single();
        data = res.data;
      }
      setProject(data);

      // Increment views
      if (data) {
        await supabase.from("projects").update({ views_count: (data as any).views_count + 1 }).eq("id", data.id);
        // Fetch related projects
        const { data: rel } = await supabase
          .from("projects")
          .select("*")
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        setRelated(rel ?? []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center">
        <div className="red-dot animate-pulse-glow" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Project not found</h2>
          <Link to="/studio-projects" className="text-primary hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  const isLive = project.status === "live" || project.status === "released";
  const images = project.product_images ?? [];
  const status = statusConfig[project.status];

  return (
    <div className="page-transition">
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10"><X size={28} /></button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/studio-projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          {/* Hero */}
          {project.thumbnail_url && (
            <div className="aspect-video rounded-xl bg-secondary overflow-hidden mb-8">
              <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="glass rounded-xl p-8 md:p-10 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{project.category}</span>
              {status && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${status.className}`}>{status.label}</span>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Eye size={12} /> {(project as any).views_count ?? 0} views
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{project.name}</h1>
            <p className="text-muted-foreground leading-relaxed text-lg mb-6">{project.description}</p>

            {isLive && project.game_link && (
              <a href={project.game_link} target="_blank" rel="noopener noreferrer" className="btn-gradient px-6 py-3 text-sm text-primary-foreground">
                <ExternalLink size={16} /> Launch Experience
              </a>
            )}
            {project.status === "in_development" && (
              <span className="inline-flex items-center gap-2 px-5 py-3 bg-yellow-500/10 text-yellow-400 text-sm font-semibold rounded-lg border border-yellow-500/20">
                <Code size={16} /> Currently In Development
              </span>
            )}
            {project.status === "maintenance" && (
              <span className="inline-flex items-center gap-2 px-5 py-3 bg-muted text-muted-foreground text-sm font-semibold rounded-lg">
                <Wrench size={16} /> Under Maintenance
              </span>
            )}
          </div>

          {/* Gallery */}
          {images.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="red-dot" />
                <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Gallery</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setLightbox(img)} className="aspect-square rounded-lg bg-secondary overflow-hidden card-hover group">
                    <img src={img} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="red-dot" />
                <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Related Projects</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.id} to={`/project/${(r as any).slug || r.id}`} className="glass rounded-xl overflow-hidden card-hover group block">
                    <div className="aspect-video bg-secondary overflow-hidden">
                      {r.thumbnail_url ? (
                        <img src={r.thumbnail_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display font-semibold group-hover:text-primary transition-colors truncate">{r.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
