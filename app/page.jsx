'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TABS = ['Dashboard', 'BWL-Check', 'Angebote', 'Zielgruppen', 'KI-Assistent']
const GOAL = 3000

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header({ activeTab, setActiveTab }) {
  return (
    <header style={{ background: '#0d1a1a', borderBottom: '1px solid #1f2e2e' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img
              src="https://masterclass.mentaltraining.at/wp-content/uploads/2026/02/cropped-mental-270x270.jpeg"
              alt="Mental Training Logo"
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
            />
            <div>
              <span className="text-xl font-bold" style={{ color: '#5eead4' }}>ERWIN OS</span>
              <span className="ml-2 text-xs text-gray-500">mentaltraining.at</span>
            </div>
          </div>
          <div className="text-xs text-gray-600">Erwin Adelmann</div>
        </div>
        <nav className="flex gap-1 overflow-x-auto pb-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'tab-active font-medium'
                  : 'text-gray-500 hover:text-gray-300'
              } ${tab === 'KI-Assistent' ? 'opacity-50' : ''}`}
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

  const loadMetrics = async () => {
    const { data } = await supabase
      .from('metrics')
      .select('*')
      .order('month', { ascending: false })
      .limit(12)
    if (data) setMetrics(data)
  }

  useEffect(() => { loadMetrics() }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0f' }}>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'Dashboard'    && <Dashboard metrics={metrics} />}
        {activeTab === 'BWL-Check'   && <BWLCheck metrics={metrics} onSave={loadMetrics} />}
        {activeTab === 'Angebote'    && <Angebote />}
        {activeTab === 'Zielgruppen' && <Zielgruppen />}
        {activeTab === 'KI-Assistent'&& <KIAssistent />}
      </main>
    </div>
  )
}
