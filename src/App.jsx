import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { config as c } from './config'

const ease = [0.22, 1, 0.36, 1]
const POS = ['12% 18%', '68% 12%', '40% 58%', '78% 88%']

function Envelope({ onDone }) {
  const [s, setS] = useState('closed')
  const open = () => {
    if (s !== 'closed') return
    setS('open'); setTimeout(() => setS('drop'), 2000); setTimeout(onDone, 3400)
  }
  const o = s !== 'closed'
  return (
    <div className="env" role="button" tabIndex={0} aria-label="Open invitation" onClick={open} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && open()}>
      <motion.div className="env-all" animate={{ y: s === 'drop' ? '105%' : 0 }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}>
        <div className="bw"><div className="paper body" /></div>
        <svg className="creases" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden><path d="M0 100L50 58L100 100" /><path className="hi" d="M0 100L50 58L100 100" transform="translate(0 .4)" /><path className="hi" d="M0 .3L50 58.3L100 .3" /></svg>
        <motion.div className="shadow" animate={{ opacity: o ? 0 : 1 }} transition={{ duration: .5, delay: .35 }}><i /></motion.div>
        <motion.div className="flap" animate={{ rotateX: o ? -180 : 0 }} transition={{ duration: 1.15, ease, delay: .4 }}>
          <div className="paper fl-front" />
          <svg className="creases fl-edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden><path d="M0 0L50 58L100 0" /><path className="hi" d="M0 0L50 58L100 0" transform="translate(0 .4)" /></svg>
          <motion.div className="seal" animate={o ? { scale: [1, 1.12, .92] } : { scale: [1, 1.04, 1] }} transition={o ? { duration: .45 } : { duration: 3, repeat: Infinity }}>
            <img className="wax" src="/photos/seal.png" alt="" draggable="false" />
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.p className="hint" animate={{ opacity: o ? 0 : 1 }}>Tap to open</motion.p>
    </div>
  )
}

function Petals({ count = 10 }) {
  return <div className="petals" aria-hidden>{Array.from({ length: count }, (_, i) => (
    <span key={i} style={{ left: `${(i * 97) % 100}%`, animationDelay: `${-i * 1.7}s`, animationDuration: `${12 + (i % 5) * 2}s`, transform: `scale(${0.6 + (i % 4) * 0.2})` }} />
  ))}</div>
}

function Reveal({ children, delay = 0 }) {
  return <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-12% 0px' }} transition={{ duration: 1, ease, delay }}>{children}</motion.div>
}

function Countdown() {
  const [t, setT] = useState(() => calc())
  function calc() { const d = Math.max(0, new Date(c.dateISO) - new Date()); return [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60] }
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [])
  return <div className="count">{['days', 'hours', 'minutes', 'seconds'].map((l, i) => (
    <div key={l}><b>{String(t[i]).padStart(2, '0')}</b><span>{l}</span></div>))}</div>
}

function Rsvp() {
  const [f, setF] = useState({ name: '', attending: '', addons: 0, addonNames: [], notes: '' })
  const [state, setState] = useState('idle')
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))
  const setAddons = n => setF(p => ({ ...p, addons: n, addonNames: Array.from({ length: n }, (_, i) => p.addonNames[i] || '') }))
  async function submit(e) {
    e.preventDefault(); setState('sending')
    try {
      if (c.rsvpEndpoint) await fetch(c.rsvpEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ ...f, addonNames: f.addonNames.join(', ') }) })
      else await new Promise(r => setTimeout(r, 700))
      setState('done')
    } catch { setState('error') }
  }
  if (state === 'done') return <motion.p className="thanks" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>Thank you, {f.name.split(' ')[0]}. Your reply has been received.</motion.p>
  const yes = f.attending === 'yes'
  return (
    <form className="rsvp" onSubmit={submit}>
      <label>Full name<input required placeholder="Full name" value={f.name} onChange={e => set('name', e.target.value)} /></label>
      <div className="radios"><p>Will you be joining us?</p>{[['yes', 'Yes, we will be there'], ['no', 'Sadly, we cannot attend']].map(([v, l]) => <label key={v} className="rad"><input type="radio" name="att" required checked={f.attending === v} onChange={() => set('attending', v)} /><span>{l}</span></label>)}</div>
      <AnimatePresence>{yes && (
        <motion.div className="more" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .6, ease }}>
          <label>Number of guests
            <select value={f.addons} onChange={e => setAddons(+e.target.value)}>{[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n === 0 ? 'Just me' : `+${n}`}</option>)}</select></label>
          {f.addonNames.map((n, i) => <label key={i}>Guest {i + 1} name<input required value={n} onChange={e => setF(p => ({ ...p, addonNames: p.addonNames.map((x, j) => j === i ? e.target.value : x) }))} /></label>)}
          <label>Dietary restrictions<textarea rows="2" value={f.notes} onChange={e => set('notes', e.target.value)} placeholder="Allergies or restrictions" /></label>
        </motion.div>)}</AnimatePresence>
      <button className="btn" disabled={!f.attending || state === 'sending'}>{state === 'sending' ? 'Sending' : 'Submit'}</button>
      {state === 'error' && <p className="err">Something went wrong. Please try again.</p>}
    </form>
  )
}

