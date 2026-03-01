import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to backend later
  };

  return (
    <div className="page-transition">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">
              Reach Out
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Contact
          </h1>
          <p className="text-muted-foreground mb-12">
            Best way to reach me is via Discord.
          </p>

          {/* Discord card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-12 card-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="text-primary" size={22} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">Discord</h3>
                <p className="text-primary font-medium">PaszczureQ</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="red-line mb-12" />

          <h2 className="text-xl font-display font-semibold mb-6">
            Or send a message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="Your name"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="you@email.com"
                required
                maxLength={255}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                placeholder="What's on your mind?"
                required
                maxLength={1000}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover-glow hover:bg-primary/90 transition-colors"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
