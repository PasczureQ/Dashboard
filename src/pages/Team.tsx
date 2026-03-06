import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type StaffMember = Tables<"staff">;

const SkeletonCard = () => (
  <div className="glass rounded-xl p-6 space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full skeleton" />
      <div className="space-y-2 flex-1">
        <div className="h-5 w-32 skeleton" />
        <div className="h-4 w-20 skeleton" />
      </div>
    </div>
    <div className="h-4 w-full skeleton" />
    <div className="h-4 w-2/3 skeleton" />
  </div>
);

const Team = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    let cancelled = false;
    supabase.from("staff").select("*").order("display_order").then(({ data }) => {
      if (!cancelled) {
        setStaff(data ?? []);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-transition" ref={scrollRef}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Our People</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Team</h1>
          <p className="text-muted-foreground max-w-lg mb-12">The people behind the studio.</p>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No team members yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => {
                const socialLinks = member.social_links as Record<string, string> | null;
                return (
                  <div key={member.id} className="glass rounded-xl p-6 card-hover group fade-up">
                    <div className="relative mb-5">
                      {member.profile_picture_url ? (
                        <img
                          src={member.profile_picture_url}
                          alt={member.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-border group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-border group-hover:border-primary/40 transition-all duration-300">
                          <span className="text-2xl font-display font-bold text-primary">{member.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                    <span className="text-sm text-primary font-medium">{member.role}</span>
                    {member.description && <p className="text-sm text-muted-foreground mt-3 mb-4 leading-relaxed">{member.description}</p>}
                    {member.contact && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MessageSquare size={14} className="text-primary" />
                        {member.contact}
                      </div>
                    )}
                    {socialLinks && Object.keys(socialLinks).length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {Object.entries(socialLinks).map(([platform, url]) => url ? (
                          <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all font-bold capitalize">
                            {platform[0]}
                          </a>
                        ) : null)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Team;
