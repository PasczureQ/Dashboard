import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="red-dot" />
              <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
                Creator & Developer
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Building digital
              <br />
              <span className="text-primary glow-red-text">experiences</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.35s" }}>
              I create immersive Roblox games, build brands, and craft digital
              experiences that push boundaries. Welcome to my world.
            </p>

            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover-glow hover:bg-primary/90 transition-colors"
              >
                View Projects
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-semibold rounded-md hover:bg-secondary transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="red-line" />

      {/* Featured Project */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="red-dot" />
            <h2 className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
              Featured Project
            </h2>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 md:p-12 card-hover">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 aspect-video rounded-md bg-secondary flex items-center justify-center overflow-hidden">
                <div className="text-muted-foreground text-sm">
                  Latest project thumbnail
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/15 text-primary rounded-full mb-4">
                  Released
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">
                  Your Latest Project
                </h3>
                <p className="text-muted-foreground mb-6">
                  This section will dynamically display your most recent
                  released project once the admin panel is connected.
                </p>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                >
                  View all projects <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="red-line" />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "—", label: "Projects" },
              { value: "—", label: "Staff" },
              { value: "—", label: "Brands" },
              { value: "∞", label: "Ideas" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
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
