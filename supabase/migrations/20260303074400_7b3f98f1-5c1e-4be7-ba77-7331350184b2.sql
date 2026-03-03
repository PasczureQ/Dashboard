
-- Add featured, slug, views_count to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS views_count integer NOT NULL DEFAULT 0;

-- Generate slugs from existing names
UPDATE public.projects SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'));

-- Add unique constraint on slug
ALTER TABLE public.projects ADD CONSTRAINT projects_slug_unique UNIQUE (slug);

-- Add social_links to staff
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}';

-- Create activity_log table for admin
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read activity log"
ON public.activity_log FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activity log"
ON public.activity_log FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
