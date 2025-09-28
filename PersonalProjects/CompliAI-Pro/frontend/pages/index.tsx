import { useState } from "react"
import axios from "axios"
import { ShieldCheck, Upload, FileText, Settings, ArrowRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react"

type Result = {
  control_name: string;
  frameworks: { CMMC: string; NIST_800_171: string; ISO_27001: string };
  status: string;
  evidence: string[];
}

type Score = {
  total_controls: number;
  satisfied: number;
  partial: number;
  policy_only: number;
  coverage_percent: number;
}

export default function Home() {
  const [policy, setPolicy] = useState<File | null>(null)
  const [config, setConfig] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]|null>(null)
  const [score, setScore] = useState<Score|null>(null)
  const [missing, setMissing] = useState<string[]>([])

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  async function run() {
    setLoading(true)
    const form = new FormData()
    if (policy) form.append("policy_file", policy)
    if (config) form.append("config_file", config)
    try {
      const { data } = await axios.post(`${API}/analyze`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResults(data.results)
      setScore(data.score)
      setMissing(data.missing_evidence)
    } catch (e) {
      alert("Failed to analyze. Is the API running on 8000?")
    } finally {
      setLoading(false)
    }
  }

  function chip(status: string) {
    if (status === "Satisfied") return <span className="pill ok"><CheckCircle2 size={14} /> Satisfied</span>
    if (status === "Partial") return <span className="pill warn"><AlertCircle size={14} /> Partial</span>
    if (status.startsWith("Policy")) return <span className="pill warn"><AlertCircle size={14} /> Policy</span>
    return <span className="pill bad"><XCircle size={14} /> Not Satisfied</span>
  }

  return (
    <div className="container">
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:20}}>
        <ShieldCheck size={36} color="#7dd3fc" />
        <h1 style={{margin:0}}>CompliAI Pro</h1>
      </div>

      <div className="row">
        <div className="col">
          <div className="card">
            <h3><Upload size={18}/> Upload Evidence</h3>
            <p className="muted">Upload a policy document (PDF/Doc/Text) and a config file (YAML/JSON). We'll auto-map to CMMC/NIST/ISO.</p>
            <label>Policy (PDF/Doc/Text)</label>
            <input type="file" accept=".pdf,.txt,.md,.doc,.docx" onChange={(e)=>setPolicy(e.target.files?.[0]||null)} />
            <div style={{height:12}}/>
            <label>Config (YAML/JSON)</label>
            <input type="file" accept=".yaml,.yml,.json" onChange={(e)=>setConfig(e.target.files?.[0]||null)} />
            <div style={{height:16}}/>
            <button className="btn" disabled={loading} onClick={run}>
              {loading ? "Analyzing..." : <>Run Analysis <ArrowRight size={16}/></>}
            </button>
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h3><Settings size={18}/> Scorecard</h3>
            {score ? (
              <div className="grid">
                <div>
                  <div className="score">{score.coverage_percent}%</div>
                  <div className="muted">Auto-verified coverage</div>
                </div>
                <div>
                  <div>Satisfied: <b>{score.satisfied}</b></div>
                  <div>Partial: <b>{score.partial}</b></div>
                  <div>Policy-Only: <b>{score.policy_only}</b></div>
                  <div>Total Controls: <b>{score.total_controls}</b></div>
                </div>
              </div>
            ) : (
              <p className="muted">Run an analysis to see your coverage score.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{height:16}}/>

      <div className="card">
        <h3><FileText size={18}/> Results</h3>
        {!results && <p className="muted">No results yet. Upload files and click "Run Analysis".</p>}
        {results && (
          <table className="table">
            <thead>
              <tr>
                <th>Control</th>
                <th>CMMC</th>
                <th>NIST 800-171</th>
                <th>ISO 27001</th>
                <th>Status</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i)=>(
                <tr key={i}>
                  <td>{r.control_name}</td>
                  <td>{r.frameworks.CMMC}</td>
                  <td>{r.frameworks.NIST_800_171}</td>
                  <td>{r.frameworks.ISO_27001}</td>
                  <td>{chip(r.status)}</td>
                  <td>{r.evidence.join("; ")||<span className="muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {missing?.length>0 && (
        <div style={{height:16}}/>
      )}

      {missing?.length>0 && (
        <div className="card">
          <h3>Missing Evidence (Hand-off to Auditor)</h3>
          <ul>
            {missing.map((m,i)=>(<li key={i}>{m}</li>))}
          </ul>
        </div>
      )}

      <div style={{height:24}}/>
      <div className="footer">© 2025 CompliAI Pro — Demo. For CMMC/NIST/ISO production use, validate mappings and thresholds.</div>
    </div>
  )
}