import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Social = Tables<"socials">;

const Footer = () => {
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    supabase
      .from("socials")
      .select("*")
      .eq("enabled", true)
      .order("display_order")
      .then(({ data }) => setSocials(data ?? []));
  }, []);

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link to="/" className="font-display text-lg font-bold tracking-tight">
              <span className="text-primary">P</span>aszczureQ
            </Link>
            <p className="text-xs text-muted-foreground mt-1">Engineering digital experiences that push boundaries.</p>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((s) =>
              s.url ? (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                  aria-label={s.platform}
                >
                  <span className="text-xs font-bold">{s.platform[0]}</span>
                </a>
              ) : null
            )}
          </div>
        </div>

        <div className="red-line my-6" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} PaszczureQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
