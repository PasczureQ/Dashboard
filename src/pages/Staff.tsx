import { MessageSquare } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  description: string;
  contact: string;
}

const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "PaszczureQ",
    role: "Owner & Founder",
    description:
      "Creator, developer, and visionary behind all projects. Passionate about building digital experiences and brands.",
    contact: "Discord: PaszczureQ",
  },
];

const Staff = () => {
  return (
    <div className="page-transition">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
              Team
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Staff
          </h1>
          <p className="text-muted-foreground max-w-lg mb-12">
            Meet the team behind the projects. Staff is managed through the admin panel.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border rounded-lg p-6 card-hover group"
              >
                {/* Avatar placeholder */}
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5 group-hover:glow-red-sm transition-shadow duration-300">
                  <span className="text-2xl font-display font-bold text-primary">
                    {member.name[0]}
                  </span>
                </div>

                <h3 className="text-xl font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <span className="text-sm text-primary font-medium">{member.role}</span>
                <p className="text-sm text-muted-foreground mt-3 mb-4">
                  {member.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare size={14} className="text-primary" />
                  {member.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Staff;
