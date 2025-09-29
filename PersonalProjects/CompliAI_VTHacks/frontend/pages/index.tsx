import { useState } from "react"
import axios from "axios"
import { ShieldCheck, Upload, FileText, Settings, ArrowRight, CheckCircle2, AlertCircle, XCircle, BookOpen, Filter, Search, Download, PieChart as PieIcon } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LabelList } from "recharts"

type Citation = { framework: string; id: string; doc: string; excerpt: string }
type Result = {
  control_name: string;
  frameworks: { CMMC: string; NIST_800_171: string; ISO_27001: string };
  status: string;
  evidence: string[];
  citations: Citation[];
  fix_suggestion?: string;
}
type Score = { total_controls: number; satisfied: number; partial: number; policy_only: number; coverage_percent: number; }

export default function Home() {
  const [policy, setPolicy] = useState<File | null>(null)
  const [config, setConfig] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Result[]|null>(null)
  const [score, setScore] = useState<Score|null>(null)
  const [missing, setMissing] = useState<string[]>([])
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({})
  const [filter, setFilter] = useState<string>("All")
  const [search, setSearch] = useState<string>("")

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  async function run() {
    setLoading(true)
    const form = new FormData()
    if (policy) form.append("policy_file", policy)
    if (config) form.append("config_file", config)
    try {
      const { data } = await axios.post(`${API}/analyze`, form, { headers: { "Content-Type": "multipart/form-data" } })
      setResults(data.results); setScore(data.score); setMissing(data.missing_evidence)
    } catch (e) {
      alert("Failed to analyze. Is the API running on 8000?")
    } finally { setLoading(false) }
  }

  function chip(status: string) {
    if (status === "Satisfied") return <span className="pill ok"><CheckCircle2 size={14}/> Satisfied</span>
    if (status === "Partial") return <span className="pill warn"><AlertCircle size={14}/> Partial</span>
    if (status.startsWith("Policy")) return <span className="pill warn"><AlertCircle size={14}/> Policy</span>
    return <span className="pill bad"><XCircle size={14}/> Not Satisfied</span>
  }

  const toggleRow = (idx: number) => setOpenRows(prev => ({...prev, [idx]: !prev[idx]}))

  const filteredResults = results?.filter(r => 
    (filter === "All" || r.status === filter) &&
    (search === "" || r.control_name.toLowerCase().includes(search.toLowerCase()))
  )

  function downloadResults() {
    if (!results) return
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "compliance_results.json"
    a.click()
  }

  const pieData = score ? [
    { name: "Satisfied", value: score.satisfied, color: "#4ade80" },
    { name: "Partial", value: score.partial, color: "#facc15" },
    { name: "Policy-Only", value: score.policy_only, color: "#38bdf8" },
    { name: "Not Satisfied", value: score.total_controls - (score.satisfied + score.partial + score.policy_only), color: "#f87171" },
  ] : []

  return (
    <div className="container" style={{maxWidth:"1200px",margin:"0 auto",padding:"20px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <ShieldCheck size={36} color="#7dd3fc"/><h1 style={{margin:0}}>CompliAI</h1>
      </div>

      {/* Upload + Scorecard Row */}
      <div className="row" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,alignItems:"stretch"}}>
        {/* Upload Evidence */}
        <div className="col" style={{display:"flex",flexDirection:"column"}}>
          <div className="card" style={{flex:1}}>
            <h3><Upload size={18}/> Upload Evidence</h3>
            <p className="muted">Upload a policy (PDF/Doc/Text) and a config (YAML/JSON). We’ll map them to CMMC/NIST/ISO and suggest fixes.</p>
            <label>Policy</label>
            <input type="file" accept=".pdf,.txt,.md,.doc,.docx" onChange={e=>setPolicy(e.target.files?.[0]||null)}/>
            <div style={{height:12}}/>
            <label>Config (YAML/JSON)</label>
            <input type="file" accept=".yaml,.yml,.json" onChange={e=>setConfig(e.target.files?.[0]||null)}/>
            <div style={{height:16}}/>
            <button className="btn" disabled={loading} onClick={run}>{loading ? "Analyzing..." : <>Run Analysis <ArrowRight size={16}/></>}</button>
          </div>
        </div>

        {/* Scorecard + Pie */}
        <div className="col" style={{display:"flex",flexDirection:"column",gap:20}}>
          <div className="card" style={{flex:1}}>
            <h3><Settings size={18}/> Scorecard</h3>
            {score ? (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div><b>Coverage:</b> {score.coverage_percent}%</div>
                <div>Satisfied: <b>{score.satisfied}</b></div>
                <div>Partial: <b>{score.partial}</b></div>
                <div>Policy-Only: <b>{score.policy_only}</b></div>
                <div>Total Controls: <b>{score.total_controls}</b></div>
              </div>
            ) : <p className="muted">Run an analysis to see your coverage score.</p>}
          </div>

          {score && (
            <div className="card" style={{flex:1}}>
              <h3><PieIcon size={18}/> Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false} // 🚀 removes connector lines
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color}/>
                    ))}
                    {/* Numbers inside slices */}
                    <LabelList dataKey="value" position="inside" fill="#fff" style={{ fontWeight: 700, fontSize: 12 }} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div style={{height:16}}/>

      {/* Filters */}
      <div className="row">
        <div className="col">
          <div className="card">
            <h3><Filter size={16}/> Filters & Tools</h3>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <select value={filter} onChange={e=>setFilter(e.target.value)}>
                <option>All</option>
                <option>Satisfied</option>
                <option>Partial</option>
                <option>Not Satisfied</option>
              </select>
              <div style={{position:"relative",flex:1}}>
                <Search size={14} style={{position:"absolute",top:8,left:8,color:"#999"}}/>
                <input type="text" placeholder="Search controls..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:28,width:"100%"}}/>
              </div>
              <button className="btn small" onClick={downloadResults}><Download size={14}/> Export</button>
            </div>
            <p className="muted">Tip: Filter by “Not Satisfied” to prioritize fixes first.</p>
          </div>
        </div>
      </div>

      <div style={{height:16}}/>

      {/* Results */}
      <div className="card" style={{width:"100%"}}>
        <h3><FileText size={18}/> Results</h3>
        {!results && <p className="muted">No results yet.</p>}
        {filteredResults && (
          <table className="table" style={{width:"100%"}}>
            <thead>
              <tr>
                <th>Control</th>
                <th>CMMC</th>
                <th>NIST 800-171</th>
                <th>ISO 27001</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>AI Citations & Suggestions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, i)=>(
                <>
                  <tr key={i}>
                    <td><b>{r.control_name}</b></td>
                    <td>{r.frameworks.CMMC}</td>
                    <td>{r.frameworks.NIST_800_171}</td>
                    <td>{r.frameworks.ISO_27001}</td>
                    <td>{chip(r.status)}</td>
                    <td>{r.evidence.length ? r.evidence.join("; ") : <span className="muted">—</span>}</td>
                    <td>
                      <span className="toggle" onClick={()=>toggleRow(i)}><BookOpen size={14}/> {openRows[i] ? "Hide" : "View"} details</span>
                    </td>
                  </tr>
                  {openRows[i] && (
                    <tr>
                      <td colSpan={7}>
                        {r.citations?.length ? r.citations.map((c, j)=>(
                          <div className="cite" key={j} style={{marginBottom:12}}>
                            <h4>{c.framework} • {c.id}</h4>
                            <p>{c.excerpt}</p>
                          </div>
                        )) : <div className="muted">No AI citations available.</div>}
                        {r.fix_suggestion && <div style={{marginTop:8,padding:8,background:"#fff3cd",borderRadius:6}}><b>Suggested Fix:</b> {r.fix_suggestion}</div>}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {missing?.length>0 && <div style={{height:16}}/>}
      {missing?.length>0 && (
        <div className="card">
          <h3>Missing Evidence (Hand-off to Auditor)</h3>
          <ul>{missing.map((m,i)=>(<li key={i}>{m}</li>))}</ul>
        </div>
      )}

      <div style={{height:24}}/>
      <div className="muted" style={{fontSize:12}}>© 2025 CompliAI — Demo build with AI guidance. Validate mappings & thresholds for production use.</div>
    </div>
  )
}
