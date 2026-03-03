# Supabase Keep-Alive

Prevents free-tier Supabase projects from pausing due to inactivity. A GitHub Actions cron job pings each database every 3 days.

**Zero dependencies. Zero cost. Zero infrastructure.**

## Setup

1. Push this repo to GitHub.
2. For each Supabase project, grab the following from the dashboard:
   - **name** — any label you want (for logs only)
   - **url** — **Settings → Data API** → Project URL
   - **key** — **Settings → API Keys → Legacy anon, service_role API keys** tab → **anon** key
     > **Important**: Use the **legacy anon** key, not the new publishable key (`sb_publishable_...`). The publishable key does not have schema access and will return a 401 error.
3. Add a repository secret (**Settings → Secrets and variables → Actions → New repository secret**):
   - **Name**: `SUPABASE_PROJECTS`
   - **Value**: a JSON array:
     ```json
     [
       { "name": "My Project", "url": "https://xxxxx.supabase.co", "key": "legacy-anon-key" },
       { "name": "Other Project", "url": "https://yyyyy.supabase.co", "key": "other-anon-key" }
     ]
     ```
4. Go to **Actions** → **Supabase Keep-Alive** → **Run workflow** to test.

To add a new project later, just append to the JSON array in the secret.

## How it works

Every 3 days, the workflow runs `node scripts/ping.mjs` which:

- Reads the `SUPABASE_PROJECTS` secret
- Hits each project's PostgREST endpoint (`GET /rest/v1/?limit=1`)
- Logs success/failure per project
- Exits non-zero if any ping fails (marks the run as failed)

This keeps each project active within Supabase's 7-day inactivity window.
