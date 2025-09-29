
# CompliAI Pro — RAG Citations (Full Project)

Automates "easy win" compliance checks (CMMC/NIST/ISO), **plus** attaches live **citations** from the official **CMMC L1 Assessment Guide** and **NIST SP 800-171** PDFs (RAG-lite).

## Run (two terminals)

### Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
./run.sh
```
API: http://localhost:8000

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
UI: http://localhost:3000

## How it works
- **Crosswalk**: small set of overlapping controls (MFA, passwords, logging, TLS, encrypt-at-rest, lockout, session lock, VPN, least privilege).
- **Evidence**: policy keywords + config checks (YAML/JSON).
- **Citations**: on startup, we parse the PDFs in `backend/guidelines/`, chunk into passages, and for each control we find matching excerpts by **control ID** + **keywords**.

## Endpoints
- `POST /analyze` — returns `{ results[], score, missing_evidence[] }` and includes `citations[]` per result row.
- `GET /guideline_refs?control=MFA` — returns top passages for a control.
- `GET /health` — simple health check.

## Notes
- This is a **demo**. Validate control mappings and thresholds before production.
- You can extend `CROSSWALK` and add more config checks easily.
# CompliAI
