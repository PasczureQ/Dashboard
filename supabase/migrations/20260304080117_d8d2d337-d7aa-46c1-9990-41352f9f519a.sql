
-- Site settings table for maintenance mode
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO public.site_settings (maintenance_mode, maintenance_message) VALUES (false, '');

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed to check maintenance mode)
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
