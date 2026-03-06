import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowRight, Zap, Rocket, Users, Briefcase, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;

const AnimatedNumber = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
          };
          rafRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return <span ref={ref}>{value}</span>;
};

const SkeletonCard = () => (
  <div className="glass rounded-xl p-8 md:p-12">
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="w-full md:w-1/2 aspect-video skeleton" />
      <div className="w-full md:w-1/2 space-y-4">
        <div className="h-6 w-24 skeleton" />
        <div className="h-8 w-3/4 skeleton" />
        <div className="h-4 w-full skeleton" />
        <div className="h-4 w-2/3 skeleton" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const [featured, setFeatured] = useState<Project | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<Project[]>([]);
  const [counts, setCounts] = useState({ projects: 0, active: 0, ventures: 0, team: 0 });
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [fp, pc, ac, vc, tc, recent] = await Promise.all([
          supabase.from("projects").select("*").eq("featured", true).order("created_at", { ascending: false }).limit(1),
          supabase.from("projects").select("id", { count: "exact", head: true }).neq("category", "brand"),
          supabase.from("projects").select("id", { count: "exact", head: true }).neq("category", "brand").in("status", ["live", "released", "in_development"]),
          supabase.from("projects").select("id", { count: "exact", head: true }).eq("category", "brand"),
          supabase.from("staff").select("id", { count: "exact", head: true }),
          supabase.from("projects").select("*").order("updated_at", { ascending: false }).limit(3),
        ]);
        if (cancelled) return;
        let featuredProject = fp.data?.[0] ?? null;
        if (!featuredProject) {
          const { data } = await supabase.from("projects").select("*").neq("category", "brand").in("status", ["live", "released"]).order("created_at", { ascending: false }).limit(1);
          if (cancelled) return;
          featuredProject = data?.[0] ?? null;
        }
        setFeatured(featuredProject);
        setRecentUpdates(recent.data ?? []);
        setCounts({
          projects: pc.count ?? 0,
          active: ac.count ?? 0,
          ventures: vc.count ?? 0,
          team: tc.count ?? 0,
        });
      } catch {
        // Silently handle errors
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => [
    { value: counts.projects, label: "Total Projects", icon: Rocket },
    { value: counts.active, label: "Active Builds", icon: Zap },
    { value: counts.ventures, label: "Ventures", icon: Briefcase },
    { value: counts.team, label: "Team Members", icon: Users },
  ], [counts]);

  return (
    <div className="page-transition" ref={scrollRef}>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="red-dot" />
              <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Digital Studio</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.05] mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Engineering digital
              <br />
              <span className="text-primary glow-red-text">experiences</span>
            </h1>

            <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-primary/40 mb-8 opacity-0 animate-fade-in rounded-full shadow-[0_0_12px_hsl(0_100%_36%/0.4)]" style={{ animationDelay: "0.3s" }} />

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.35s" }}>
              Building immersive game experiences, launching ventures, and engineering digital products that push the boundaries of what's possible.
            </p>

            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Link to="/studio-projects" className="btn-gradient px-7 py-3.5 text-primary-foreground">
                Explore Projects <ArrowRight size={18} />
              </Link>
              <Link to="/ventures" className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary hover:border-primary/20 transition-all duration-300">
                Enter Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* Studio Overview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="red-dot" />
              <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Studio Overview</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">What We Build</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              A digital studio focused on crafting immersive Roblox experiences, launching product brands, and building scalable digital ecosystems. Every project is engineered with precision and purpose.
            </p>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* Featured Release */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 fade-up">
            <div className="red-dot" />
            <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Featured Release</h2>
          </div>
          {loading ? (
            <SkeletonCard />
          ) : featured ? (
            <div className="glass rounded-xl p-8 md:p-12 card-hover fade-up border-gradient">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video rounded-lg bg-secondary overflow-hidden">
                  {featured.thumbnail_url ? (
                    <img src={featured.thumbnail_url} alt={featured.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No thumbnail</div>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/15 text-primary rounded-full mb-4 capitalize badge-pulse">
                    {featured.status === "released" ? "Live" : featured.status.replace("_", " ")}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">{featured.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{featured.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                    <Clock size={12} /> Updated {new Date(featured.updated_at).toLocaleDateString()}
                  </div>
                  {featured.game_link && (featured.status === "live" || featured.status === "released") ? (
                    <a href={featured.game_link} target="_blank" rel="noopener noreferrer" className="btn-gradient px-6 py-3 text-sm text-primary-foreground">
                      Launch Experience <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link to={`/project/${featured.slug || featured.id}`} className="inline-flex items-center gap-2 text-primary font-medium hover:underline group">
                      View project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center fade-up">
              <p className="text-muted-foreground">No featured project yet.</p>
            </div>
          )}
        </div>
      </section>

      <div className="red-line" />

      {/* Recent Updates */}
      {recentUpdates.length > 0 && (
        <>
          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8 fade-up">
                <div className="red-dot" />
                <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Recent Updates</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {recentUpdates.map((project) => (
                  <Link
                    key={project.id}
                    to={`/project/${project.slug || project.id}`}
                    className="glass rounded-xl overflow-hidden card-hover group fade-up block"
                  >
                    <div className="aspect-video bg-secondary overflow-hidden">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No thumbnail</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">Updated {new Date(project.updated_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <div className="red-line" />
        </>
      )}

      {/* Live Studio Metrics */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-16 fade-up">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Live Studio Metrics</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 fade-up">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-6 text-center group card-hover border-gradient">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <stat.icon size={22} className="text-primary" />
                </div>
                <div className="text-3xl md:text-5xl font-display font-bold text-primary mb-2">
                  <AnimatedNumber target={stat.value} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
