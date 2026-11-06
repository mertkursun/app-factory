const { CompositionStage, useComposition, Easing, animate, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;

const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };

const THEMES = {
  light: { bg: 'linear-gradient(165deg,#1CB9A7 0%,#0F8E83 45%,#0A5B55 100%)', ring: '#FFFFFF', leaf: '#9BF0E3', vein: '#0B6E66', ok: '#6EE7A8', wa: '#FBD36A', no: '#FF8A8A', tile: 'rgba(255,255,255,.14)', tileBd: 'rgba(255,255,255,.28)', glow: 'rgba(94,234,212,.38)', line: 'rgba(255,255,255,.12)', title: '#FFFFFF', tag: 'rgba(255,255,255,.72)' },
  dark:  { bg: 'radial-gradient(120% 70% at 50% 0%,#17403A 0%,#0A1514 65%)', ring: '#5EEAD4', leaf: '#2DD4BF', vein: '#0A1514', ok: '#3BD98A', wa: '#F5C242', no: '#F36B6B', tile: 'rgba(45,212,191,.08)', tileBd: 'rgba(94,234,212,.22)', glow: 'rgba(45,212,191,.28)', line: 'rgba(94,234,212,.12)', title: '#F1F5F3', tag: 'rgba(241,245,243,.66)' },
};

const RING_LEN = 2 * Math.PI * 31;
const HANDLE_LEN = Math.hypot(25, 25);

function Piece({ theme }) {
  const { T, CUES, authoredTotal } = useComposition();
  const C = THEMES[theme] || THEMES.light;
  const a = (from, to, start, end, ease) => animate({ from, to, start, end, ease })(T);

  // Halka: tile pops, ring + handle draw
  const tileO = a(0, 1, CUES.Halka, CUES.Halka + 0.35, MOTION.enter);
  const tileS = a(0.7, 1, CUES.Halka, CUES.Halka + 0.7, MOTION.pop);
  const ringP = a(0, 1, CUES.Halka + 0.15, CUES.Halka + 0.95, MOTION.draw);
  const handleP = a(0, 1, CUES.Halka + 0.75, CUES.Yaprak + 0.15, MOTION.draw);
  // Yaprak: leaf grows from its stem, vein draws
  const leafS = a(0, 1, CUES.Yaprak + 0.05, CUES.Yaprak + 0.65, MOTION.pop);
  const veinP = a(0, 1, CUES.Yaprak + 0.35, CUES.Yaprak + 0.75, MOTION.draw);
  // Noktalar: three dots drop in, staggered
  const dots = [[37, 61, C.ok], [50, 65, C.wa], [63, 61, C.no]].map(([x, y, fill], i) => {
    const s = CUES.Noktalar + i * 0.14;
    return { x, y, fill, dy: a(-34, 0, s, s + 0.5, MOTION.pop), o: a(0, 1, s, s + 0.15, MOTION.enter), sq: a(1.25, 1, s + 0.3, s + 0.55, MOTION.enter) };
  });
  // Isim: title + tagline rise
  const titleY = a(28, 0, CUES.Isim, CUES.Isim + 0.7, MOTION.enter);
  const titleO = a(0, 1, CUES.Isim, CUES.Isim + 0.5, MOTION.enter);
  const tagY = a(20, 0, CUES.Isim + 0.2, CUES.Isim + 0.9, MOTION.enter);
  const tagO = a(0, 1, CUES.Isim + 0.2, CUES.Isim + 0.7, MOTION.enter);
  // Ambient: rings expand, glow breathes, whole piece drifts up slightly
  const ringsS = a(0.86, 1, 0, 1.6, MOTION.enter);
  const ringsO = a(0, 1, 0, 0.8, MOTION.enter);
  const breathe = 1 + 0.06 * Math.sin(T * 1.7);
  const drift = a(0, -26, CUES.Isim, authoredTotal, MOTION.enter);
  // Cikis: fade to background (loop seam = first frame)
  const out = a(1, 0, CUES.Cikis, CUES.Cikis + 0.55, MOTION.enter);

  const dash = (len, p) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - p) });

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ position: 'absolute', inset: 0, opacity: out }}>
        <div style={{ position: 'absolute', left: 540, top: 960, width: 1400, height: 1400, marginLeft: -700, marginTop: -700, borderRadius: '50%', border: `3px solid ${C.line}`, transform: `scale(${ringsS})`, opacity: ringsO }} />
        <div style={{ position: 'absolute', left: 540, top: 960, width: 1000, height: 1000, marginLeft: -500, marginTop: -500, borderRadius: '50%', border: `3px solid ${C.line}`, transform: `scale(${ringsS * 0.98})`, opacity: ringsO }} />
        <div style={{ position: 'absolute', left: 540, top: 880, width: 900, height: 900, marginLeft: -450, marginTop: -450, borderRadius: '50%', background: `radial-gradient(circle, ${C.glow}, transparent 68%)`, transform: `scale(${breathe})`, opacity: tileO }} />

        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${drift}px)` }}>
          <div style={{ position: 'absolute', left: 540, top: 860, width: 445, height: 445, marginLeft: -222, marginTop: -222, borderRadius: 128, background: C.tile, border: `3px solid ${C.tileBd}`, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: '0 80px 160px -60px rgba(0,0,0,.45), inset 0 3px 0 rgba(255,255,255,.35)', transform: `scale(${tileS})`, opacity: tileO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="290" height="290" viewBox="0 0 120 120" fill="none" style={{ overflow: 'visible' }}>
              <circle cx="50" cy="50" r="26" fill={C.ring} opacity={0.12 * ringP} />
              <circle cx="50" cy="50" r="31" stroke={C.ring} strokeWidth="10" strokeLinecap="round" transform="rotate(-90 50 50)" style={dash(RING_LEN, ringP)} />
              <path d="M74 74 L99 99" stroke={C.ring} strokeWidth="13" strokeLinecap="round" opacity={handleP > 0.01 ? 1 : 0} style={dash(HANDLE_LEN, handleP)} />
              <g transform={`translate(44 52) scale(${leafS}) translate(-44 -52)`}>
                <path d="M50 26 C63 30 69 43 64 55 C53 57 41 50 41 37 C43 31 46 27 50 26 Z" fill={C.leaf} />
                <path d="M46 50 C52 44 58 38 62 32" stroke={C.vein} strokeWidth="2.5" strokeLinecap="round" style={dash(22, veinP)} />
              </g>
              {dots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="4.5" fill={d.fill} opacity={d.o} transform={`translate(0 ${d.dy}) translate(${d.x} ${d.y}) scale(1 ${d.sq}) translate(${-d.x} ${-d.y})`} />
              ))}
            </svg>
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', transform: `translateY(${titleY}px)`, opacity: titleO, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 104, lineHeight: 1.05, letterSpacing: -3, color: C.title }}>İçinde Ne Var?</div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center', transform: `translateY(${tagY}px)`, opacity: tagO, fontWeight: 600, fontSize: 42, letterSpacing: 1, color: C.tag }}>Ne aldığını bil, ne yediğini seç.</div>
        </div>
      </div>
    </div>
  );
}

function SplashAnimApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <CompositionStage width={1080} height={1920} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#0A1514">
        <Piece theme={t.theme} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Splash" />
        <TweakRadio label="Tema" value={t.theme} options={['light', 'dark']} onChange={(v) => setTweak('theme', v)} />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}
window.SplashAnimApp = SplashAnimApp;
