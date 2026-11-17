-- KodeLaci Database Schema (Supabase / PostgreSQL)
-- Aman dijalankan baik pada database baru maupun untuk migrasi tabel KodeLaci yang sudah ada.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username varchar(30) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    avatar_url text NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url text NULL;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 2. Tabel Snippets
CREATE TABLE IF NOT EXISTS public.snippets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    forked_from uuid NULL REFERENCES public.snippets(id) ON DELETE SET NULL,
    title varchar(100) NOT NULL,
    description varchar(500) NOT NULL DEFAULT '',
    code text NOT NULL,
    language varchar(30) NOT NULL,
    is_public boolean NOT NULL DEFAULT false,
    slug varchar(80) NULL,
    search_vector tsvector,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT chk_snippets_public_slug CHECK (
        (is_public = false AND slug IS NULL) OR
        (is_public = true AND slug IS NOT NULL)
    ),
    CONSTRAINT chk_snippets_no_self_fork CHECK (
        forked_from IS DISTINCT FROM id
    )
);

ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS forked_from uuid NULL REFERENCES public.snippets(id) ON DELETE SET NULL;
ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS description varchar(500) NOT NULL DEFAULT '';
ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS slug varchar(80) NULL;
ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE public.snippets ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- 3. Tabel Tags & Junction Snippet_Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(30) NOT NULL UNIQUE,
    slug varchar(35) NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ADD COLUMN IF NOT EXISTS slug varchar(35);
ALTER TABLE public.tags ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

UPDATE public.tags
SET slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'public.tags'::regclass
          AND contype = 'u'
          AND conkey = ARRAY[
              (SELECT attnum FROM pg_attribute WHERE attrelid = 'public.tags'::regclass AND attname = 'slug')
          ]
    ) THEN
        ALTER TABLE public.tags ADD CONSTRAINT tags_slug_key UNIQUE (slug);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.snippet_tags (
    snippet_id uuid NOT NULL REFERENCES public.snippets(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (snippet_id, tag_id)
);

-- 4. Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_snippets_slug_unique
    ON public.snippets (slug)
    WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_snippets_user_created
    ON public.snippets (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_snippets_public_created
    ON public.snippets (created_at DESC)
    WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_snippets_public_language
    ON public.snippets (language, created_at DESC)
    WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_snippets_forked_from
    ON public.snippets (forked_from)
    WHERE forked_from IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_snippets_search_vector
    ON public.snippets USING GIN (search_vector);

CREATE INDEX IF NOT EXISTS idx_snippet_tags_tag_id
    ON public.snippet_tags (tag_id, snippet_id);

-- 5. Trigger Function: updated_at otomatis
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_snippets_updated_at ON public.snippets;
CREATE TRIGGER trg_snippets_updated_at
    BEFORE UPDATE ON public.snippets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. Trigger Function: search_vector otomatis (lewati jika kolom search_vector sudah GENERATED ALWAYS)
CREATE OR REPLACE FUNCTION public.snippets_search_vector_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('simple', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.language, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.code, '')), 'C');
    RETURN NEW;
END;
$$;

DO $$
DECLARE
    gen_type text;
BEGIN
    SELECT is_generated INTO gen_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'snippets'
      AND column_name = 'search_vector';

    DROP TRIGGER IF EXISTS trg_snippets_search_vector ON public.snippets;

    IF COALESCE(gen_type, 'NEVER') = 'NEVER' THEN
        CREATE TRIGGER trg_snippets_search_vector
            BEFORE INSERT OR UPDATE OF title, description, language, code
            ON public.snippets
            FOR EACH ROW
            EXECUTE FUNCTION public.snippets_search_vector_update();
    END IF;
END $$;

-- 7. Row Level Security (akses database hanya melalui backend service_role)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;
