import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-transition min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="text-center relative z-10">
        <h1 className="text-8xl md:text-9xl font-display font-bold text-primary glow-red-text mb-4">404</h1>
        <div className="w-16 h-0.5 bg-primary mx-auto mb-6 rounded-full shadow-[0_0_12px_hsl(0_100%_36%/0.4)]" />
        <p className="text-xl text-muted-foreground mb-8">This page doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-md hover-glow hover:bg-primary/90 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
