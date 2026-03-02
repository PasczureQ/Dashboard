import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import useScrollFadeIn from "@/hooks/useScrollFadeIn";

type StaffMember = Tables<"staff">;

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useScrollFadeIn();

  useEffect(() => {
    supabase.from("staff").select("*").order("display_order").then(({ data }) => {
      setStaff(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page-transition" ref={scrollRef}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Team</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Staff</h1>
          <p className="text-muted-foreground max-w-lg mb-12">Meet the team behind the projects.</p>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : staff.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No staff members yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
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
                    {/* Red glow circle on hover */}
                    <div className="absolute -inset-1 rounded-full bg-primary/0 group-hover:bg-primary/5 blur-xl transition-all duration-500 -z-10" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                  <span className="text-sm text-primary font-medium">{member.role}</span>
                  {member.description && <p className="text-sm text-muted-foreground mt-3 mb-4 leading-relaxed">{member.description}</p>}
                  {member.contact && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare size={14} className="text-primary" />
                      {member.contact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Staff;
