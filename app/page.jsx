'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TABS = ['Dashboard', 'Mindset', 'Entwicklung', 'BWL-Check', 'Angebote', 'Zielgruppen', 'KI-Assistent']
const GOAL = 3000

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('E-Mail oder Passwort falsch.')
    setLoading(false)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    })
    if (error) setError('Fehler beim Senden. E-Mail prüfen.')
    else setResetSent(true)
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg"
            alt="Logo"
            style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', marginBottom: 16 }}
          />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--teal-bright)' }}>ERWIN OS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {resetMode ? 'Passwort zurücksetzen' : 'Persönliches Entwicklungssystem'}
          </p>
        </div>

        {resetSent ? (
          <div className="text-center space-y-4">
            <div style={{ color: '#22c55e', fontSize: 32 }}>✓</div>
            <p className="text-base" style={{ color: 'var(--text)' }}>E-Mail gesendet!</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Prüfe dein Postfach bei <strong>{email}</strong> und klicke den Link.</p>
            <button onClick={() => { setResetMode(false); setResetSent(false) }} className="btn-ghost w-full">
              Zurück zum Login
            </button>
          </div>
        ) : resetMode ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-muted)' }}>E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="erwin@mentaltraining.at" required />
            </div>
            {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Senden...' : 'Reset-Link senden'}
            </button>
            <button type="button" onClick={() => setResetMode(false)} className="btn-ghost w-full">
              Zurück zum Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-muted)' }}>E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="erwin@mentaltraining.at" required />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-muted)' }}>Passwort</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
            <button type="button" onClick={() => { setResetMode(true); setError('') }} className="btn-ghost w-full text-sm">
              Passwort vergessen?
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
const OTHER_APPS = [
  { label: 'App',      url: 'https://app.mentaltraining.at/' },
  { label: 'ANKER',    url: 'https://anker.mentaltraining.at/' },
  { label: 'Finanzen', url: 'https://finanz-cockpit.mentaltraining.at/' },
  { label: 'CRM',      url: 'https://crm.mentaltraining.at/' },
]