const Sparkles = () => <div className="sparkles" aria-hidden>{Array.from({ length: 24 }, (_, i) => <span key={i} style={{ left: `${(i * 41) % 100}%`, animationDelay: `${-i * 1.3}s`, animationDuration: `${9 + (i % 6) * 2}s`, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2 }} />)}</div>


const Orn = ({ cls = '' }) => <div className={`orn ${cls}`} aria-hidden><i className="sd l" /><img src="/photos/orn.png" alt="" /><i className="sd r" /></div>
const I = {
  Ceremony: <><circle cx="9" cy="15" r="5" /><circle cx="17" cy="15" r="5" /><path d="M7 7l2-3 2 3-2 2z" /></>,
  Pictures: <><rect x="3" y="8" width="20" height="14" rx="2" /><circle cx="13" cy="15" r="4" /><path d="M9 8l1.5-3h5L17 8" /></>,
  Reception: <><path d="M3 21h20M5 21a8 8 0 0116 0M13 9V7" /><circle cx="13" cy="6" r="1" /></>,
  'Cake & Toast': <><rect x="5" y="15" width="16" height="6" /><rect x="8" y="10" width="10" height="5" /><path d="M13 10V6M13 4v1" /></>,
  Dancing: <><path d="M10 19V6l10-2v13" /><circle cx="8" cy="19" r="2.5" /><circle cx="18" cy="17" r="2.5" /></>
}
function Frame({ children, className = '', corners = ['tl', 'tr', 'bl', 'br'] }) {
  return (
    <section className={`fr ${className}`}>
      <span className="line" /><Orn cls="fo" />
      <div className="cns">{corners.map(k => <img key={k} className={`cn ${k}`} src={`/photos/c-${k}.jpg`} alt="" aria-hidden />)}<img className="cn mid ml" src="/photos/c-tr.jpg" alt="" aria-hidden /><img className="cn mid mr" src="/photos/c-tl.jpg" alt="" aria-hidden /></div>
      <div className="fr-in">{children}</div>
    </section>
  )
}
const Head = ({ big, children, sub }) => <><h2 className={`t ${big ? 'big' : ''}`}>{children}</h2><Orn />{sub && <p className="sub">{sub}</p>}</>

export default function App() {
  const [opened, setOpened] = useState(false)
  useEffect(() => { document.body.style.overflow = opened ? '' : 'hidden' }, [opened])
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(c.address)}`
  const replay = () => { window.scrollTo(0, 0); setOpened(false) }
  return (
    <>
      {!opened && <Envelope onDone={() => setOpened(true)} />}
      <main>
        <Frame className="story">
          <Sparkles /><Petals count={8} />
          <Reveal><Head sub="Two hearts, one journey">Our Story</Head></Reveal>
          <div className="steps">{c.story.map((p, i) => (
            <motion.div key={i} className="step" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8% 0px' }} transition={{ duration: 1, ease, delay: (i % 2) * .15 }}>
              <div className="arch" style={{ backgroundImage: `url(${c.photos[i] || '/photos/gardenia.jpg'})`, backgroundPosition: c.photos[i] ? 'center' : POS[i] }} />
              <i className="mark" />
              <p>{p}</p>
            </motion.div>))}
          </div>
        </Frame>
        <Frame className="inv">
          <Reveal>
            <p className="caps tc">The wedding of</p>
            <h2 className="names">{c.groom} <em>&amp;</em> {c.bride}</h2>
            <p className="caps sm tc">Request the pleasure of your company</p>
            <hr className="rule" />
            <div className="cols">
              <div><p className="caps">{c.day}</p><p className="big">{c.dateText}</p><p className="caps xs">{c.timeWords}</p></div>
              <div><a className="locA" href={dir} target="_blank" rel="noreferrer"><p className="big">The Location</p><p className="loc">{c.city}</p></a></div>
            </div>
            <Countdown />
          </Reveal>
        </Frame>
        <Frame className="sch" corners={['tl', 'br']}>
          <Reveal><Head sub="Join us for a day of celebration!">Schedule</Head></Reveal>
          <ol className="tl2">{c.program.map((p, i) => (
            <motion.li key={p.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .9, ease, delay: i * .08 }}>
              <i className="ic"><svg viewBox="0 0 26 26">{I[p.n]}</svg></i><div><b>{p.n}</b><em>{p.t}</em></div>
            </motion.li>))}
          </ol>
        </Frame>
        <Frame className="rsvp-f">
          <Reveal><Head sub={`Kindly reply by ${c.rsvpBy}`}>RSVP</Head><div className="box"><Rsvp /></div></Reveal>
        </Frame>
        <Frame className="ty" corners={['tl', 'br']}>
          <Sparkles />
          <Reveal>
            <Head>Thank You</Head>
            <p className="msg">Thank you for being a part of our special day.<br />Your love and support mean the world to us.</p>
            <p className="msg">We are so grateful to share this<br />joyous occasion with you.</p>
            <Orn />
            <p className="script">With love,</p>
            <p className="caps tc">{c.groom} &amp; {c.bride}</p>
            <p className="tc"><button className="link" onClick={replay}>Back to envelope</button></p>
          </Reveal>
        </Frame>
      </main>
    </>
  )
}
