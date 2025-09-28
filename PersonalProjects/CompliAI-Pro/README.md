# CompliAI Pro — Automated CMMC Readiness (Hackathon Demo)

Automates ~50% of the "easy wins" for CMMC/NIST/ISO audit prep by parsing policies & configs,
auto-mapping evidence to controls, and generating a pre-audit scorecard + handoff list.

## Architecture (MVP)
- **Frontend:** Next.js (TypeScript) — upload evidence, view scorecard, export.
- **Backend:** FastAPI (Python) — PDF/text parsing, YAML/JSON config checks, control mapping, scoring.
- **AI Hook (Placeholder):** Swap in Gemini or your LLM of choice to enrich policy mapping beyond keywords.
- **DB (Optional):** MongoDB Atlas for storing evidence/results (not required for demo).
- **Auth (Optional):** PropelAuth for org workspaces (not required for demo).

## Quick Start
1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
./run.sh
```
- API runs at http://localhost:8000

2) Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
- UI runs at http://localhost:3000

3) Try the sample
- Policy: `samples/policy.txt`
- Config:  `samples/config.yaml`

## Endpoints
- `POST /analyze` — multipart form: `policy_file`, `config_file`
- `GET  /crosswalk.json` — seed crosswalk (20 controls)
- `GET  /health`

## Cross-Framework Mapping (seed, 20 items)
Demonstrative overlap across CMMC 2.0 (selected L1/L2 practices), NIST SP 800-171, and ISO/IEC 27001 Annex A (2013).
**Validate against the latest publications for production (e.g., NIST SP 800-171 Rev. 3).**

## Stretch Goals
- Multi-framework expansion & crosswalk editor
- Collaboration (assign owners, comments)
- Continuous monitoring (schedule re-checks)
- Export: JSON/CSV/PDF (add a PDF export route)

## Notes
- PDF parsing uses `pdfminer.six`. If you upload a PDF policy, the backend extracts text; otherwise .txt/.md also work.
- The rule engine covers representative "easy wins": MFA, password length, log retention, TLS, encryption at rest, etc.
- "Partial" status example: logs retained 90 days (meets CMMC/NIST signal) but not ISO 180 days suggestion.
- "Policy (needs tech evidence)" means the policy mentions a control, but no config proof was found.

## Legal/Compliance
- This demo is for **illustration only**. Always confirm control wording, thresholds, and mappings with official sources.
- FIPS-validated crypto and other specifics must be enforced for production and may vary by environment and contract.