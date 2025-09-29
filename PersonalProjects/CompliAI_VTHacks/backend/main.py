
import os
import io
import json
import re
from typing import List, Dict, Any, Optional, Tuple
from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yaml

try:
    from pdfminer.high_level import extract_text
except Exception:
    extract_text = None

app = FastAPI(title="CompliAI Pro - RAG Citations (Demo)", version="0.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crosswalk controls (subset + easy wins). Add more as needed.
CROSSWALK = {
    # --- Access Control / Authentication ---
    "MFA": {
        "keywords": ["mfa","multi-factor","multifactor","two-factor","2fa","remote access"],
        "CMMC": "IA.2.078", "NIST_800_171": "3.5.3", "ISO_27001": "A.9.4.2"
    },
    "Password Policy": {
        "keywords": ["password","passphrase","complex"],
        "CMMC": "AC.1.002", "NIST_800_171": "3.1.1", "ISO_27001": "A.9.2.3"
    },
    "Account Lockout": {
        "keywords": ["lockout","unsuccessful logon","account lock"],
        "CMMC": "AC.1.007", "NIST_800_171": "3.1.8", "ISO_27001": "A.9.4.3"
    },
    "Session Lock": {
        "keywords": ["session lock","screen lock","inactivity timeout"],
        "CMMC": "AC.2.016", "NIST_800_171": "3.1.10", "ISO_27001": "A.11.2.8"
    },
    "Least Privilege": {
        "keywords": ["least privilege","privileged access","admin rights"],
        "CMMC": "AC.2.007", "NIST_800_171": "3.1.5", "ISO_27001": "A.9.1.2"
    },
    "Remote Access Control": {
        "keywords": ["vpn","remote access","remote login"],
        "CMMC": "AC.3.014", "NIST_800_171": "3.1.12", "ISO_27001": "A.13.1.1"
    },
    "Wireless Security": {
        "keywords": ["wireless","wifi","802.1x","enterprise authentication"],
        "CMMC": "SC.3.197", "NIST_800_171": "3.13.13", "ISO_27001": "A.13.1.1"
    },

    # --- Audit & Logging ---
    "Log Retention": {
        "keywords": ["log retention","retain logs","audit logging","90 days","180 days"],
        "CMMC": "AU.2.041", "NIST_800_171": "3.3.1", "ISO_27001": "A.12.4.1"
    },
    "Audit Logging": {
        "keywords": ["audit log","siem","audit records"],
        "CMMC": "AU.2.041", "NIST_800_171": "3.3.1", "ISO_27001": "A.12.4.1"
    },
    "Time Synchronization": {
        "keywords": ["ntp","time sync","clock synchronization"],
        "CMMC": "AU.2.043", "NIST_800_171": "3.3.7", "ISO_27001": "A.12.4.4"
    },

    # --- Cryptography & Data Protection ---
    "Cryptography In Transit": {
        "keywords": ["tls","https","vpn","encrypt in transit"],
        "CMMC": "SC.3.177", "NIST_800_171": "3.13.8", "ISO_27001": "A.10.1.1"
    },
    "Confidentiality at Rest": {
        "keywords": ["encrypt at rest","disk encryption"],
        "CMMC": "SC.3.191", "NIST_800_171": "3.13.16", "ISO_27001": "A.10.1.1"
    },
    "Mobile Device Encryption": {
        "keywords": ["mobile","smartphone","tablet","device encryption"],
        "CMMC": "SC.3.185", "NIST_800_171": "3.1.19", "ISO_27001": "A.6.2.1"
    },
    "Media Sanitization": {
        "keywords": ["sanitize","media wipe","media disposal"],
        "CMMC": "MP.2.119", "NIST_800_171": "3.8.3", "ISO_27001": "A.8.3.2"
    },

    # --- System Integrity & Maintenance ---
    "Vulnerability Scanning": {
        "keywords": ["scan","scanner","vulnerability assessment","nessus","qualys"],
        "CMMC": "RA.3.155", "NIST_800_171": "3.11.2", "ISO_27001": "A.12.6.1"
    },
    "Patch Management": {
        "keywords": ["patch","remediation","update cycle"],
        "CMMC": "SI.2.216", "NIST_800_171": "3.14.4", "ISO_27001": "A.12.6.1"
    },
    "Malware Protection": {
        "keywords": ["antivirus","malware","endpoint protection","EDR"],
        "CMMC": "SI.1.210", "NIST_800_171": "3.14.2", "ISO_27001": "A.12.2.1"
    },

    # --- Incident Response & Training ---
    "Incident Response Plan": {
        "keywords": ["incident response","IR plan","breach handling"],
        "CMMC": "IR.2.093", "NIST_800_171": "3.6.1", "ISO_27001": "A.16.1.1"
    },
    "Security Awareness Training": {
        "keywords": ["security awareness","training","phishing simulation"],
        "CMMC": "AT.2.056", "NIST_800_171": "3.2.1", "ISO_27001": "A.7.2.2"
    }
}


GUIDE_TEXTS: Dict[str, str] = {}

def load_guidelines() -> None:
    base = os.path.join(os.path.dirname(__file__), "guidelines")
    files = [
        ("CMMC_L1", os.path.join(base, "CMMCAssessmentGuideL1v2.pdf")),
        ("NIST_800_171", os.path.join(base, "NIST.SP.800-171r2.pdf")),
    ]
    for key, path in files:
        if os.path.exists(path) and extract_text:
            try:
                GUIDE_TEXTS[key] = extract_text(path) or ""
            except Exception:
                GUIDE_TEXTS[key] = ""
        else:
            GUIDE_TEXTS[key] = ""

def split_passages(text: str, chunk_size: int = 900, overlap: int = 150) -> List[str]:
    chunks = []
    i = 0
    n = len(text)
    step = max(1, chunk_size - overlap)
    while i < n:
        chunk = text[i:i+chunk_size]
        if chunk.strip():
            chunks.append(chunk)
        i += step
    return chunks

def find_passages(doc_key: str, query_terms: List[str], control_id: Optional[str]=None, top_k: int=3) -> List[Tuple[int,str]]:
    text = GUIDE_TEXTS.get(doc_key, "")
    if not text:
        return []
    passages = split_passages(text)
    scored = []
    id_terms = []
    if control_id:
        id_terms = re.split(r"[^0-9A-Za-z\.]+", control_id)
    for idx, p in enumerate(passages):
        p_low = p.lower()
        score = 0
        for t in (query_terms or []):
            if t and t.lower() in p_low:
                score += 2
        for t in id_terms:
            if t and t.lower() in p_low:
                score += 5
        if any(w in p_low for w in ["assess", "assessment", "examine", "interview", "test","objective evidence"]):
            score += 1
        if score > 0:
            scored.append((score, idx, p))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [(i, p) for (s, i, p) in scored[:top_k]]

def guideline_refs_for_control(control_name: str) -> List[Dict[str, Any]]:
    meta = CROSSWALK.get(control_name)
    if not meta:
        return []
    refs = []
    cmmc = find_passages("CMMC_L1", meta["keywords"], meta["CMMC"])
    for idx, p in cmmc:
        refs.append({"framework":"CMMC","id":meta["CMMC"],"doc":"CMMC Assessment Guide (L1)","passage_index":idx,"excerpt":p.strip()[:700]})
    nist = find_passages("NIST_800_171", meta["keywords"], meta["NIST_800_171"])
    for idx, p in nist:
        refs.append({"framework":"NIST 800-171","id":meta["NIST_800_171"],"doc":"NIST SP 800-171","passage_index":idx,"excerpt":p.strip()[:700]})
    return refs[:6]

def parse_config_text(conf_text: str) -> Dict[str, Any]:
    try:
        data = yaml.safe_load(conf_text) or {}
    except Exception:
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


import os, requests, json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

def check_with_ai(control_name, control_id, evidence_text):
    if not GEMINI_API_KEY:
        return {
            "status": "Skipped",
            "reasoning": "No GEMINI_API_KEY set",
            "citations": [],
            "fix_suggestion": "No AI suggestion available"
        }

    prompt = f"""
    You are a cybersecurity auditor. Summarize requirements clearly.

    Control: {control_name} ({control_id})
    Evidence: {evidence_text}

    Task:
    1. Decide if the evidence Satisfies / Partially Satisfies / Does Not Satisfy the control.
    2. Write a short, human-readable summary of the control requirement (2 sentences max).
    3. If not satisfied, propose one practical fix.

    Respond strictly in JSON:
    {{
      "status": "Satisfied" | "Partial" | "Not Satisfied",
      "reasoning": "short explanation of your decision",
      "citations": [
        {{
          "framework": "CMMC/NIST/ISO",
          "id": "{control_id}",
          "doc": "AI Summary",
          "excerpt": "Concise plain-language explanation of the requirement"
        }}
      ],
      "fix_suggestion": "One actionable remediation step if not satisfied, otherwise 'No fix needed'"
    }}
    """

    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}
    body = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ]
    }

    try:
        resp = requests.post(GEMINI_URL, headers=headers, params=params, json=body)
        resp.raise_for_status()
        data = resp.json()
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(text)
    except Exception as e:
        return {
            "status": "Error",
            "reasoning": str(e),
            "citations": [
                {
                    "framework": "AI",
                    "id": control_id,
                    "doc": "AI Fallback",
                    "excerpt": "Could not summarize requirement due to error."
                }
            ],
            "fix_suggestion": "Error occurred, no suggestion available"
        }




