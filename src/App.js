import { useState, useEffect } from "react";

const API = "https://script.google.com/macros/s/AKfycbxgq93w-3tL0PArQdtsb6v0sYjpuvAxPp0P4GCq177YAuHJ03YmTsyVD45Plu3mVcJ-/exec";

const BARBER_PASS = "ram2024";
const GASTOS_PASS = "gastos2024";

const SVCS = [
  { id: "corte", label: "Corte", price: 14000 },
  { id: "corte_barba", label: "Corte + Barba", price: 18000 },
  { id: "corte_cejas", label: "Corte + Cejas", price: 15000 },
  { id: "corte_full", label: "Corte FULL", price: 20000 },
];
const PAGOS = [
  { id: "efectivo", label: "Efectivo", icon: "💵" },
  { id: "tarjeta", label: "Tarjeta", icon: "💳" },
  { id: "transferencia", label: "Transferencia", icon: "📲" },
];

const fmtP = n => "$" + Number(n).toLocaleString("es-AR");
const fmtD = str => str ? new Date(str).toLocaleDateString("es-AR") : "";
const DIAS = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];

async function api(action, params = {}) {
  const query = new URLSearchParams({ action, ...Object.fromEntries(Object.entries(params).map(([k,v]) => [k, typeof v === "object" ? JSON.stringify(v) : v])) });
  const res = await fetch(`${API}?${query.toString()}`);
  return res.json();
}

