#!/usr/bin/env bash
set -euo pipefail

# --- preflight ---
echo "==> Checking basic tools..."
command -v node >/dev/null 2>&1 || echo "WARNING: node not found. Install Node >=20."
command -v npm  >/dev/null 2>&1 || echo "WARNING: npm not found. Install npm (bundled with Node)."
command -v python3 >/dev/null 2>&1 || echo "WARNING: python3 not found. Install Python >=3.11."
command -v pip3 >/dev/null 2>&1 || echo "WARNING: pip3 not found. Ensure Python pip is installed."
# Supabase CLI optional:
if ! command -v supabase >/dev/null 2>&1; then
  echo "NOTE: Supabase CLI not found. You can install later (brew install supabase/tap/supabase)."
fi

# --- create root & common files ---
mkdir -p NBA_Stats_LLM && cd NBA_Stats_LLM
printf "PORT_EXPRESS=4000\nPORT_PYAI=8000\nNEXT_PUBLIC_API_URL=http://localhost:4000\nNEXT_PUBLIC_PYAI_URL=http://localhost:8000\n" > .env.example
printf "# NBA_Stats_LLM\n\nProject scaffolding generated.\n" > README.md

# --- frontend (Next.js) ---
echo "==> Scaffolding frontend (Next.js)..."
npx --yes create-next-app@latest frontend --ts --eslint --tailwind --app --src-dir --no-import-alias --use-npm
# add env example
printf "NEXT_PUBLIC_API_URL=http://localhost:4000\nNEXT_PUBLIC_PYAI_URL=http://localhost:8000\n" > frontend/.env.example

# --- backend: express-api ---
echo "==> Scaffolding backend/express-api..."
mkdir -p backend/express-api/src/{routes,services,mappers,cache,utils}
pushd backend/express-api >/dev/null
npm init -y >/dev/null
npm i express cors axios zod dotenv supabase-js
npm i -D typescript ts-node @types/express @types/node nodemon
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --target es2022 >/dev/null
printf "BALDONTLIE_API_KEY=\nSUPABASE_URL=\nSUPABASE_SERVICE_ROLE_KEY=\n" > .env.example
# placeholders (no business logic)
printf "// TODO: mount routes, CORS, healthcheck\n" > src/index.ts
printf "// TODO: /players, /seasons, /games, /series routes\n" > src/routes/placeholder.ts
printf "// TODO: provider client(s) for balldontlie & proxy to python nba_api\n" > src/services/placeholder.ts
printf "// TODO: map provider payloads to unified schema\n" > src/mappers/placeholder.ts
printf "// TODO: supabase cache helpers\n" > src/cache/placeholder.ts
printf "// TODO: validation, enums, error helpers\n" > src/utils/placeholder.ts
popd >/dev/null

# --- backend: python-llm ---
echo "==> Scaffolding backend/python-llm..."
mkdir -p backend/python-llm/app
pushd backend/python-llm >/dev/null
python3 -m venv .venv
. .venv/bin/activate
pip3 install --upgrade pip >/dev/null
pip3 install fastapi "uvicorn[standard]" pydantic "openai>=1.0.0" google-generativeai nba_api python-dotenv >/dev/null
printf "OPENAI_API_KEY=\nGOOGLE_API_KEY=\nPROVIDER_PRIMARY=balldontlie\n" > .env.example
printf "# requirements managed by pip freeze\n" > requirements.txt
# placeholders (no business logic)
printf "" > app/__init__.py
printf "# TODO: define FastAPI app with /interpret and /answer\n" > app/main.py
printf "# TODO: map NL question -> structured JSON query\n" > app/planner.py
printf "# TODO: nba_api fetchers & series aggregation\n" > app/fetchers.py
printf "# TODO: Pydantic schemas for query/result\n" > app/schemas.py
deactivate
popd >/dev/null

# --- supabase notes ---
mkdir -p supabase
printf "## Tables (create via Supabase dashboard)\n\n- players_cache: id, full_name, provider_ids\n- teams_cache: id, name, abbr, provider_ids\n- queries: id, text, parsed_json, created_at\n- results_cache: id, hash_key, json, ttl\n" > supabase/schema.md
printf "## Policies\n- read-only for anon on results_cache (optional)\n- service role for writes from Express\n" > supabase/policies.md

# --- docs ---
mkdir -p docs
printf "## REST contract\n- GET /players/search?name=\n- GET /players/:playerId/season?season=&type=regular|playoffs\n- GET /players/:playerId/games?filters...\n- GET /players/:playerId/series?season=\n" > docs/API_contract.md
printf "## Examples\n- \"Dennis Schroder 2025 playoffs game log\" -> {player, season:2025, type:playoffs, granularity:games}\n" > docs/Query_examples.md
printf "## Decisions\n- Primary: balldontlie; Fallback: nba_api in Python\n" > docs/Decisions.md

# --- scripts ---
mkdir -p scripts
printf "#!/usr/bin/env bash\n# Start services (each in its own terminal ideally)\n" > scripts/dev.sh
chmod +x scripts/dev.sh

echo "==> Done. Next steps:"
echo "1) Copy .env.example files to .env and fill keys."
echo "2) Run each service in dev mode."