def check_controls(policy_text: str, config: Dict[str, Any]) -> List[Dict[str, Any]]:
    results = []
    text_norm = (policy_text or "").lower()

    for name, meta in CROSSWALK.items():
        evidence = []
        satisfied: Any = False

        if any(k in text_norm for k in meta["keywords"]):
            evidence.append(f"Policy mentions: {name}")

        if name == "MFA":
            if get_in(config, "auth.mfa", False) is True:
                satisfied = True; evidence.append("auth.mfa = true")
        elif name == "Password Policy":
            ml = get_in(config, "auth.password_min_length", None)
            if isinstance(ml, int) and ml >= 8:
                satisfied = True; evidence.append(f"auth.password_min_length = {ml}")
        elif name in ("Log Retention", "Audit Logging"):
            days = get_in(config, "logging.retention_days", None)
            if isinstance(days, int) and days >= 90:
                if days >= 180:
                    satisfied = True; evidence.append(f"logging.retention_days = {days} (>=180)")
                else:
                    satisfied = "Partial"; evidence.append(f"logging.retention_days = {days} (>=90 & <180)")
            en = get_in(config, "logging.enabled", None)
            if name == "Audit Logging" and en is True:
                satisfied = True; evidence.append("logging.enabled = true")
        elif name == "Cryptography In Transit":
            if get_in(config, "network.tls_enabled", None) is True:
                satisfied = True; evidence.append("network.tls_enabled = true")
        elif name == "Confidentiality at Rest":
            if get_in(config, "storage.encrypt_at_rest", None) is True:
                satisfied = True; evidence.append("storage.encrypt_at_rest = true")
        elif name == "Account Lockout":
            tries = get_in(config, "auth.max_failed_attempts", None)
            if isinstance(tries, int) and tries <= 5:
                satisfied = True; evidence.append(f"auth.max_failed_attempts = {tries}")
        elif name == "Session Lock":
            mins = get_in(config, "session.auto_lock_minutes", None)
            if isinstance(mins, int) and mins <= 15:
                satisfied = True; evidence.append(f"session.auto_lock_minutes = {mins}")
        elif name == "Remote Access Control":
            if get_in(config, "remote_access.vpn_required", None) is True:
                satisfied = True; evidence.append("remote_access.vpn_required = true")
        elif name == "Least Privilege":
            if get_in(config, "iam.enforce_least_privilege", None) is True:
                satisfied = True; evidence.append("iam.enforce_least_privilege = true")
        elif name == "Wireless Security":
            if get_in(config, "wireless.enterprise_auth", None) is True:
                satisfied = True; evidence.append("wireless.enterprise_auth = true")

        elif name == "Mobile Device Encryption":
            if get_in(config, "mobile.encrypt", None) is True:
                satisfied = True; evidence.append("mobile.encrypt = true")

        elif name == "Media Sanitization":
            if get_in(config, "media.sanitization_enabled", None) is True:
                satisfied = True; evidence.append("media.sanitization_enabled = true")

        elif name == "Vulnerability Scanning":
            if get_in(config, "scanner.enabled", None) is True:
                satisfied = True; evidence.append("scanner.enabled = true")
                freq = get_in(config, "scanner.frequency_days", None)
                if isinstance(freq, int) and freq <= 30:
                    satisfied = True; evidence.append(f"scanner.frequency_days = {freq} (<=30)")

        elif name == "Patch Management":
            if get_in(config, "patch.auto_update", None) is True:
                satisfied = True; evidence.append("patch.auto_update = true")

        elif name == "Malware Protection":
            if get_in(config, "malware.enabled", None) is True:
                satisfied = True; evidence.append("malware.enabled = true")

        elif name == "Incident Response Plan":
            if get_in(config, "incident.plan_documented", None) is True:
                satisfied = True; evidence.append("incident.plan_documented = true")

        elif name == "Security Awareness Training":
            if get_in(config, "training.security_awareness", None) is True:
                satisfied = True; evidence.append("training.security_awareness = true")
        elif name == "Mobile Device Encryption":
            if get_in(config, "mobile.encrypt", None) is True:
                satisfied = True
                evidence.append("mobile.encrypt = true")
        elif name == "Time Synchronization":
            if get_in(config, "time.ntp_sync", None) is True:
                satisfied = True
                evidence.append("time.ntp_sync = true")

        if not satisfied and any("Policy mentions" in e for e in evidence):
            satisfied = "Policy"

        status = "Not Satisfied"
        if satisfied is True: status = "Satisfied"
        elif satisfied == "Partial": status = "Partial"
        elif satisfied == "Policy": status = "Policy (needs tech evidence)"

        citations = guideline_refs_for_control(name)

        results.append({
            "control_name": name,
            "frameworks": {"CMMC":meta["CMMC"], "NIST_800_171":meta["NIST_800_171"], "ISO_27001":meta["ISO_27001"]},
            "status": status,
            "evidence": evidence,
            "citations": citations
        })

        ai_result = check_with_ai(
            name,
            CROSSWALK[name].get("CMMC"),
            " ".join(evidence) if evidence else "No direct evidence found in config/policy."
        )
        results[-1]["ai_status"] = ai_result.get("status")
        results[-1]["ai_reasoning"] = ai_result.get("reasoning")

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

@app.on_event("startup")
def _startup():
    load_guidelines()

@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(policy_file: Optional[UploadFile] = File(None), config_file: Optional[UploadFile] = File(None), notes: Optional[str] = Form(None)):
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
        if r["status"] in ("Not Satisfied", "Policy (needs tech evidence)"):
            missing.append(f"{r['frameworks']['CMMC']}: {r['control_name']}")

    return JSONResponse({"results": results, "score": sc, "missing_evidence": missing})

@app.get("/guideline_refs")
async def guideline_refs(control: str = Query(..., description="Control name, e.g., 'MFA'")):
    return JSONResponse({"control": control, "references": guideline_refs_for_control(control)})

@app.get("/health")
async def health():
    return {"ok": True}
