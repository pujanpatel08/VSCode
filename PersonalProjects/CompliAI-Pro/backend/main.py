import os
import io
import json
import re
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yaml

# Optional: PDF parsing
try:
    from pdfminer.high_level import extract_text
except Exception:
    extract_text = None

app = FastAPI(title="CompliAI Pro - CMMC Readiness API", version="0.1.0")

# CORS for local dev (Next.js default: 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Seed: 20 crosswalk controls (CMMC L1/L2 + NIST 800-171 + ISO 27001 (Annex A 2013 ref)) ---
# NOTE: For demo purposes only. Real mappings should be validated against latest publications.
CROSSWALK = {
    "MFA": {
        "keywords": ["mfa", "multi-factor", "multifactor", "two-factor", "2fa"],
        "CMMC": "IA.2.078",
        "NIST_800_171": "3.5.3",
        "ISO_27001": "A.9.4.2",
        "check": "config.auth.mfa == true or policy mentions MFA for remote access"
    },
    "Password Policy": {
        "keywords": ["password", "passphrase"],
        "CMMC": "AC.1.002",
        "NIST_800_171": "3.1.1",
        "ISO_27001": "A.9.2.3",
        "check": "password_min_length >= 8 (demo threshold)"
    },
    "Log Retention": {
        "keywords": ["log retention", "retain logs", "90 days", "180 days"],
        "CMMC": "AU.2.041",
        "NIST_800_171": "3.3.1",
        "ISO_27001": "A.12.4.1",
        "check": "logging.retention_days >= 90 (CMMC/NIST), >=180 (ISO suggested)"
    },
    "Account Lockout": {
        "keywords": ["account lock", "unsuccessful logon", "lockout"],
        "CMMC": "AC.1.007",
        "NIST_800_171": "3.1.8",
        "ISO_27001": "A.9.4.3",
        "check": "limit unsuccessful logon attempts"
    },
    "Session Lock": {
        "keywords": ["session lock", "screen lock"],
        "CMMC": "AC.2.016",
        "NIST_800_171": "3.1.10",
        "ISO_27001": "A.11.2.8",
        "check": "use session lock after inactivity"
    },
    "Remote Access Control": {
        "keywords": ["remote access", "vpn"],
        "CMMC": "AC.3.014",
        "NIST_800_171": "3.1.12",
        "ISO_27001": "A.13.1.1",
        "check": "monitor and control remote access sessions"
    },
    "Wireless Access Auth": {
        "keywords": ["wireless", "wifi", "wlan"],
        "CMMC": "AC.3.016",
        "NIST_800_171": "3.1.17",
        "ISO_27001": "A.13.1.1",
        "check": "authenticate & encrypt wireless access"
    },
    "Mobile Device Encryption": {
        "keywords": ["mobile", "portable", "laptop encryption"],
        "CMMC": "MP.3.125",
        "NIST_800_171": "3.1.19",
        "ISO_27001": "A.8.2.3",
        "check": "encrypt CUI on mobile devices"
    },
    "Media Sanitization": {
        "keywords": ["sanitize media", "media destroy", "wipe"],
        "CMMC": "MP.2.121",
        "NIST_800_171": "3.8.3",
        "ISO_27001": "A.8.3.2",
        "check": "sanitize/destroy media before reuse/disposal"
    },
    "Access Control Least Privilege": {
        "keywords": ["least privilege"],
        "CMMC": "AC.2.007",
        "NIST_800_171": "3.1.5",
        "ISO_27001": "A.9.1.2",
        "check": "enforce least privilege"
    },
    "Audit Logging": {
        "keywords": ["audit log", "logging", "SIEM"],
        "CMMC": "AU.2.041",
        "NIST_800_171": "3.3.1",
        "ISO_27001": "A.12.4.1",
        "check": "create & retain audit logs"
    },
    "Time Sync": {
        "keywords": ["time sync", "ntp"],
        "CMMC": "AU.2.044",
        "NIST_800_171": "3.3.7",
        "ISO_27001": "A.12.4.4",
        "check": "synchronize clocks for log timestamps"
    },
    "Configuration Baseline": {
        "keywords": ["baseline configuration", "hardening"],
        "CMMC": "CM.2.061",
        "NIST_800_171": "3.4.1",
        "ISO_27001": "A.12.1.2",
        "check": "establish and maintain baseline configs"
    },
    "Secure Config Settings": {
        "keywords": ["stig", "cis benchmark", "secure config"],
        "CMMC": "CM.2.062",
        "NIST_800_171": "3.4.2",
        "ISO_27001": "A.12.1.2",
        "check": "enforce security configuration settings"
    },
    "Change Control": {
        "keywords": ["change control", "ccb", "cab"],
        "CMMC": "CM.2.064",
        "NIST_800_171": "3.4.3",
        "ISO_27001": "A.12.1.2",
        "check": "track/review/approve changes"
    },
    "Vulnerability Management": {
        "keywords": ["vulnerability scan", "patching"],
        "CMMC": "RM.2.142",
        "NIST_800_171": "3.11.2",
        "ISO_27001": "A.12.6.1",
        "check": "scan for vulnerabilities periodically"
    },
    "Flaw Remediation": {
        "keywords": ["patch management", "flaw remediation"],
        "CMMC": "SI.2.214",
        "NIST_800_171": "3.14.1",
        "ISO_27001": "A.12.6.1",
        "check": "identify, report, correct flaws"
    },
    "Malware Protection": {
        "keywords": ["anti-virus", "antivirus", "malware"],
        "CMMC": "SI.2.216",
        "NIST_800_171": "3.14.2",
        "ISO_27001": "A.12.2.1",
        "check": "protect from malicious code"
    },
    "Cryptography In Transit": {
        "keywords": ["tls", "encrypt in transit", "https", "vpn"],
        "CMMC": "SC.3.177",
        "NIST_800_171": "3.13.8/11",
        "ISO_27001": "A.10.1.1",
        "check": "use FIPS-validated crypto for CUI in transit (demo simplified)"
    },
    "Confidentiality at Rest": {
        "keywords": ["encrypt at rest"],
        "CMMC": "SC.3.191",
        "NIST_800_171": "3.13.16",
        "ISO_27001": "A.10.1.1",
        "check": "protect CUI at rest (encryption or compensating)"
    }
}

