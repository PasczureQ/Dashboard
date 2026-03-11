import { useState, useMemo } from "react";
import { MessageSquare, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Connect = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, message: false });

  const validation = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      name: form.name.trim().length >= 2,
      email: emailRegex.test(form.email.trim()),
      message: form.message.trim().length >= 10,
    };
  }, [form]);

  const isValid = validation.name && validation.email && validation.message;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    
    if (!isValid) {
      toast({ title: "Validation Error", description: "Please fill out all fields correctly.", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("Contact form error:", err);
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-transition">
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="red-dot" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider uppercase">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Let's Build Something.</h1>
          <p className="text-muted-foreground mb-12">Have an idea? Want to collaborate? Reach out.</p>

          <div className="glass rounded-xl p-6 mb-12 card-hover border-gradient">
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

          <div className="red-line mb-12" />
          <h2 className="text-xl font-display font-semibold mb-6">Or send a message</h2>

          {sent ? (
            <div className="glass rounded-xl p-8 text-center animate-fade-in border-gradient">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">Message Sent!</h3>
              <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Name</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  onBlur={() => handleBlur("name")}
                  className={`w-full px-4 py-3 bg-secondary/50 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${touched.name && !validation.name ? "border-destructive" : "border-border"}`} 
                  placeholder="Your name" 
                  required 
                  maxLength={100} 
                />
                {touched.name && !validation.name && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> Name must be at least 2 characters
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Email</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 bg-secondary/50 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${touched.email && !validation.email ? "border-destructive" : "border-border"}`} 
                  placeholder="you@email.com" 
                  required 
                  maxLength={255} 
                />
                {touched.email && !validation.email && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> Please enter a valid email address
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Message</label>
                <textarea 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  onBlur={() => handleBlur("message")}
                  rows={5} 
                  className={`w-full px-4 py-3 bg-secondary/50 border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none ${touched.message && !validation.message ? "border-destructive" : "border-border"}`} 
                  placeholder="What's on your mind?" 
                  required 
                  maxLength={1000} 
                />
                {touched.message && !validation.message && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> Message must be at least 10 characters
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground text-right">{form.message.length}/1000</p>
              </div>
              <button type="submit" disabled={submitting || !isValid} className="btn-gradient px-7 py-3.5 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Connect;
