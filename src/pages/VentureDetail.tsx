import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const VentureDetail = () => {
  const { id } = useParams();
  const [venture, setVenture] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("projects").select("*").eq("id", id).single().then(({ data }) => {
      setVenture(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center">
        <div className="red-dot animate-pulse-glow" />
      </div>
    );
  }

  if (!venture) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Venture not found</h2>
          <Link to="/ventures" className="text-primary hover:underline">← Back to Ventures</Link>
        </div>
      </div>
    );
  }

  const isActive = venture.status === "active" || venture.status === "out";
  const isLaunching = venture.status === "launching_soon" || venture.status === "construction";
  const images = venture.product_images ?? [];

  return (
    <div className="page-transition">
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10">
            <X size={28} />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/ventures" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Ventures
          </Link>

          {/* Hero */}
          <div className="glass rounded-xl p-8 md:p-12 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {venture.thumbnail_url && (
                <div className="w-full md:w-1/3 aspect-square rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  <img src={venture.thumbnail_url} alt={venture.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {venture.brand_type && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">{venture.brand_type}</span>
                  )}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isActive ? "border border-primary/40 text-primary bg-primary/5" : "border border-accent/40 text-accent bg-accent/5"
                  }`}>
                    {isActive ? "Active" : "Launching Soon"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{venture.name}</h1>
                <p className="text-muted-foreground leading-relaxed">{venture.description}</p>
              </div>
            </div>
          </div>

          {/* Launching Soon state */}
          {isLaunching && (
            <div className="glass rounded-xl p-12 text-center mb-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="red-dot" style={{ width: 12, height: 12 }} />
              </div>
              <h2 className="text-2xl font-display font-bold mb-3">Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">This venture is currently in development. Stay tuned for the launch.</p>
            </div>
          )}

          {/* Product Gallery */}
          {isActive && images.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="red-dot" />
                <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Product Showcase</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(img)}
                    className="aspect-square rounded-lg bg-secondary overflow-hidden card-hover group"
                  >
                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VentureDetail;
