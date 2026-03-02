import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type Project = Tables<"projects">;

const AnimatedNumber = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

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
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{value}</span>;
};

const Dashboard = () => {
  const [featured, setFeatured] = useState<Project | null>(null);
  const [counts, setCounts] = useState({ projects: 0, active: 0, brands: 0 });
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    const load = async () => {
      const [fp, pc, ac, bc] = await Promise.all([
        supabase.from("projects").select("*").in("status", ["released", "out"]).order("created_at", { ascending: false }).limit(1),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["released", "out"]),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("category", "brand"),
      ]);
      setFeatured(fp.data?.[0] ?? null);
      setCounts({ projects: pc.count ?? 0, active: ac.count ?? 0, brands: bc.count ?? 0 });
    };
    load();
  }, []);

  return (
    <div className="page-transition" ref={scrollRef}>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />
        <div className="absolute top-24 right-32 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
        <div className="absolute bottom-32 left-24 w-1 h-1 rounded-full bg-primary/60 animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-16 w-1 h-1 rounded-full bg-primary/40 animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="red-dot" />
              <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Creator & Developer</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Building digital
              <br />
              <span className="text-primary glow-red-text">experiences</span>
            </h1>

            {/* Animated red accent line */}
            <div className="w-24 h-0.5 bg-primary mb-8 opacity-0 animate-fade-in rounded-full shadow-[0_0_12px_hsl(0_100%_36%/0.4)]" style={{ animationDelay: "0.3s" }} />

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.35s" }}>
              I create immersive Roblox games, build brands, and craft digital experiences that push boundaries. Welcome to my world.
            </p>

            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover-glow hover:bg-primary/90 transition-all duration-300 hover:scale-[1.02]"
              >
                View Projects <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-foreground font-semibold rounded-md hover:bg-secondary hover:border-primary/20 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* About short */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center fade-up">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">About Me</h2>
            <p className="text-muted-foreground leading-relaxed">
              I'm a passionate digital creator focused on building engaging Roblox experiences and launching innovative brands. I combine creativity with technical expertise to deliver premium digital products.
            </p>
          </div>
        </div>
      </section>

      <div className="red-line" />

      {/* Featured Project */}
      {featured && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8 fade-up">
              <div className="red-dot" />
              <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">Featured Project</h2>
            </div>
            <div className="glass rounded-xl p-8 md:p-12 card-hover fade-up">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-video rounded-lg bg-secondary overflow-hidden">
                  {featured.thumbnail_url ? (
                    <img src={featured.thumbnail_url} alt={featured.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No thumbnail</div>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/15 text-primary rounded-full mb-4 capitalize">{featured.status}</span>
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">{featured.name}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{featured.description}</p>
                  <Link to="/projects" className="inline-flex items-center gap-2 text-primary font-medium hover:underline group">
                    View all projects <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="red-line" />

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center fade-up">
            {[
              { value: counts.projects, label: "Total Projects" },
              { value: counts.active, label: "Active Projects" },
              { value: counts.brands, label: "Brands Created" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl md:text-5xl font-display font-bold text-primary mb-2 group-hover:glow-red-text transition-all duration-300">
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

export default Dashboard;
