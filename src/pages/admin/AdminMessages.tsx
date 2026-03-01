import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Mail } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Message = Tables<"contact_messages">;

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    fetchMessages();
  };

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    fetchMessages();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Messages</h1>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`bg-card border rounded-lg p-4 ${m.read ? "border-border" : "border-primary/30"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!m.read && <div className="red-dot" />}
                  <h3 className="font-semibold">{m.name}</h3>
                  <span className="text-xs text-muted-foreground">{m.email}</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {!m.read && (
                  <button onClick={() => markRead(m.id)} className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground">
                    <Mail size={16} />
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-muted-foreground py-8">No messages yet.</p>}
      </div>
    </div>
  );
};

export default AdminMessages;
