import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "border border-primary/40 text-primary bg-primary/5" },
  out: { label: "Active", className: "border border-primary/40 text-primary bg-primary/5" },
  launching_soon: { label: "Launching Soon", className: "border border-accent/40 text-accent bg-accent/5 animate-pulse" },
  construction: { label: "Launching Soon", className: "border border-accent/40 text-accent bg-accent/5 animate-pulse" },
};

const SkeletonCard = () => (
  <div className="glass rounded-xl overflow-hidden">
    <div className="aspect-video skeleton" />
    <div className="p-6 space-y-3">
      <div className="h-4 w-20 skeleton" />
      <div className="h-6 w-3/4 skeleton" />
      <div className="h-4 w-full skeleton" />
      <div className="h-4 w-2/3 skeleton" />
    </div>
  </div>
);

const Ventures = () => {
  const [ventures, setVentures] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").eq("category", "brand").order("display_order");
        if (error) throw error;
        if (!cancelled) setVentures(data ?? []);
      } catch (err) {
        console.error("[v0] Failed to load ventures:", err);
        if (!cancelled) setError("Unable to load ventures. Please try again.");
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-transition" ref={scrollRef}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Brand Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Ventures</h1>
          <p className="text-muted-foreground max-w-lg mb-12">Independent brands & product lines built from the ground up.</p>

          {error ? (
            <div className="glass rounded-xl p-8 max-w-md mx-auto text-center">
              <h3 className="text-lg font-display font-bold mb-2">Connection Issue</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-gradient px-5 py-2 text-sm text-primary-foreground">
                Refresh
              </button>
            </div>
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : ventures.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles size={48} className="text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No ventures launched yet. Stay tuned.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {ventures.map((venture) => {
                const isActive = venture.status === "active" || venture.status === "out";
                return (
                  <Link
                    key={venture.id}
                    to={`/ventures/${venture.id}`}
                    className="glass rounded-xl overflow-hidden card-hover group fade-up block"
                  >
                    <div className="aspect-video bg-secondary overflow-hidden relative">
                      {venture.thumbnail_url ? (
                        <img src={venture.thumbnail_url} alt={venture.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No logo</div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusConfig[venture.status]?.className || "bg-muted text-muted-foreground"}`}>
                          {statusConfig[venture.status]?.label || venture.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      {venture.brand_type && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize mb-3 inline-block">{venture.brand_type}</span>
                      )}
                      <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{venture.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{venture.description}</p>
                      <span className="inline-flex items-center gap-2 text-sm text-primary font-medium group-hover:underline">
                        {isActive ? "View Brand" : "Learn More"} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ventures;
