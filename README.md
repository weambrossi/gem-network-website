# GEM Website

Marketing site for GEM with a Supabase-backed membership interest form.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file at `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

3. Start the dev server:

```bash
npm run dev
```

## Supabase notes

- Vite does not load `.env.example`; it only reads `.env`, `.env.local`, and environment-specific variants such as `.env.development`.
- If you paste the Supabase dashboard project URL, the app will convert it to the matching API URL automatically.
- `VITE_SUPABASE_ANON_KEY` must be the public anon key from Supabase. Do not use a secret key that starts with `sb_secret_`.
