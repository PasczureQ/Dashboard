const MaintenancePage = ({ message }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      {/* Animated border */}
      <div className="absolute inset-4 border border-primary/10 rounded-2xl pointer-events-none" />

      <div className="text-center relative z-10 px-6 max-w-lg animate-fade-in">
        {/* Pulsing dot */}
        <div className="w-4 h-4 mx-auto mb-8 rounded-full bg-primary animate-pulse-glow" />

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 animate-glow-pulse">
          System Maintenance
        </h1>

        <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-6 rounded-full" />

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          We are currently upgrading the system. Please check back soon.
        </p>

        {message && (
          <div className="glass rounded-xl p-5 text-sm text-foreground/80 border-gradient">
            {message}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="red-dot" style={{ width: 6, height: 6 }} />
          <span>PaszczureQ Studio</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