async function apiGet(sheet) {
  const res = await fetch(`${API}?action=get&sheet=${sheet}`);
  return res.json();
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@300;400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{background:#000;color:#fff;font-family:'Inter',sans-serif;}
  .cinzel{font-family:'Cinzel',serif;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(255,255,255,.1)}50%{text-shadow:0 0 40px rgba(255,255,255,.3)}}
  .fade-up{animation:fadeUp .4s ease both;}
  .btn-main{width:100%;padding:13px;background:#fff;color:#000;font-family:'Cinzel',serif;font-size:11px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;border:none;cursor:pointer;transition:all .3s;}
  .btn-main:hover{background:#e0e0e0;transform:translateY(-1px);}
  .btn-main.dim{opacity:.3;cursor:default;}
  .btn-ghost{width:100%;padding:11px;background:transparent;color:#fff;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.15em;text-transform:uppercase;border:1px solid #2a2a2a;cursor:pointer;transition:all .3s;margin-top:8px;}
  .btn-ghost:hover{border-color:#fff;}
  .btn-sm{font-size:10px;color:#fff;border:1px solid #2a2a2a;padding:5px 12px;background:transparent;cursor:pointer;transition:all .25s;}
  .btn-sm:hover{border-color:#fff;}
  .btn-danger{font-size:10px;color:#ff6b6b;border:1px solid #5a2a2a;padding:4px 8px;background:transparent;cursor:pointer;transition:all .25s;}
  .btn-danger:hover{border-color:#ff4444;color:#ff4444;}
  .hdr{background:#000;border-bottom:1px solid #1a1a1a;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;}
  .tabs{display:flex;background:#000;border-bottom:1px solid #111;overflow-x:auto;}
  .tab{flex:1;min-width:80px;padding:11px 0;font-size:9px;letter-spacing:.1em;text-transform:uppercase;border:none;background:transparent;color:#555;cursor:pointer;font-family:'Cinzel',serif;position:relative;transition:color .3s;white-space:nowrap;}
  .tab::after{content:'';position:absolute;bottom:0;left:50%;right:50%;height:1px;background:#fff;transition:all .4s;}
  .tab.active{color:#fff;}
  .tab.active::after{left:0;right:0;}
  .body{padding:18px 16px 40px;max-width:680px;margin:0 auto;}
  .card{background:#0a0a0a;border:1px solid #1a1a1a;padding:18px;margin-bottom:10px;animation:fadeUp .4s ease both;}
  .card-title{font-family:'Cinzel',serif;font-size:9px;letter-spacing:.15em;text-transform:uppercase;color:#555;margin-bottom:14px;}
  .field-lbl{font-size:9px;letter-spacing:.12em;color:#fff;text-transform:uppercase;display:block;margin-bottom:6px;font-family:'Cinzel',serif;opacity:.6;}
  .field{width:100%;background:transparent;border:none;border-bottom:1px solid #2a2a2a;color:#fff;font-size:14px;padding:9px 0;outline:none;font-family:'Inter',sans-serif;display:block;box-sizing:border-box;margin-bottom:16px;transition:border-color .3s;}
  .field:focus{border-bottom-color:#fff;}
  .field::placeholder{color:#333;}
  .svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
  .svc-card{border:1px solid #1a1a1a;padding:16px 10px;text-align:center;cursor:pointer;transition:all .3s;}
  .svc-card:hover{border-color:#444;}
  .svc-card.active{border-color:#fff;background:#111;}
  .pago-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px;}
  .pago-card{border:1px solid #1a1a1a;padding:12px 6px;text-align:center;cursor:pointer;transition:all .3s;}
  .pago-card:hover{border-color:#444;}
  .pago-card.active{border-color:#fff;background:#111;}
  .row{display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #111;font-size:13px;}
  .row:last-child{border-bottom:none;}
  .pill{font-size:10px;padding:3px 8px;border:1px solid #2a2a2a;color:#fff;}
  .pill-g{border-color:#1a3a2a;background:#050f0a;}
  .pill-r{border-color:#3a1a1a;background:#0f0505;}
  .metrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;}
  .met{background:#0a0a0a;border:1px solid #1a1a1a;padding:14px 8px;text-align:center;}
  .met-l{font-family:'Cinzel',serif;font-size:8px;letter-spacing:.12em;color:#555;text-transform:uppercase;margin-bottom:6px;}
  .met-v{font-family:'Cinzel',serif;font-size:18px;color:#fff;}
  .fb{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;}
  .fb-btn{font-size:9px;padding:5px 12px;border:1px solid #2a2a2a;background:transparent;color:#555;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;font-family:'Cinzel',serif;transition:all .25s;}
  .fb-btn.active{background:#fff;color:#000;border-color:#fff;}
  .dot{width:6px;height:6px;border-radius:50%;background:#1a1a1a;transition:all .4s;}
  .dot.done{background:#333;}
  .dot.active{background:#fff;}
  .dots{display:flex;gap:8px;justify-content:center;margin-bottom:20px;}
  .bar-bg{width:100%;height:1px;background:#111;margin-top:6px;}
  .bar-fill{height:1px;background:linear-gradient(90deg,#333,#fff);transition:width .8s;}
  .turno-card{border:1px solid #1a2a3a;background:#050a0f;padding:12px 14px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;}
  .turno-hora{font-family:'Cinzel',serif;font-size:18px;color:#fff;margin-right:14px;flex-shrink:0;}
  .week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:14px;}
  .week-day{border:1px solid #1a1a1a;padding:8px 4px;text-align:center;cursor:pointer;transition:all .2s;}
  .week-day:hover{border-color:#333;}
  .week-day.active{border-color:#fff;background:#111;}
  .week-day.today{border-color:#1a3a2a;}
  .wd-name{font-size:8px;color:#555;font-family:'Cinzel',serif;text-transform:uppercase;margin-bottom:3px;}
  .wd-num{font-size:14px;color:#fff;font-family:'Cinzel',serif;}
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;padding:20px;position:relative;overflow:hidden;}
  .login-card{background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);border:1px solid #1a1a1a;padding:36px 28px;width:100%;max-width:340px;position:relative;z-index:1;}
  .cf-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #111;font-size:12px;}
  .ck{color:#555;font-family:'Cinzel',serif;font-size:9px;letter-spacing:.08em;text-transform:uppercase;}
  .sug-box{background:#0a0a0a;border:1px solid #1a1a1a;margin-top:4px;}
  .sug-item{padding:10px 12px;cursor:pointer;border-bottom:1px solid #111;display:flex;justify-content:space-between;align-items:center;font-size:13px;}
  .sug-item:hover{background:#111;}
  select.field{appearance:none;}
  input[type="date"],input[type="time"]{color-scheme:dark;}
  @media(max-width:480px){.metrics{grid-template-columns:1fr 1fr;}.hdr{padding:12px 14px;}}
`;

function injectCSS() {
  if (document.getElementById("ram-css")) return;
  const s = document.createElement("style"); s.id = "ram-css"; s.textContent = css; document.head.appendChild(s);
  const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@300;400;500&display=swap"; document.head.appendChild(l);
}

const LogoSVG = () => (
  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex:0 }}>
    <svg viewBox="0 0 800 700" style={{ width:"min(600px,95vw)", opacity:.28 }} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(60,120)">
        <path d="M80,0 C110,-10 140,20 145,60 C150,100 130,140 100,155 C70,170 40,155 25,125 C10,95 15,50 40,25 C55,10 65,5 80,0 Z" fill="none" stroke="#fff" strokeWidth="1.8"/>
        <path d="M80,15 C100,10 120,30 122,60 C124,90 108,118 88,128 C68,138 48,125 38,105 C28,85 35,55 55,38 C65,28 72,18 80,15 Z" fill="none" stroke="#fff" strokeWidth="1.4"/>
        <path d="M80,160 C76,200 70,240 65,290 C62,320 60,350 58,380" fill="none" stroke="#fff" strokeWidth="2"/>
        <path d="M68,240 C45,228 28,235 22,255 C16,275 28,295 50,295 C62,295 72,285 68,265 Z" fill="none" stroke="#fff" strokeWidth="1.3"/>
      </g>
      <g transform="translate(550,120)">
        <path d="M80,0 C110,-10 140,20 145,60 C150,100 130,140 100,155 C70,170 40,155 25,125 C10,95 15,50 40,25 C55,10 65,5 80,0 Z" fill="none" stroke="#fff" strokeWidth="1.8"/>
        <path d="M80,15 C100,10 120,30 122,60 C124,90 108,118 88,128 C68,138 48,125 38,105 C28,85 35,55 55,38 C65,28 72,18 80,15 Z" fill="none" stroke="#fff" strokeWidth="1.4"/>
        <path d="M80,160 C84,200 90,240 95,290 C98,320 100,350 102,380" fill="none" stroke="#fff" strokeWidth="2"/>
        <path d="M92,240 C115,228 132,235 138,255 C144,275 132,295 110,295 C98,295 88,285 92,265 Z" fill="none" stroke="#fff" strokeWidth="1.3"/>
      </g>
      <text x="400" y="260" textAnchor="middle" fontFamily="Georgia,serif" fontSize="180" fontWeight="900" fill="#fff" letterSpacing="20">RAM</text>
      <text x="400" y="320" textAnchor="middle" fontFamily="Georgia,serif" fontSize="30" fill="#fff" letterSpacing="20">HAIR STUDIO</text>
      <line x1="200" y1="342" x2="365" y2="342" stroke="#fff" strokeWidth="1"/>
      <line x1="435" y1="342" x2="600" y2="342" stroke="#fff" strokeWidth="1"/>
      <circle cx="400" cy="342" r="5" fill="#fff"/>
      <circle cx="385" cy="342" r="3" fill="#fff"/>
      <circle cx="415" cy="342" r="3" fill="#fff"/>
    </svg>
  </div>
);

export default function App() {
  useEffect(() => { injectCSS(); }, []);

  const [screen, setScreen] = useState("login");
  const [lPwd, setLPwd] = useState(""); const [lErr, setLErr] = useState(false);
  const [gPwd, setGPwd] = useState(""); const [gErr, setGErr] = useState(false);
  const [services, setServices] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("registrar");
  const [step, setStep] = useState("svc");
  const [selSvc, setSelSvc] = useState(null);
  const [selPago, setSelPago] = useState(null);
  const [cliNom, setCliNom] = useState(""); const [cliTel, setCliTel] = useState(""); const [nota, setNota] = useState("");
  const [gDesc, setGDesc] = useState(""); const [gMonto, setGMonto] = useState("");
  const [period, setPeriod] = useState("todo");
  const [cliSearch, setCliSearch] = useState("");
  const [cliDet, setCliDet] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editNom, setEditNom] = useState(""); const [editTel, setEditTel] = useState("");
  const [svcOk, setSvcOk] = useState(false);
  const [gOk, setGOk] = useState(false);
  const [nomSugs, setNomSugs] = useState([]);
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("ram_pic") || null);
  const [turnoView, setTurnoView] = useState("dia");
  const [selFecha, setSelFecha] = useState(new Date().toISOString().split("T")[0]);
  const [weekStart, setWeekStart] = useState(() => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split("T")[0]; });
  const [showTurnoForm, setShowTurnoForm] = useState(false);
  const [tNom, setTNom] = useState(""); const [tTel, setTTel] = useState(""); const [tSvc, setTSvc] = useState("corte"); const [tHora, setTHora] = useState("10:00"); const [tFecha, setTFecha] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => { if (screen === "main" || screen === "gastos") loadAll(); }, [screen]);

  async function loadAll() {
    setLoading(true);
    const [s, g, c, t] = await Promise.all([
      apiGet("SERVICIOS"), apiGet("GASTOS"), apiGet("CLIENTES"), apiGet("TURNOS")
    ]);
    if (s.data) setServices(s.data);
    if (g.data) setGastos(g.data);
    if (c.data) setClientes(c.data);
    if (t.data) setTurnos(t.data);
    setLoading(false);
  }

  function doLogin() { if (lPwd === BARBER_PASS) { setLErr(false); setLPwd(""); setScreen("main"); } else setLErr(true); }
  function doGLogin() { if (gPwd === GASTOS_PASS) { setGErr(false); setGPwd(""); setScreen("gastos"); } else setGErr(true); }

  async function confirmSvc() {
    if (!selSvc || !selPago) return;
    const sv = SVCS.find(s => s.id === selSvc);
    await api("addServicio", { service: selSvc, price: sv.price, pago: selPago, note: nota, cliente_nombre: cliNom.trim() || "—", cliente_tel: cliTel });
    await loadAll();
    setSelSvc(null); setSelPago(null); setCliNom(""); setCliTel(""); setNota(""); setStep("svc"); setNomSugs([]);
    setSvcOk(true); setTimeout(() => setSvcOk(false), 2500);
  }

  async function addGasto() {
    if (!gDesc || !gMonto) return;
    await api("addGasto", { descripcion: gDesc, monto: parseFloat(gMonto) });
    await loadAll(); setGDesc(""); setGMonto(""); setGOk(true); setTimeout(() => setGOk(false), 2000);
  }

  async function addTurno() {
    if (!tNom.trim() || !tFecha || !tHora) return;
    await api("addTurno", { cliente_nombre: tNom.trim(), cliente_tel: tTel, service: tSvc, fecha: tFecha, hora: tHora, origen: "privado" });
    await loadAll(); setTNom(""); setTTel(""); setTSvc("corte"); setTHora("10:00"); setTFecha(new Date().toISOString().split("T")[0]); setShowTurnoForm(false);
  }

  async function delRow(sheet, id) {
    if (!window.confirm("Eliminar?")) return;
    await api("deleteRow", { sheet, id });
    await loadAll();
    if (sheet === "CLIENTES") setCliDet(null);
  }

  async function saveEdit() {
    if (!editNom.trim()) return;
    await api("updateCliente", { id: cliDet.ID, nombre: editNom.trim(), tel: editTel });
    await loadAll(); setCliDet({ ...cliDet, Nombre: editNom.trim(), Telefono: editTel }); setEditing(false);
  }

  function handlePicClick() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { setProfilePic(r.result); localStorage.setItem("ram_pic", r.result); }; r.readAsDataURL(f); };
    inp.click();
  }

  function filterList(list) {
    const now = new Date();
    return list.filter(item => {
      const dateStr = item.Fecha || item.fecha || "";
      if (!dateStr) return true;
      const parts = dateStr.split("/");
      const d = parts.length === 3 ? new Date(parts[2], parts[1]-1, parts[0]) : new Date(dateStr);
      if (period === "hoy") return d.toDateString() === now.toDateString();
      if (period === "semana") return (now - d) / 86400000 <= 7;
      if (period === "mes") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });
  }

  function getWeekDates() {
    const dates = []; const start = new Date(weekStart + "T12:00:00");
    for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); dates.push(d.toISOString().split("T")[0]); }
    return dates;
  }

  const fS = filterList(services), fG = filterList(gastos);
  const totIng = fS.reduce((a, b) => a + Number(b.Precio || 0), 0);
  const totGst = fG.reduce((a, b) => a + Number(b.Monto || 0), 0);
  const bal = totIng - totGst;
  const turnosDelDia = turnos.filter(t => t.Fecha === selFecha).sort((a, b) => (a.Hora || "").localeCompare(b.Hora || ""));
  const today = new Date().toISOString().split("T")[0];

  const FB = () => (
    <div className="fb">
      {["todo","hoy","semana","mes"].map((p,i) => (
        <button key={p} className={`fb-btn${period===p?" active":""}`} onClick={() => setPeriod(p)}>
          {["Todo","Hoy","Semana","Mes"][i]}
        </button>
      ))}
    </div>
  );

  const steps = ["svc","pago","cliente","confirm"];
  const SD = () => (
    <div className="dots">
      {steps.map((_,i) => <div key={i} className={`dot${i<steps.indexOf(step)?" done":i===steps.indexOf(step)?" active":""}`}/>)}
    </div>
  );

  const HDR = ({ title, sub, right }) => (
    <div className="hdr">
      <div>
        <div className="cinzel" style={{ fontSize:16, color:"#fff", letterSpacing:3, textTransform:"uppercase" }}>{title}</div>
        {sub && <div style={{ fontSize:9, color:"#555", letterSpacing:".1em", textTransform:"uppercase", marginTop:1 }}>{sub}</div>}
      </div>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>{right}</div>
    </div>
  );

  const SugList = ({ suggestions, onSelect }) => {
    if (!suggestions || suggestions.length === 0) return null;
    return (
      <div className="sug-box">
        <div style={{ padding:"5px 12px", fontSize:9, color:"#555", fontFamily:"'Cinzel',serif", letterSpacing:".1em", borderBottom:"1px solid #111" }}>Clientes encontrados</div>
        {suggestions.slice(0,5).map((c,i) => (
          <div key={i} className="sug-item" onClick={() => onSelect(c)}>
            <span style={{ color:"#fff", fontFamily:"'Cinzel',serif", fontSize:12 }}>{c.Nombre}</span>
            <span style={{ color:"#555", fontSize:11 }}>{c.Telefono}</span>
          </div>
        ))}
      </div>
    );
  };

  if (screen === "login") return (
    <div className="login-wrap">
      <LogoSVG />
      <div className="login-card">
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div className="cinzel" style={{ fontSize:28, color:"#fff", letterSpacing:8, marginBottom:4 }}>RAM</div>
          <div className="cinzel" style={{ fontSize:9, letterSpacing:10, color:"#555" }}>Hair Studio</div>
          <div style={{ width:30, height:1, background:"#1a1a1a", margin:"12px auto 0" }}/>
        </div>
        <span className="field-lbl">Contrasena</span>
        <input className="field" type="password" value={lPwd} onChange={e=>setLPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} placeholder="········"/>
        {lErr && <p style={{ fontSize:11, color:"#c0392b", marginBottom:12 }}>Contrasena incorrecta</p>}
        <button className="btn-main" onClick={doLogin}>Ingresar</button>
      </div>
    </div>
  );

  if (screen === "gastos_login") return (
    <div className="login-wrap">
      <div className="login-card" style={{ textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:16, opacity:.4 }}>🔐</div>
        <div className="cinzel" style={{ fontSize:24, color:"#fff", letterSpacing:6, marginBottom:32 }}>Gastos</div>
        <span className="field-lbl" style={{ textAlign:"left", display:"block" }}>Contrasena</span>
        <input className="field" type="password" value={gPwd} onChange={e=>setGPwd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doGLogin()} placeholder="········"/>
        {gErr && <p style={{ fontSize:11, color:"#c0392b", marginBottom:12 }}>Contrasena incorrecta</p>}
        <button className="btn-main" onClick={doGLogin} style={{ marginBottom:8 }}>Acceder</button>
        <button className="btn-ghost" onClick={()=>setScreen("main")}>Volver</button>
      </div>
    </div>
  );

  if (screen === "gastos") return (
    <div style={{ background:"#000", minHeight:"100vh" }}>
      <HDR title="Gastos" sub="Acceso exclusivo" right={<button className="btn-sm" onClick={()=>setScreen("main")}>Volver</button>}/>
      <div className="body">
        <FB/>
        <div className="metrics">
          {[["Ingresos",fmtP(totIng),"#4a9a7a"],["Gastos",fmtP(totGst),"#ff6b6b"],["Balance",fmtP(bal),bal>=0?"#4a9a7a":"#ff6b6b"]].map(([l,v,c])=>(
            <div key={l} className="met"><div className="met-l">{l}</div><div className="met-v" style={{ color:c, fontSize:16 }}>{v}</div></div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Registrar gasto</div>
          <span className="field-lbl">Descripcion</span>
          <input className="field" value={gDesc} onChange={e=>setGDesc(e.target.value)} placeholder="Factura, insumos..."/>
          <span className="field-lbl">Monto</span>
          <input className="field" type="number" value={gMonto} onChange={e=>setGMonto(e.target.value)} placeholder="0"/>
          <button className="btn-main" onClick={addGasto} style={{ background:"#0a0a0a", color:"#ff6b6b", border:"1px solid #2a1a1a" }}>Agregar gasto</button>
          {gOk && <p style={{ fontSize:11, color:"#4a9a7a", marginTop:8, textAlign:"center", fontFamily:"'Cinzel',serif" }}>Registrado</p>}
        </div>
        <div className="card">
          <div className="card-title">Historial ({fG.length})</div>
          {fG.length===0 && <p style={{ fontSize:12, color:"#333", fontStyle:"italic" }}>Sin gastos</p>}
          {fG.map((g,i)=>(
            <div key={i} className="row">
              <div><div style={{ color:"#fff" }}>{g.Descripcion}</div><div style={{ fontSize:10, color:"#555" }}>{g.Fecha}</div></div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <span className="pill pill-r">{fmtP(g.Monto)}</span>
                <button className="btn-danger" onClick={()=>delRow("GASTOS",g.ID)}>x</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (cliDet) {
    const hCli = services.filter(r => r.Cliente === cliDet.Nombre);
    const tCli = hCli.reduce((a,b)=>a+Number(b.Precio||0),0);
    return (
      <div style={{ background:"#000", minHeight:"100vh" }}>
        <HDR title={cliDet.Nombre} sub="Perfil" right={<>
          <button className="btn-sm" onClick={()=>{setEditing(true);setEditNom(cliDet.Nombre);setEditTel(cliDet.Telefono||"");}}>Editar</button>
          <button className="btn-danger" onClick={()=>delRow("CLIENTES",cliDet.ID)}>Eliminar</button>
          <button className="btn-sm" onClick={()=>setCliDet(null)}>Volver</button>
        </>}/>
        <div className="body">
          {editing && (
            <div className="card fade-up">
              <div className="card-title">Editar cliente</div>
              <span className="field-lbl">Nombre</span>
              <input className="field" value={editNom} onChange={e=>setEditNom(e.target.value)}/>
              <span className="field-lbl">Telefono</span>
              <input className="field" value={editTel} onChange={e=>setEditTel(e.target.value)}/>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn-ghost" style={{ flex:1, marginTop:0 }} onClick={()=>setEditing(false)}>Cancelar</button>
                <button className="btn-main" style={{ flex:2 }} onClick={saveEdit}>Guardar</button>
              </div>
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            <div className="met"><div className="met-l">Visitas</div><div className="met-v">{cliDet.Visitas}</div></div>
            <div className="met"><div className="met-l">Total</div><div className="met-v" style={{ fontSize:16, color:"#4a9a7a" }}>{fmtP(tCli)}</div></div>
          </div>
          {cliDet.Telefono && <p style={{ fontSize:12, color:"#555", marginBottom:8 }}>Tel: {cliDet.Telefono}</p>}
          <div className="card">
            <div className="card-title">Historial ({hCli.length})</div>
            {hCli.length===0 && <p style={{ fontSize:12, color:"#333", fontStyle:"italic" }}>Sin visitas</p>}
            {hCli.map((r,i)=>(
              <div key={i} className="row">
                <div><div className="cinzel" style={{ fontSize:13, color:"#fff" }}>{r.Servicio}</div><div style={{ fontSize:10, color:"#555" }}>{r.Fecha} {r.Hora} — {r["Metodo Pago"]}</div></div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span className="pill pill-g">{fmtP(r.Precio)}</span>
                  <button className="btn-danger" onClick={()=>delRow("SERVICIOS",r.ID)}>x</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:"#000", minHeight:"100vh" }}>
      <HDR title="RAM Hair Studio" sub="Administrador" right={<>
        <button className="btn-sm" style={{ color:"#ff6b6b", borderColor:"#3a1a1a" }} onClick={()=>setScreen("gastos_login")}>Gastos</button>
        <button className="btn-sm" onClick={()=>setScreen("login")}>Salir</button>
        <div onClick={handlePicClick} style={{ width:34, height:34, borderRadius:"50%", border:"1px solid #2a2a2a", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", flexShrink:0 }}>
          {profilePic ? <img src={profilePic} alt="p" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <span className="cinzel" style={{ fontSize:10, color:"#555" }}>R</span>}
        </div>
      </>}/>

      <div className="tabs">
        {["registrar","turnero","dashboard","historial","clientes"].map((t,i)=>(
          <button key={t} className={`tab${tab===t?" active":""}`} onClick={()=>{setTab(t);setStep("svc");setSelSvc(null);setSelPago(null);}}>
            {["Registrar","Turnero","Resumen","Historial","Clientes"][i]}
          </button>
        ))}
      </div>

      <div className="body">
        {loading && <p className="cinzel" style={{ color:"#555", fontSize:11, textAlign:"center", padding:"10px 0", letterSpacing:".1em" }}>Cargando...</p>}

        {tab==="registrar" && (
          <>
            <SD/>
            {svcOk && <div className="card" style={{ textAlign:"center", borderColor:"#1a3a2a" }}><div className="cinzel" style={{ fontSize:22, color:"#fff", marginBottom:6 }}>✦</div><div className="cinzel" style={{ fontSize:10, color:"#555", letterSpacing:".2em" }}>Servicio registrado</div></div>}
            {step==="svc" && (
              <div className="card fade-up">
                <div className="card-title">Paso 1 — Servicio</div>
                <div className="svc-grid">
                  {SVCS.map(sv=>(
                    <div key={sv.id} className={`svc-card${selSvc===sv.id?" active":""}`} onClick={()=>setSelSvc(sv.id)}>
                      <div className="cinzel" style={{ fontSize:12, color:"#fff", marginBottom:6 }}>{sv.label}</div>
                      <div className="cinzel" style={{ fontSize:18, color:selSvc===sv.id?"#fff":"#444" }}>{fmtP(sv.price)}</div>
                    </div>
                  ))}
                </div>
                <button className={`btn-main${selSvc?"":" dim"}`} onClick={()=>selSvc&&setStep("pago")}>Continuar</button>
              </div>
            )}
            {step==="pago" && (
              <div className="card fade-up">
                <div className="card-title">Paso 2 — Cobro</div>
                <p style={{ fontSize:11, color:"#555", fontStyle:"italic", marginBottom:14 }}>{SVCS.find(x=>x.id===selSvc)?.label} — {fmtP(SVCS.find(x=>x.id===selSvc)?.price)}</p>
                <div className="pago-grid">
                  {PAGOS.map(p=>(
                    <div key={p.id} className={`pago-card${selPago===p.id?" active":""}`} onClick={()=>setSelPago(p.id)}>
                      <div style={{ fontSize:20, marginBottom:4 }}>{p.icon}</div>
                      <div className="cinzel" style={{ fontSize:9, color:selPago===p.id?"#fff":"#555" }}>{p.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setStep("svc")}>Atras</button>
                  <button className={`btn-main${selPago?"":" dim"}`} style={{ flex:2 }} onClick={()=>selPago&&setStep("cliente")}>Continuar</button>
                </div>
              </div>
            )}
            {step==="cliente" && (
              <div className="card fade-up">
                <div className="card-title">Paso 3 — Cliente (opcional)</div>
                <span className="field-lbl">Telefono</span>
                <input className="field" type="tel" value={cliTel} onChange={e=>setCliTel(e.target.value)} placeholder="+54 9 ..."/>
                <span className="field-lbl">Nombre</span>
                <input className="field" type="text" value={cliNom} onChange={e=>setCliNom(e.target.value)} placeholder="Carlos Lopez..."/>
                <button className="btn-sm" style={{ width:"100%", marginBottom:12 }} onClick={()=>{const q=cliNom.trim()||cliTel.trim();if(!q)return;setNomSugs(clientes.filter(c=>c.Nombre.toLowerCase().includes(q.toLowerCase())||(c.Telefono&&c.Telefono.includes(q))));}}>Buscar cliente</button>
                <SugList suggestions={nomSugs} onSelect={c=>{setCliNom(c.Nombre);setCliTel(c.Telefono||"");setNomSugs([]);}}/>
                <span className="field-lbl" style={{ marginTop:8 }}>Nota</span>
                <input className="field" type="text" value={nota} onChange={e=>setNota(e.target.value)} placeholder="Cliente frecuente..."/>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setStep("pago")}>Atras</button>
                  <button className="btn-main" style={{ flex:2 }} onClick={()=>setStep("confirm")}>Continuar</button>
                </div>
              </div>
            )}
            {step==="confirm" && (
              <div className="card fade-up">
                <div className="card-title">Paso 4 — Confirmar</div>
                {[["Servicio",SVCS.find(x=>x.id===selSvc)?.label],["Precio",fmtP(SVCS.find(x=>x.id===selSvc)?.price)],["Cobro",PAGOS.find(x=>x.id===selPago)?.icon+" "+PAGOS.find(x=>x.id===selPago)?.label],["Cliente",cliNom||"—"],["Tel",cliTel||"—"],["Nota",nota||"—"]].map(([k,v])=>(
                  <div key={k} className="cf-row"><span className="ck">{k}</span><span style={{ color:"#fff", fontWeight:500 }}>{v}</span></div>
                ))}
                <div style={{ display:"flex", gap:8, marginTop:16 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setStep("cliente")}>Atras</button>
                  <button className="btn-main" style={{ flex:2 }} onClick={confirmSvc}>Confirmar</button>
                </div>
              </div>
            )}
          </>
        )}

        {tab==="turnero" && (
          <>
            <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
              <button className={`fb-btn${turnoView==="dia"?" active":""}`} onClick={()=>setTurnoView("dia")}>Dia</button>
              <button className={`fb-btn${turnoView==="semana"?" active":""}`} onClick={()=>setTurnoView("semana")}>Semana</button>
              <div style={{ flex:1 }}/>
              <button className="btn-sm" onClick={()=>setShowTurnoForm(!showTurnoForm)}>+ Turno</button>
            </div>
            {showTurnoForm && (
              <div className="card fade-up" style={{ borderColor:"#1a2a3a" }}>
                <div className="card-title">Nuevo turno</div>
                <span className="field-lbl">Telefono</span>
                <input className="field" type="tel" value={tTel} onChange={e=>setTTel(e.target.value)} placeholder="+54 9 ..."/>
                <span className="field-lbl">Nombre</span>
                <input className="field" type="text" value={tNom} onChange={e=>setTNom(e.target.value)} placeholder="Carlos Lopez..."/>
                <span className="field-lbl">Servicio</span>
                <select className="field" value={tSvc} onChange={e=>setTSvc(e.target.value)}>
                  {SVCS.map(sv=><option key={sv.id} value={sv.id} style={{ background:"#111" }}>{sv.label}</option>)}
                </select>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><span className="field-lbl">Fecha</span><input className="field" type="date" value={tFecha} onChange={e=>setTFecha(e.target.value)}/></div>
                  <div><span className="field-lbl">Hora</span><input className="field" type="time" value={tHora} onChange={e=>setTHora(e.target.value)}/></div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-ghost" style={{ flex:1 }} onClick={()=>setShowTurnoForm(false)}>Cancelar</button>
                  <button className="btn-main" style={{ flex:2 }} onClick={addTurno}>Agendar</button>
                </div>
              </div>
            )}
            {turnoView==="semana" && (
              <>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <button className="btn-sm" onClick={()=>{const d=new Date(weekStart+"T12:00:00");d.setDate(d.getDate()-7);setWeekStart(d.toISOString().split("T")[0]);}}>← Anterior</button>
                  <span className="cinzel" style={{ fontSize:10, color:"#555" }}>Semana</span>
                  <button className="btn-sm" onClick={()=>{const d=new Date(weekStart+"T12:00:00");d.setDate(d.getDate()+7);setWeekStart(d.toISOString().split("T")[0]);}}>Siguiente →</button>
                </div>
                <div className="week-grid">
                  {getWeekDates().map(date=>{
                    const d=new Date(date+"T12:00:00");
                    const cnt=turnos.filter(t=>t.Fecha===date).length;
                    return(
                      <div key={date} className={`week-day${selFecha===date?" active":""}${date===today?" today":""}`} onClick={()=>{setSelFecha(date);setTurnoView("dia");}}>
                        <div className="wd-name">{DIAS[d.getDay()]}</div>
                        <div className="wd-num">{d.getDate()}</div>
                        {cnt>0&&<div style={{ width:5, height:5, borderRadius:"50%", background:"#fff", margin:"3px auto 0" }}/>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {turnoView==="dia" && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                  <input className="field" type="date" value={selFecha} onChange={e=>setSelFecha(e.target.value)} style={{ width:"auto", flex:1, marginBottom:0 }}/>
                  <span className="cinzel" style={{ fontSize:11, color:"#555" }}>{turnosDelDia.length} turno{turnosDelDia.length!==1?"s":""}</span>
                </div>
                {turnosDelDia.length===0 && <p style={{ fontSize:12, color:"#333", fontStyle:"italic", textAlign:"center", padding:"24px 0" }}>Sin turnos para este dia</p>}
                {turnosDelDia.map((t,i)=>(
                  <div key={i} className="turno-card">
                    <div style={{ display:"flex", alignItems:"center" }}>
                      <div className="turno-hora">{t.Hora}</div>
                      <div>
                        <div className="cinzel" style={{ fontSize:13, color:"#fff" }}>{t.Cliente}</div>
                        <div style={{ fontSize:10, color:"#555" }}>{t.Servicio}{t.Telefono&&t.Telefono!=="—"?" · "+t.Telefono:""}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span className="pill">{t.Servicio}</span>
                      <button className="btn-danger" onClick={()=>delRow("TURNOS",t.ID)}>x</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {tab==="dashboard" && (
          <>
            <FB/>
            <div className="metrics">
              {[["Ingresos",fmtP(totIng),"#4a9a7a"],["Servicios",fS.length,"#fff"],["Promedio",fmtP(fS.length?Math.round(totIng/fS.length):0),"#fff"]].map(([l,v,c])=>(
                <div key={l} className="met"><div className="met-l">{l}</div><div className="met-v" style={{ color:c }}>{v}</div></div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">Por servicio</div>
              {SVCS.map(sv=>{
                const cnt=fS.filter(r=>r.Servicio===sv.label).length;
                const tot=fS.filter(r=>r.Servicio===sv.label).reduce((a,b)=>a+Number(b.Precio||0),0);
                const pct=fS.length?Math.round(cnt/fS.length*100):0;
                return(
                  <div key={sv.id} className="row" style={{ flexDirection:"column", alignItems:"flex-start", gap:4 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
                      <span className="cinzel" style={{ fontSize:12, color:"#fff" }}>{sv.label}</span>
                      <div style={{ display:"flex", gap:6 }}><span className="pill">{cnt}x</span><span className="pill pill-g">{fmtP(tot)}</span></div>
                    </div>
                    <div className="bar-bg"><div className="bar-fill" style={{ width:pct+"%" }}/></div>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div className="card-title">Turnos proximos</div>
              {turnos.filter(t=>t.Fecha>=today).slice(0,5).map((t,i)=>(
                <div key={i} className="row">
                  <div><div className="cinzel" style={{ fontSize:12, color:"#fff" }}>{t.Cliente}</div><div style={{ fontSize:10, color:"#555" }}>{t.Fecha} a las {t.Hora}</div></div>
                  <span className="pill">{t.Servicio}</span>
                </div>
              ))}
              {turnos.filter(t=>t.Fecha>=today).length===0&&<p style={{ fontSize:12, color:"#333", fontStyle:"italic" }}>Sin turnos proximos</p>}
            </div>
          </>
        )}

        {tab==="historial" && (
          <>
            <FB/>
            <div className="card">
              <div className="card-title">Registros ({fS.length})</div>
              {fS.length===0&&<p style={{ fontSize:12, color:"#333", fontStyle:"italic" }}>Sin registros</p>}
              {fS.map((r,i)=>(
                <div key={i} className="row">
                  <div>
                    <div className="cinzel" style={{ fontSize:13, color:"#fff" }}>{r.Servicio}</div>
                    <div style={{ fontSize:10, color:"#555" }}>{r.Fecha} {r.Hora} — {r["Metodo Pago"]}{r.Cliente&&r.Cliente!=="—"?" — "+r.Cliente:""}</div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span className="pill pill-g">{fmtP(r.Precio)}</span>
                    <button className="btn-danger" onClick={()=>delRow("SERVICIOS",r.ID)}>x</button>
                  </div>
                </div>
              ))}
              {fS.length>0&&<div style={{ display:"flex", justifyContent:"flex-end", paddingTop:10 }}><span className="cinzel" style={{ fontSize:11, color:"#555" }}>Total: </span><span className="cinzel" style={{ color:"#4a9a7a", marginLeft:8 }}>{fmtP(totIng)}</span></div>}
            </div>
          </>
        )}

        {tab==="clientes" && (
          <>
            <input className="field" value={cliSearch} onChange={e=>setCliSearch(e.target.value)} placeholder="Buscar cliente..." style={{ marginBottom:14 }}/>
            <div className="card">
              <div className="card-title">Clientes ({clientes.length})</div>
              {clientes.length===0&&<p style={{ fontSize:12, color:"#333", fontStyle:"italic" }}>Sin clientes</p>}
              {clientes.filter(c=>c.Nombre&&c.Nombre.toLowerCase().includes(cliSearch.toLowerCase())).map((c,i)=>(
                <div key={i} className="row" style={{ cursor:"pointer" }} onClick={()=>setCliDet(c)}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div className="cinzel" style={{ width:34, height:34, borderRadius:"50%", border:"1px solid #1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff", flexShrink:0 }}>
                      {c.Nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="cinzel" style={{ fontSize:13, color:"#fff" }}>{c.Nombre}</div>
                      <div style={{ fontSize:10, color:"#555" }}>{c.Telefono||"Sin tel"} · {c.Visitas} visita{c.Visitas!=="1"?"s":""}</div>
                    </div>
                  </div>
                  <span style={{ color:"#333", fontSize:16 }}>›</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