# Simple rules to extract "easy wins" from configs and policy text
def parse_config_text(conf_text: str) -> Dict[str, Any]:
    data = {}
    try:
        # Try YAML first
        data = yaml.safe_load(conf_text) or {}
    except Exception:
        # Try JSON
        try:
            data = json.loads(conf_text)
        except Exception:
            data = {}
    return data if isinstance(data, dict) else {}

def get_in(dct, path, default=None):
    cur = dct
    for p in path.split("."):
        if not isinstance(cur, dict) or p not in cur:
            return default
        cur = cur[p]
    return cur

def check_controls(policy_text: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    results = []
    text_norm = (policy_text or "").lower()
    for name, meta in CROSSWALK.items():
        evidence = []
        satisfied = False
        # Heuristic: keywords in policy text
        if any(k in text_norm for k in meta["keywords"]):
            evidence.append(f"Policy mentions: {name} ({', '.join(meta['keywords'][:3])}...)")

        # Config checks (demo rules)
        if name == "MFA":
            mfa = get_in(config, "auth.mfa", False)
            if mfa is True: 
                satisfied = True
                evidence.append("auth.mfa = true")
        elif name == "Password Policy":
            minlen = get_in(config, "auth.password_min_length", None)
            if isinstance(minlen, int) and minlen >= 8:
                satisfied = True
                evidence.append(f"auth.password_min_length = {minlen}")
        elif name == "Log Retention":
            days = get_in(config, "logging.retention_days", None)
            if isinstance(days, int):
                # CMMC/NIST suggested 90d; ISO often expects longer; we mark partial if 90<=days<180
                if days >= 180:
                    satisfied = True
                    evidence.append(f"logging.retention_days = {days} (>=180)")
                elif days >= 90:
                    satisfied = "Partial"
                    evidence.append(f"logging.retention_days = {days} (>=90 & <180)")
                else:
                    satisfied = False
                    evidence.append(f"logging.retention_days = {days} (<90)")
        elif name == "Cryptography In Transit":
            # naive: look for tls/encryption flag
            tls = get_in(config, "network.tls_enabled", None)
            if tls is True:
                satisfied = True
                evidence.append("network.tls_enabled = true")
        elif name == "Confidentiality at Rest":
            enc = get_in(config, "storage.encrypt_at_rest", None)
            if enc is True:
                satisfied = True
                evidence.append("storage.encrypt_at_rest = true")

        # If we saw evidence in policy_text but no config proof, still allow satisfied if policy asserts
        if not satisfied and evidence and "Policy mentions" in " | ".join(evidence):
            satisfied = "Policy"

        status = "Not Satisfied"
        if satisfied is True:
            status = "Satisfied"
        elif satisfied == "Partial":
            status = "Partial"
        elif satisfied == "Policy":
            status = "Policy (needs tech evidence)"

        results.append({
            "control_name": name,
            "frameworks": {
                "CMMC": meta["CMMC"],
                "NIST_800_171": meta["NIST_800_171"],
                "ISO_27001": meta["ISO_27001"],
            },
            "status": status,
            "evidence": evidence
        })
    return results

def score(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = len(results)
    satisfied = sum(1 for r in results if r["status"] == "Satisfied")
    partial = sum(1 for r in results if r["status"] == "Partial")
    policy = sum(1 for r in results if r["status"].startswith("Policy"))
    coverage = round(100.0 * (satisfied + 0.5*partial + 0.3*policy) / total, 1) if total else 0.0
    return {"total_controls": total, "satisfied": satisfied, "partial": partial, "policy_only": policy, "coverage_percent": coverage}

class AnalyzeResponse(BaseModel):
    results: List[Dict[str, Any]]
    score: Dict[str, Any]
    missing_evidence: List[str]

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(
    policy_file: Optional[UploadFile] = File(None),
    config_file: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None),
):
    policy_text = ""
    if policy_file:
        if policy_file.filename.lower().endswith(".pdf") and extract_text:
            raw = await policy_file.read()
            try:
                policy_text = extract_text(io.BytesIO(raw))
            except Exception:
                policy_text = ""
        else:
            policy_text = (await policy_file.read()).decode(errors="ignore")

    config_obj = {}
    if config_file:
        conf_text = (await config_file.read()).decode(errors="ignore")
        config_obj = parse_config_text(conf_text)

    results = check_controls(policy_text, config_obj)
    sc = score(results)

    missing = []
    for r in results:
        if r["status"] in ("Not Satisfied", "Policy"):
            missing.append(f"{r['frameworks']['CMMC']}: {r['control_name']}")

    return JSONResponse({
        "results": results,
        "score": sc,
        "missing_evidence": missing
    })

@app.get("/crosswalk.json")
async def crosswalk():
    return JSONResponse(CROSSWALK)

@app.get("/health")
async def health():
    return {"ok": True}