function Header({ activeTab, setActiveTab, onLogout }) {
  return (
    <header style={{ background: 'var(--teal-header)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* Top bar: Logo + App-Links + Abmelden */}
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #ffffff12' }}>
          {/* Logo – klickbar → Dashboard */}
          <button
            onClick={() => setActiveTab('Dashboard')}
            className="flex items-center gap-3"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img
              src="https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg"
              alt="Mental Training Logo"
              style={{ width: 40, height: 40, borderRadius: 9, objectFit: 'cover' }}
            />
            <div className="text-left">
              <div className="text-lg font-bold" style={{ color: '#fff', lineHeight: 1.2 }}>ERWIN OS</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>mentaltraining.at</div>
            </div>
          </button>

          {/* Other Apps + Logout */}
          <div className="flex items-center gap-1">
            {OTHER_APPS.map(app => (
              <a
                key={app.label}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.16)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
              >
                {app.label} ↗
              </a>
            ))}
            <button onClick={onLogout} style={{
              fontSize: 12, padding: '4px 10px', borderRadius: 6, marginLeft: 4,
              background: 'none', color: 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer'
            }}>
              Abmelden
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px', fontSize: 14, whiteSpace: 'nowrap',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--teal-bright)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--teal-bright)' : 'rgba(255,255,255,0.55)',
                fontWeight: activeTab === tab ? 600 : 400,
                opacity: tab === 'KI-Assistent' ? 0.5 : 1,
                transition: 'color 0.15s'
              }}
            >
              {tab === 'KI-Assistent' ? '🔒 ' : ''}{tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ metrics }) {
  const latest = metrics[0] || {}
  const revenue = latest.revenue || 0
  const progress = Math.min((revenue / GOAL) * 100, 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Willkommen zurück, Erwin.</h2>
        <p className="text-sm text-gray-500">Dein persönliches Entwicklungs-Dashboard.</p>
      </div>

      {/* Ziel-Progress */}
      <div className="card">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-400">Monatsziel: €3.000 netto</span>
          <span className="text-xl font-bold text-white">€{revenue.toLocaleString('de-AT')}</span>
        </div>
        <div style={{ background: '#1f2e2e', borderRadius: 8, height: 8 }}>
          <div
            style={{
              width: `${progress}%`,
              background: progress >= 100 ? '#22c55e' : '#006f6a',
              height: '100%',
              borderRadius: 8,
              transition: 'width 0.5s'
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-600">0</span>
          <span className="text-xs text-gray-600">{progress.toFixed(0)}% erreicht</span>
          <span className="text-xs text-gray-600">€3.000</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Umsatz', value: `€${(latest.revenue || 0).toLocaleString('de-AT')}`, color: '#5eead4' },
          { label: 'Neue Kunden', value: latest.new_clients || 0, color: '#a78bfa' },
          { label: 'Gespräche', value: latest.conversations || 0, color: '#60a5fa' },
          { label: 'ROAS', value: latest.roas ? `${latest.roas}x` : '—', color: '#fb923c' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Prioritäten */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Aktuelle Prioritäten</h3>
        <div className="space-y-2">
          {[
            { nr: 1, text: 'Buchungsseite 1:1 Coaching live schalten', modul: 'Verkaufen' },
            { nr: 2, text: 'Tracking (GA4 + GTM) einrichten', modul: 'Marketing' },
            { nr: 3, text: 'Regulärpreis Kurs festlegen (Empfehlung: €397)', modul: 'BWL' },
          ].map(p => (
            <div key={p.nr} className="flex items-start gap-3">
              <span className="text-xs px-2 py-0.5 rounded-full mt-0.5" style={{ background: '#006f6a22', color: '#5eead4', whiteSpace: 'nowrap' }}>
                {p.modul}
              </span>
              <span className="text-sm text-gray-300">{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BWL-CHECK ───────────────────────────────────────────────────────────────
function BWLCheck({ metrics, onSave }) {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const [form, setForm] = useState({
    month: currentMonth,
    revenue: '',
    new_clients: '',
    conversations: '',
    ad_spend: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    const data = {
      month: form.month + '-01',
      revenue: parseFloat(form.revenue) || 0,
      new_clients: parseInt(form.new_clients) || 0,
      conversations: parseInt(form.conversations) || 0,
      ad_spend: parseFloat(form.ad_spend) || 0,
      notes: form.notes
    }
    const { error } = await supabase.from('metrics').upsert(data, { onConflict: 'month' })
    if (!error) { setSuccess(true); onSave(); setTimeout(() => setSuccess(false), 3000) }
    setSaving(false)
  }

  const roas = form.ad_spend > 0 && form.revenue > 0
    ? (parseFloat(form.revenue) / parseFloat(form.ad_spend)).toFixed(2)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">BWL-Check</h2>
        <p className="text-sm text-gray-500">Monatliche Kennzahlen — ehrlich, direkt, auf den Punkt.</p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Monat</label>
            <input type="month" value={form.month} onChange={e => set('month', e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Umsatz (€)</label>
            <input type="number" placeholder="0" value={form.revenue} onChange={e => set('revenue', e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Neue Kunden</label>
            <input type="number" placeholder="0" value={form.new_clients} onChange={e => set('new_clients', e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Gespräche / Erstkontakte</label>
            <input type="number" placeholder="0" value={form.conversations} onChange={e => set('conversations', e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Ad-Spend (€)</label>
            <input type="number" placeholder="0" value={form.ad_spend} onChange={e => set('ad_spend', e.target.value)} className="input" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">ROAS (auto)</label>
            <div className="input" style={{ color: roas ? '#5eead4' : '#4b5563' }}>
              {roas ? `${roas}x` : '—'}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Notizen</label>
          <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} className="input" placeholder="Was lief gut? Was nicht? Was änderst du?" />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Speichern...' : success ? '✓ Gespeichert' : 'Speichern'}
        </button>
      </div>

      {/* Historie */}
      {metrics.length > 0 && (
        <div className="card overflow-x-auto">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Verlauf</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs">
                <th className="pb-2">Monat</th>
                <th className="pb-2 text-right">Umsatz</th>
                <th className="pb-2 text-right">Kunden</th>
                <th className="pb-2 text-right">Gespräche</th>
                <th className="pb-2 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map(m => (
                <tr key={m.id} style={{ borderTop: '1px solid #1f2e2e' }}>
                  <td className="py-2 text-gray-400">{new Date(m.month).toLocaleDateString('de-AT', { month: 'long', year: 'numeric' })}</td>
                  <td className="py-2 text-right text-white">€{m.revenue?.toLocaleString('de-AT')}</td>
                  <td className="py-2 text-right text-gray-400">{m.new_clients}</td>
                  <td className="py-2 text-right text-gray-400">{m.conversations}</td>
                  <td className="py-2 text-right" style={{ color: m.roas > 2 ? '#22c55e' : '#e5e7eb' }}>{m.roas ? `${m.roas}x` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── ANGEBOTE ─────────────────────────────────────────────────────────────────
function Angebote() {
  const products = [
    {
      name: 'Onlinekurs „Gelassen selbstwirksam"',
      price: '€ 297',
      tag: 'Einführungsangebot',
      color: '#5eead4',
      details: ['Selbstlernkurs, eigenes Tempo', 'Sofortiger Zugang', 'E-Book inklusive'],
      link: 'https://masterclass.mentaltraining.at/',
      status: '✅ Aktiv'
    },
    {
      name: '1:1 Einzelsession',
      price: '€ 150',
      tag: '50 Minuten',
      color: '#a78bfa',
      details: ['Online via Video', 'Fokussiert, auf den Punkt', 'Konkreter Transfer'],
      link: null,
      status: '⚙️ Buchungsseite einrichten'
    },
    {
      name: '5er Coaching-Paket',
      price: '€ 750',
      tag: 'Empfohlen',
      color: '#fb923c',
      details: ['5 × 50 Minuten', 'Schriftliche Impulse zwischen Sessions', '€ 150 / Session'],
      link: null,
      status: '⚙️ Buchungsseite einrichten'
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Angebote</h2>
        <p className="text-sm text-gray-500">Aktuelle Produkte und Preise.</p>
      </div>
      <div className="space-y-4">
        {products.map(p => (
          <div key={p.name} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: p.color + '22', color: p.color }}>{p.tag}</span>
                  <span className="text-xs text-gray-500">{p.status}</span>
                </div>
                <h3 className="text-white font-medium">{p.name}</h3>
                <ul className="mt-2 space-y-0.5">
                  {p.details.map(d => <li key={d} className="text-xs text-gray-500">· {d}</li>)}
                </ul>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: p.color }}>{p.price}</div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 mt-1 block">Landingpage →</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ borderColor: '#2a1f0e' }}>
        <div className="text-xs text-gray-500 mb-1">Monatsziel-Kalkulation</div>
        <div className="text-sm text-gray-400">4× Kurs + 2× 5er-Paket = <span className="text-white font-semibold">€ 2.688</span></div>
        <div className="text-xs text-gray-600 mt-1">+ gelegentlich Workshop/VIP-Tag → €3.000 realistisch</div>
      </div>
    </div>
  )
}

// ─── ZIELGRUPPEN ─────────────────────────────────────────────────────────────
function Zielgruppen() {
  const avatare = [
    {
      nr: 1,
      titel: 'Die kompetente Frau',
      sub: 'die sich unter Druck verliert',
      color: '#5eead4',
      kern: 'Kompetent, erfahren — aber im entscheidenden Moment nicht stimmig mit sich selbst.',
      einwand: '„Ich habe schon so viel versucht — das funktioniert bei MIR nicht."',
      motiv: 'Würdigung statt Druck. Ein Weg, der nicht gegen sie arbeitet.',
    },
    {
      nr: 2,
      titel: 'Musiker auf der Bühne',
      sub: 'Können vorhanden, Abruf blockiert',
      color: '#a78bfa',
      kern: 'Im Proberaum alles da — auf der Bühne greift ein älterer Ablauf nach der Führung.',
      einwand: '„Ich blockiere mich selbst."',
      motiv: 'Verlässlicher Zugang zu Ruhe und Können genau dann, wenn es zählt.',
    },
    {
      nr: 3,
      titel: 'Angehende Führungskraft',
      sub: 'Fachkompetenz da, Präsenz noch nicht',
      color: '#fb923c',
      kern: 'Will mehr Verantwortung — spürt aber, dass er/sie sich in Schlüsselmomenten nicht so zeigt wie gewollt.',
      einwand: '„Ich weiß nicht ob ich das kann."',
      motiv: 'Innere Führung als Grundlage für äußere Führung.',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Zielgruppen</h2>
        <p className="text-sm text-gray-500">Drei Avatare — ein gemeinsamer Kern.</p>
      </div>

      <div className="card text-sm" style={{ borderColor: '#1f2e2e' }}>
        <span className="text-xs text-gray-500">Gemeinsamer Kern: </span>
        <span className="text-gray-300">Fähigkeiten sind vorhanden — aber unter Druck nicht abrufbar.</span>
      </div>

      <div className="space-y-4">
        {avatare.map(a => (
          <div key={a.nr} className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: a.color + '22', color: a.color }}>{a.nr}</span>
              <div>
                <div className="text-white font-medium text-sm">{a.titel}</div>
                <div className="text-xs text-gray-500">{a.sub}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500 text-xs">Kern · </span><span className="text-gray-300">{a.kern}</span></div>
              <div><span className="text-gray-500 text-xs">Einwand · </span><span className="text-gray-400 italic">{a.einwand}</span></div>
              <div><span className="text-gray-500 text-xs">Motiv · </span><span className="text-gray-300">{a.motiv}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MINDSET-ENTWICKLUNG ─────────────────────────────────────────────────────
const SPRUECHE = [
  {
    text: 'Deine Intuition (Embodiment) hat dir schon gesagt, was du tun sollst.\nAlles andere sind noch Verhandlungen mit deiner Angst.',
    quelle: 'ERWIN OS',
  },
]

function MindsetEntwicklung() {
  const STUFEN = ['Wissen', 'Verstehen', 'Anwenden', 'Integriert']
  const BEREICHE = [
    { id: 'steuerposition', label: 'Steuerposition halten', beschreibung: 'Auch unter Druck in der eigenen Mitte bleiben' },
    { id: 'wert', label: 'Eigenen Wert kennen', beschreibung: 'Honorarklarheit, kein Rechtfertigen' },
    { id: 'sichtbarkeit', label: 'Sichtbarkeit als Einladung', beschreibung: 'Sichtbar sein ohne Angriffsfläche-Gefühl' },
    { id: 'initiative', label: 'Initiative ohne Schuldgefühl', beschreibung: 'Auf Menschen zugehen ohne Verbindungs-Angst' },
    { id: 'koerper', label: 'Körper als Ressource', beschreibung: 'Embodiment täglich nutzen, nicht nur in Krisen' },
    { id: 'muster', label: 'Schutzmuster würdigen', beschreibung: 'Alte Muster erkennen ohne sie zu bekämpfen' },
  ]

  const [stufen, setStufen] = useState(() => {
    const init = {}
    BEREICHE.forEach(b => { init[b.id] = 0 })
    return init
  })
  const [eintrag, setEintrag] = useState('')
  const [eintraege, setEintraege] = useState([
    { datum: '31.05.2026', text: 'Swish durchgeführt – Ziel-Zustand erarbeitet. Atem frei, Kompetenzgefühl aktiviert.' },
  ])

  const addEintrag = () => {
    if (!eintrag.trim()) return
    const heute = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    setEintraege(e => [{ datum: heute, text: eintrag }, ...e])
    setEintrag('')
  }

  const stufenFarbe = (s) => ['#4b5563','#60a5fa','#a78bfa','#00a89a'][s]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>Mindset-Entwicklung</h2>
        <p className="text-base" style={{ color: 'var(--text-muted)' }}>Steuerposition nach Dr. Gunter Schmidt – dein inneres Fundament.</p>
      </div>

      {/* Ziel-Zustand */}
      <div className="card" style={{ borderColor: '#2d1f4e', borderLeftWidth: 4, borderLeftColor: '#a78bfa' }}>
        <div className="text-xs mb-2" style={{ color: '#a78bfa' }}>ZIEL-ZUSTAND · NLP Swish · Mai 2026</div>
        <p className="text-base italic leading-relaxed" style={{ color: 'var(--text)' }}>
          „Ich stehe mitten im Raum, umringt von Frauen die sehnsüchtig auf mich und meine Produkte gewartet haben. Um mich herum wachsame, starke Löwen die mich schützen. Ich spüre tiefe Verbundenheit mit meinem wahren Selbst, bin unerschütterlich sicher über meinen Wert, habe Honorarklarheit."
        </p>
      </div>

      {/* Morgenroutine */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Banner – Aktivitäten */}
        <div style={{
          background: '#111',
          padding: '14px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 0',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
          letterSpacing: '0.12em',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          color: '#e8e0d4',
        }}>
          {['Gesangsstunden', 'Stimme trainieren', 'Boundless Movement', 'Coaching Tools üben', 'Seminare vorbereiten'].map((item, i, arr) => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item}
              {i < arr.length - 1 && <span style={{ opacity: 0.4 }}>|</span>}
            </span>
          ))}
        </div>

        {/* Fließtext */}
        <div style={{ padding: '24px 24px 20px' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: '#a78bfa', letterSpacing: '0.08em' }}>MORGENROUTINE · TÄGLICHES FUNDAMENT</div>
          <div className="space-y-3 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <p>
              Jeden Morgen beginnt ein neuer Tag, eine frische Leinwand.
              Kaffee, Musik, Bewegung – gerade genug, um meine Seele aufzuwecken.
              Ich dehne mich, atme und schreibe meine Ziele auf wie Gebete.
              Denn eine Vision für dein Leben zu haben, ist wichtig.
            </p>
            <p>
              Dann geht es ins Fitnessstudio und darum, auf meinen Körper zu achten.
              Ich lerne, dass dein Körper immer mit dir spricht – und echte Selbstfürsorge
              nicht nur aus Ruhetagen besteht. Manchmal ist der größte Akt der Selbstachtung,
              konsequent für sich selbst da zu sein, auch wenn es schwer ist.
            </p>
            <p>
              Nach einer heißen Dusche ziehe ich etwas Bequemes an. Dann esse ich eine einfache Mahlzeit.
              Um jedem Tag mit Sinn zu begegnen. Irgendwo zwischen 13:00 Uhr und dem Büro,
              E-Mails beantworten und alles hinter den Kulissen planen.
            </p>
            <p className="font-medium" style={{ color: 'var(--text)' }}>
              Also, wer auch immer das heute hören muss:<br />
              Glaube einfach daran. Mach weiter.<br />
              Du bist näher dran, als du denkst.
            </p>
          </div>
        </div>
      </div>

      {/* Entwicklungsbereiche */}
      <div className="card">
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text)' }}>Entwicklungsbereiche</h3>
        <div className="text-xs mb-3 flex gap-4" style={{ color: 'var(--text-muted)' }}>
          {STUFEN.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: stufenFarbe(i), display: 'inline-block' }} />
              {i+1} {s}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {BEREICHE.map(b => (
            <div key={b.id}>
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <div className="text-base font-medium" style={{ color: 'var(--text)' }}>{b.label}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{b.beschreibung}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {STUFEN.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setStufen(prev => ({ ...prev, [b.id]: i }))}
                      title={s}
                      style={{
                        width: 28, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 600,
                        background: stufen[b.id] === i ? stufenFarbe(i) : 'var(--bg-input)',
                        color: stufen[b.id] === i ? 'white' : 'var(--text-muted)',
                        border: `1px solid ${stufen[b.id] === i ? stufenFarbe(i) : 'var(--border)'}`,
                        cursor: 'pointer'
                      }}
                    >{i+1}</button>
                  ))}
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--bg-input)', borderRadius: 4, marginTop: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  width: `${(stufen[b.id] / 3) * 100}%`,
                  background: stufenFarbe(stufen[b.id]),
                  transition: 'width 0.3s, background 0.3s'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tagesübung */}
      <div className="card" style={{ borderLeftWidth: 4, borderLeftColor: '#00a89a' }}>
        <h3 className="text-base font-semibold mb-2" style={{ color: '#00a89a' }}>Tagesübung: Steuerpositions-Unterbrechung</h3>
        <div className="space-y-1 text-base" style={{ color: 'var(--text-muted)' }}>
          <div><span style={{ color: '#00a89a' }}>1 · Stopp</span> – bewusste Pause einlegen</div>
          <div><span style={{ color: '#00a89a' }}>2 · Scan</span> – Was spüre ich? Was denke ich? Was will ich?</div>
          <div><span style={{ color: '#00a89a' }}>3 · Wahl</span> – Wie handle ich aus meiner Mitte?</div>
        </div>
      </div>

      {/* Impulse & Sprüche */}
      <div className="space-y-3">
        {SPRUECHE.map((s, i) => (
          <div key={i} className="card" style={{ borderLeftWidth: 4, borderLeftColor: '#a78bfa', background: '#1a1030' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#a78bfa', letterSpacing: '0.08em' }}>IMPULS</div>
            <p className="text-base italic leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
              „{s.text}"
            </p>
            {s.quelle && <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>— {s.quelle}</p>}
          </div>
        ))}
      </div>

      {/* Tagebuch */}
      <div className="card">
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--text)' }}>Mindset-Tagebuch</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={eintrag}
            onChange={e => setEintrag(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEintrag()}
            className="input flex-1"
            placeholder="Erkenntnis, Durchbruch, Beobachtung..."
          />
          <button onClick={addEintrag} className="btn-primary px-4">+</button>
        </div>
        <div className="space-y-3">
          {eintraege.map((e, i) => (
            <div key={i} className="flex gap-3 text-base" style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none', paddingTop: i > 0 ? 12 : 0 }}>
              <span className="text-sm shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{e.datum}</span>
              <span style={{ color: 'var(--text)' }}>{e.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PERSÖNLICHE ENTWICKLUNG ─────────────────────────────────────────────────
const ANKER_URL = 'https://anker.mentaltraining.at'

const KANAELE = [
  { id: 'linkedin',   label: 'LinkedIn',       gruppe: 'Social',      frequenz: '2×/Woche', typ: 'in' },
  { id: 'instagram',  label: 'Instagram',      gruppe: 'Social',      frequenz: '3×/Woche', typ: '◈' },
  { id: 'facebook',   label: 'Facebook',       gruppe: 'Social',      frequenz: '2×/Woche', typ: 'f' },
  { id: 'youtube',    label: 'YouTube',        gruppe: 'Video/Audio', frequenz: '1×/Woche', typ: '▶' },
  { id: 'tiktok',     label: 'TikTok/Reels',   gruppe: 'Video/Audio', frequenz: '2×/Woche', typ: '♪' },
  { id: 'podcast',    label: 'Podcast',        gruppe: 'Video/Audio', frequenz: '1×/Woche', typ: '🎙' },
  { id: 'newsletter', label: 'Newsletter',     gruppe: 'Direkt',      frequenz: '1×/Woche', typ: '✉' },
  { id: 'netzwerk',   label: 'Netzwerk',       gruppe: 'Direkt',      frequenz: '3×/Woche', typ: '↗' },
  { id: 'webseite',   label: 'Webseite',       gruppe: 'Direkt',      frequenz: '1×/Monat', typ: '□' },
  { id: 'eg',         label: 'Einladung EG',   gruppe: 'Direkt',      frequenz: '2×/Woche', typ: '◎' },
]

function ContentErinnerungen() {
  const [letzteAktion, setLetzteAktion] = useState(() => {
    const init = {}
    KANAELE.forEach(k => { init[k.id] = null })
    return init
  })

  const heute = new Date()

  const tageAlt = (datum) => {
    if (!datum) return null
    const diff = Math.floor((heute - new Date(datum)) / (1000 * 60 * 60 * 24))
    return diff
  }

  const ampelFarbe = (kanal, tage) => {
    if (tage === null) return '#4b5563'
    const limit = kanal.frequenz.includes('Monat') ? 28 : kanal.frequenz.startsWith('3') ? 3 : kanal.frequenz.startsWith('2') ? 4 : 8
    if (tage <= limit * 0.5) return '#22c55e'
    if (tage <= limit) return '#fbbf24'
    return '#ef4444'
  }

  const markiereHeute = (id) => {
    setLetzteAktion(prev => ({ ...prev, [id]: heute.toISOString() }))
  }

  const gruppen = [...new Set(KANAELE.map(k => k.gruppe))]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Content-Erinnerungen</h3>
        <a
          href={ANKER_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ fontSize: 13, padding: '0.4rem 1rem', textDecoration: 'none', display: 'inline-block' }}
        >
          ANKER öffnen →
        </a>
      </div>

      <div className="space-y-4">
        {gruppen.map(gruppe => (
          <div key={gruppe}>
            <div className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{gruppe}</div>
            <div className="space-y-2">
              {KANAELE.filter(k => k.gruppe === gruppe).map(kanal => {
                const tage = tageAlt(letzteAktion[kanal.id])
                const farbe = ampelFarbe(kanal, tage)
                return (
                  <div key={kanal.id} className="flex items-center justify-between gap-3" style={{ padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div className="flex items-center gap-3">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: farbe, display: 'inline-block', flexShrink: 0 }} />
                      <div>
                        <span className="text-base font-medium" style={{ color: 'var(--text)' }}>{kanal.label}</span>
                        <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>{kanal.frequenz}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {tage === null ? '–' : tage === 0 ? 'heute' : `vor ${tage}d`}
                      </span>
                      <button
                        onClick={() => markiereHeute(kanal.id)}
                        title="Heute erledigt"
                        style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-card)', color: '#00a89a', border: '1px solid var(--border)', cursor: 'pointer' }}
                      >
                        ✓ heute
                      </button>
                      <a
                        href={ANKER_URL}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'var(--teal-dim)', color: '#00a89a', border: '1px solid #00a89a33', textDecoration: 'none' }}
                      >
                        erstellen →
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>🟢 aktuell</span>
        <span>🟡 bald fällig</span>
        <span>🔴 überfällig</span>
      </div>
    </div>
  )
}

function PersoenlicheEntwicklung() {
  const [notiz, setNotiz] = useState('')
  const [notizen, setNotizen] = useState([
    { datum: '31.05.2026', modul: 'Session 1', text: 'Swish durchgeführt – Ziel-Zustand erarbeitet, Atem frei, Kompetenzgefühl aktiviert' }
  ])

  const addNotiz = () => {
    if (!notiz.trim()) return
    const heute = new Date().toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' })
    setNotizen(n => [{ datum: heute, modul: 'Notiz', text: notiz }, ...n])
    setNotiz('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">Persönliche Entwicklung</h2>
        <p className="text-sm text-gray-500">Dein inneres Betriebssystem – Muster, Ziele, Ressourcen.</p>
      </div>

      {/* Ziel-Zustand */}
      <div className="card" style={{ borderColor: '#2d1f4e' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#a78bfa22', color: '#a78bfa' }}>Ziel-Zustand</span>
          <span className="text-xs text-gray-600">NLP Swish – Mai 2026</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed italic">
          „Ich stehe mitten im Raum, umringt von Frauen die sehnsüchtig auf mich und meine Produkte gewartet haben. Um mich herum wachsame, starke Löwen die mich schützen. Ich spüre tiefe Verbundenheit mit meinem wahren Selbst, bin unerschütterlich sicher über meinen Wert, habe Honorarklarheit."
        </p>
      </div>

      {/* Glaubenssätze & Muster */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Aktive Muster</h3>
        <div className="space-y-3">
          {[
            {
              label: 'Zentraler Glaubenssatz',
              text: '„Ich bin nicht wertvoll genug, dass man freiwillig dafür zahlt"',
              color: '#ef4444',
              hinweis: 'Bereits widerlegt: Honorar wurde bezahlt – Verbindung hat überlebt.'
            },
            {
              label: 'Nervensystem-Muster',
              text: 'Verbundenheit um jeden Preis – Initiative fühlt sich wie Bedrohung der Beziehung an',
              color: '#fb923c',
              hinweis: 'Steuerposition-Arbeit: Verbindung und Eigeninitiative schließen sich nicht aus.'
            },
            {
              label: 'Loyalitätssystem',
              text: '„Wer Geld nimmt für Hilfe ist ein Hausierer" – Ahnen-Regel als Identitätsanker',
              color: '#fbbf24',
              hinweis: 'Aufstellungsarbeit nach Dr. Langlotz läuft.'
            },
            {
              label: 'Erfolgs-Blockade',
              text: 'Sichtbarkeit = Angriffsfläche (reale Erfahrung mit Sabotage durch Psychologin)',
              color: '#60a5fa',
              hinweis: 'Würdigung: Das war echte Erfahrung. Heute: nicht alle sind so.'
            },
          ].map(m => (
            <div key={m.label} style={{ borderLeft: `3px solid ${m.color}33`, paddingLeft: 12 }}>
              <div className="text-xs text-gray-500 mb-0.5">{m.label}</div>
              <div className="text-sm text-gray-300 italic mb-1">{m.text}</div>
              <div className="text-xs" style={{ color: m.color + 'cc' }}>→ {m.hinweis}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ressourcen */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Ressourcen</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            'Aufstellungsarbeit nach Dr. Langlotz',
            'NLP-Kompetenz (Swish, Ankertechnik)',
            'Bereits Honorar erhalten – Verbindung hat überlebt',
            'Tiefe Selbstkenntnis & Fähigkeit zur Ehrlichkeit',
          ].map(r => (
            <div key={r} className="flex items-start gap-2 text-sm text-gray-400">
              <span style={{ color: '#5eead4', marginTop: 2 }}>✓</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content-Erinnerungen */}
      <ContentErinnerungen />

      {/* Entwicklungsnotizen */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Entwicklungsnotizen</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={notiz}
            onChange={e => setNotiz(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addNotiz()}
            className="input flex-1"
            placeholder="Neue Erkenntnis eintragen..."
          />
          <button onClick={addNotiz} className="btn-primary px-4">+</button>
        </div>
        <div className="space-y-2">
          {notizen.map((n, i) => (
            <div key={i} className="flex gap-3 text-sm" style={{ borderTop: i > 0 ? '1px solid #1f2e2e' : 'none', paddingTop: i > 0 ? 8 : 0 }}>
              <span className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{n.datum}</span>
              <span className="text-xs px-2 py-0.5 rounded-full self-start whitespace-nowrap" style={{ background: '#5eead422', color: '#5eead4' }}>{n.modul}</span>
              <span className="text-gray-400">{n.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── KI-ASSISTENT (GESPERRT) ──────────────────────────────────────────────────
function KIAssistent() {
  const mockMessages = [
    { role: 'assistant', text: 'Guten Morgen, Erwin. Womit wollen wir heute arbeiten?' },
    { role: 'user', text: 'Challenge mich zu meinem Stundensatz.' },
    { role: 'assistant', text: 'Du verlangst €90/Stunde. Petra Bock nimmt €400. Gunther Schmidt-Schüler nehmen €250. Was genau schützt du, wenn du bei €90 bleibst?' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">KI-Assistent</h2>
        <p className="text-sm text-gray-500">Dein persönlicher Coach, Sparringspartner und Wissensassistent.</p>
      </div>

      <div className="relative">
        {/* Grayed-out Chat Preview */}
        <div className="card opacity-40 pointer-events-none select-none">
          <div className="space-y-3 mb-4" style={{ minHeight: 220 }}>
            {mockMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="text-sm px-4 py-2 rounded-2xl max-w-xs"
                  style={{
                    background: m.role === 'user' ? '#006f6a' : '#1f2e2e',
                    color: '#e5e7eb'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="input flex-1" style={{ color: '#4b5563' }}>Nachricht eingeben...</div>
            <button className="btn-primary opacity-50" disabled>→</button>
          </div>
        </div>

        {/* Lock Overlay */}
        <div className="locked-overlay">
          <div className="text-4xl mb-4">🔒</div>
          <div className="text-white font-semibold text-lg mb-2">KI-Assistent — noch nicht aktiv</div>
          <div className="text-gray-400 text-sm text-center max-w-xs px-4">
            Dein persönlicher ERWIN OS Assistent ist vorbereitet und wartet auf Aktivierung.
          </div>
          <div className="mt-4 px-4 py-2 rounded-lg text-xs text-center" style={{ background: '#006f6a22', color: '#5eead4', border: '1px solid #006f6a44' }}>
            Aktivierung: Anthropic API Key hinterlegen
          </div>
          <div className="mt-6 space-y-2 text-xs text-gray-600 text-center">
            <div>✓ System-Prompt: bereit</div>
            <div>✓ Coaching-Modell: hinterlegt</div>
            <div>✓ Wissensbase: geladen</div>
            <div>✓ Datenbank: verbunden</div>
          </div>
        </div>
      </div>

      {/* Modi Preview */}
      <div className="card opacity-50">
        <div className="text-xs text-gray-500 mb-3">Verfügbare Modi nach Aktivierung</div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {['COACH', 'TRAINING', 'WISSEN', 'FEEDBACK', 'CHALLENGE', 'ZAHLEN'].map(m => (
            <div key={m} className="text-xs px-3 py-2 rounded-lg text-center" style={{ background: '#1f2e2e', color: '#6b7280' }}>
              {m}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ErwinOS() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [metrics, setMetrics] = useState([])
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadMetrics = async () => {
    const { data } = await supabase
      .from('metrics')
      .select('*')
      .order('month', { ascending: false })
      .limit(12)
    if (data) setMetrics(data)
  }

  useEffect(() => {
    if (session) loadMetrics()
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 15 }}>Laden...</div>
    </div>
  )

  if (!session) return <Login onLogin={() => {}} />

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'Dashboard'   && <Dashboard metrics={metrics} />}
        {activeTab === 'Mindset'     && <MindsetEntwicklung />}
        {activeTab === 'Entwicklung' && <PersoenlicheEntwicklung />}
        {activeTab === 'BWL-Check'   && <BWLCheck metrics={metrics} onSave={loadMetrics} />}
        {activeTab === 'Angebote'    && <Angebote />}
        {activeTab === 'Zielgruppen' && <Zielgruppen />}
        {activeTab === 'KI-Assistent'&& <KIAssistent />}
      </main>
    </div>
  )
}
