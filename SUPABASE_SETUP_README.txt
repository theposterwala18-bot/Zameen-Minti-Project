Zameen Minti Project v63 - Supabase Ready

Files added:
1. supabase_config.js
2. supabase_integration.js
3. supabase_schema_v34.sql

Setup:
1. Create Supabase project.
2. Run supabase_schema_v34.sql in SQL Editor.
3. Go to Project Settings > API.
4. Copy Project URL and anon public key.
5. Paste into supabase_config.js.
6. Deploy to Netlify/GitHub again.
7. Signup with owner email.
8. In SQL Editor run:
   update public.profiles set role='owner', plan='premium' where email='YOUR_EMAIL_HERE';

What this prepares:
- Client signup/login in Supabase Auth
- Profiles table
- Realtime messages table
- Admin inbox from database
- Client-wise reports table
- Owner role / premium future structure



## Zameen Minti Project v63
- Visible version strip added to site UI.
- Footer contact added.
- Contact Email: dhaliwalballi18@gmail.com
- Feedback / Suggestion 2026-27
- Reminder: every future ZIP and site update must include updated version number.
