import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center">
        <div className="red-dot animate-pulse-glow" />
      </div>
    );
  }

  if (user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-display font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-sm text-destructive">
              {error}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover-glow hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
