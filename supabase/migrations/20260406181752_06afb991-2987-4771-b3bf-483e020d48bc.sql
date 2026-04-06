
ALTER TABLE public.changelog_subscribers RENAME COLUMN name TO first_name;
ALTER TABLE public.changelog_subscribers ADD COLUMN last_name TEXT NOT NULL DEFAULT '';
ALTER TABLE public.changelog_subscribers ADD COLUMN company_name TEXT NOT NULL DEFAULT '';
