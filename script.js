<script>
/* ═══ UTILS ═══ */
function onVis(el, cb, thresh = 0.2) {
  new IntersectionObserver((ents, o) => {
    ents.forEach(e => { if (e.isIntersecting) { cb(); o.disconnect(); } });
  }, { threshold: thresh }).observe(el);
}

/* ═══ MUSIC ═══ */
const musicBtn = document.getElementById('music-btn');
const bgMusic  = document.getElementById('bg-music');
let musicOn = false;
musicBtn.onclick = () => {
  musicOn = !musicOn;
  if (musicOn) { bgMusic.volume = 0.25; bgMusic.play().catch(() => {}); musicBtn.textContent = '🔊'; }
  else { bgMusic.pause(); musicBtn.textContent = '🎵'; }
};

/* ═══ HEARTS ═══ */
const HEARTS = ['❤️','🌸','💕','💗','✨','🌺','💖','🩷','🌼'];
const hw = document.getElementById('hearts-wrap');
function spawnHeart() {
  const el = document.createElement('span');
  el.className = 'heart';
  el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  el.style.cssText = `left:${Math.random()*100}%;font-size:${.9+Math.random()*1.2}rem;animation-duration:${8+Math.random()*10}s;animation-delay:${Math.random()*3}s`;
  hw.appendChild(el);
  setTimeout(() => el.remove(), 22000);
}
setInterval(spawnHeart, 800);
for (let i = 0; i < 10; i++) spawnHeart();

/* ═══ LETTER DATE ═══ */
document.getElementById('letter-date').textContent =
  new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

/* ═══ LETTER ANIMATION ═══ */
const LETTER_TEXT = `Every morning you woke before dawn to make sure I had a warm breakfast. Every night you waited by the window until I was home safe.

You wiped my tears when I failed, and you cheered louder than anyone when I succeeded. You never asked for credit — you simply loved me with a quiet, unshakeable devotion.

I have traveled far, grown much, and met many extraordinary people — but no one has ever loved me the way you do. No one ever will.

Today is not enough to honor everything you are. But today, I want you to know: every good thing in me is a reflection of you.

I love you more than words can hold.`;

let letterDone = false;
onVis(document.getElementById('paper-env'), () => {
  document.getElementById('lbl-letter').classList.add('show');
  setTimeout(() => document.getElementById('ttl-letter').classList.add('show'), 200);
  setTimeout(() => {
    document.getElementById('paper-env').classList.add('open');
    if (!letterDone) { letterDone = true; typewriterStart(); }
  }, 500);
});

function typewriterStart() {
  const body = document.getElementById('letter-body');
  const sign = document.getElementById('letter-sign');
  body.innerHTML = '<span class="cursor-blink"></span>';
  let i = 0;
  const iv = setInterval(() => {
    if (i < LETTER_TEXT.length) {
      const cur = body.querySelector('.cursor-blink');
      body.insertBefore(document.createTextNode(LETTER_TEXT[i++]), cur);
    } else {
      clearInterval(iv);
      body.querySelector('.cursor-blink').remove();
      sign.style.opacity = '1';
    }
  }, 22);
}

/* ═══ GALLERY ═══ */
const MEMORIES = [
  { e:'👶', l:'First Steps',       c:'You held my hand for my very first steps' },
  { e:'🍳', l:'Sunday Breakfast',  c:'Your magical Sunday mornings in the kitchen' },
  { e:'📚', l:'Story Time',        c:'Bedtime stories that sparked my imagination' },
  { e:'🎂', l:'Birthday Magic',    c:"Every birthday you made feel like a fairy tale" },
  { e:'🌸', l:'Garden Days',       c:'Tending our little garden every spring together' },
  { e:'🤗', l:'Warm Hugs',         c:'Your hugs that could fix everything — always' },
  { e:'🌙', l:'Late Night Talks',  c:'Long talks under the stars on the porch' },
  { e:'✈️', l:'First Adventure',   c:'The trip you planned just to make me smile' },
];
const grid = document.getElementById('gallery-grid');
MEMORIES.forEach(m => {
  const d = document.createElement('div');
  d.className = 'polaroid';
  d.innerHTML = `<div class="pol-tape"></div>
    <div class="pol-img"><span class="pol-emoji">${m.e}</span><span class="pol-label">${m.l}</span></div>
    <p class="pol-caption">${m.c}</p>`;
  grid.appendChild(d);
});
onVis(grid, () => {
  document.getElementById('lbl-gallery').classList.add('show');
  setTimeout(() => document.getElementById('ttl-gallery').classList.add('show'), 200);
  document.querySelectorAll('.polaroid').forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.34,1.56,.64,1)';
      el.style.opacity = '1';
    }, i * 90);
  });
}, 0.1);

/* ═══ CAKE CUTTING ═══ */
const cakeWrap    = document.getElementById('cake-wrap');
const knifeSvg    = document.getElementById('knife-svg');
const cutBeam     = document.getElementById('cut-beam');
const svgCutLine  = document.getElementById('svg-cut-line');
const cutMsgEl    = document.getElementById('cut-msg');
const flames      = document.querySelectorAll('.fl');

let cutting = false, cakeCut = false, cutPct = 0;
const TOP_Y = 0.18, BOT_Y = 0.97, CENTER_X = 0.5;

onVis(document.getElementById('cake'), () => {
  document.getElementById('cake-ttl').classList.add('show');
  document.getElementById('cake-hint').classList.add('show');
  cutMsgEl.style.opacity = '1';
});

function relY(e) {
  const r = cakeWrap.getBoundingClientRect();
  return ((e.touches ? e.touches[0].clientY : e.clientY) - r.top) / r.height;
}
function relX(e) {
  const r = cakeWrap.getBoundingClientRect();
  return ((e.touches ? e.touches[0].clientX : e.clientX) - r.left) / r.width;
}

function startCut(e) {
  if (cakeCut) return;
  if (Math.abs(relX(e) - CENTER_X) > 0.35) return;
  cutting = true;
  knifeSvg.style.display = 'block';
  moveKnife(e);
}

function doCut(e) {
  if (!cutting || cakeCut) return;
  e.preventDefault();
  moveKnife(e);

  const ry = relY(e);
  cutPct = Math.min(1, Math.max(0, (ry - TOP_Y) / (BOT_Y - TOP_Y)));

  // Beam
  const h = cakeWrap.getBoundingClientRect().height;
  cutBeam.style.height = `${cutPct * h * BOT_Y}px`;

  // SVG cut line
  svgCutLine.setAttribute('y2', String(cutPct * 440));

  // Message
  const p = Math.round(cutPct * 100);
  cutMsgEl.textContent = p < 25 ? '🔪 Start cutting...' : p < 55 ? '✂️ Keep going!' : p < 88 ? '🎊 Almost there!' : '💖 So close!';

  if (cutPct >= 0.97) finishCut();
}

function moveKnife(e) {
  const ry = relY(e);
  const h  = cakeWrap.getBoundingClientRect().height;
  knifeSvg.style.top  = `${ry * h - 35}px`;
  knifeSvg.style.left = 'calc(50% - 22px)';
}

function finishCut() {
  if (cakeCut) return;
  cakeCut = cutting = false;
  cutMsgEl.textContent = '';
  knifeSvg.style.display = 'none';

  blowCandles();
  setTimeout(splitCake, 300);
  setTimeout(launchConfetti, 500);
  setTimeout(showCelMsg, 900);
  setTimeout(playJingle, 600);
}

function blowCandles() {
  flames.forEach((f, i) => setTimeout(() => {
    f.style.transition = 'opacity .4s, transform .4s';
    f.style.opacity = '0'; f.style.transform = 'scale(0) translateY(-12px)';
  }, i * 140));
}

function splitCake() {
  const svg = document.getElementById('cake-svg');
  const defs = svg.querySelector('defs');
  function mkClip(id, x, w) {
    const cp = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
    cp.id = id;
    const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
    r.setAttribute('x', x); r.setAttribute('y','-20');
    r.setAttribute('width', w); r.setAttribute('height','480');
    cp.appendChild(r); defs.appendChild(cp);
  }
  mkClip('clipL', '-60', '275');
  mkClip('clipR', '215', '280');

  const kids = Array.from(svg.children).filter(c => c.tagName !== 'defs');
  const lg = document.createElementNS('http://www.w3.org/2000/svg','g');
  const rg = document.createElementNS('http://www.w3.org/2000/svg','g');
  lg.setAttribute('clip-path','url(#clipL)');
  rg.setAttribute('clip-path','url(#clipR)');
  kids.forEach(k => { lg.appendChild(k); rg.appendChild(k.cloneNode(true)); });
  svg.appendChild(lg); svg.appendChild(rg);

  let t = 0;
  const iv = setInterval(() => {
    t += 2.5;
    lg.setAttribute('transform', `translate(-${t},${t*.08})`);
    rg.setAttribute('transform', `translate(${t},${t*.08})`);
    if (t >= 45) clearInterval(iv);
  }, 16);
}

function launchConfetti() {
  const C = ['#f9a8c9','#d4a853','#fff0f5','#e8799a','#f0d080','#c48b9f','#a8d8ea','#ffd6e8'];
  for (let i = 0; i < 140; i++) {
    const p = document.createElement('div');
    p.className = 'cf';
    const s = 6 + Math.random() * 11;
    p.style.cssText = `width:${s}px;height:${s}px;background:${C[Math.floor(Math.random()*C.length)]};left:${Math.random()*100}vw;top:${10+Math.random()*25}vh;border-radius:${Math.random()>.5?'50%':'3px'};animation-duration:${2.2+Math.random()*3}s;animation-delay:${Math.random()*1.8}s`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 7000);
  }
}

function showCelMsg() {
  const el = document.getElementById('cel-msg');
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 4500);
}

function playJingle() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t = ctx.currentTime + i * 0.16;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + .05);
      g.gain.exponentialRampToValueAtTime(.001, t + .45);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + .5);
    });
  } catch(e) {}
}

cakeWrap.addEventListener('mousedown',  startCut, { passive: true });
window.addEventListener ('mousemove',  doCut);
window.addEventListener ('mouseup',    () => { cutting = false; });
cakeWrap.addEventListener('touchstart', startCut, { passive: false });
cakeWrap.addEventListener('touchmove',  doCut,    { passive: false });
cakeWrap.addEventListener('touchend',   () => { cutting = false; });

/* ═══ THANK YOU STARS ═══ */
const sc  = document.getElementById('star-canvas');
const sctx = sc.getContext('2d');
const stars = [];
let starsInit = false;

function initStars() {
  const sec = document.getElementById('thankyou');
  sc.width  = window.innerWidth;
  sc.height = sec.offsetHeight;
  stars.length = 0;
  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * sc.width, y: Math.random() * sc.height * .55,
      r: .4 + Math.random() * 1.6, ph: Math.random() * Math.PI * 2,
      sp: .018 + Math.random() * .032
    });
  }
  (function tick() {
    sctx.clearRect(0, 0, sc.width, sc.height);
    stars.forEach(s => {
      s.ph += s.sp;
      const a = .15 + .85 * (.5 + .5 * Math.sin(s.ph));
      sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      sctx.fillStyle = `rgba(255,218,230,${a})`; sctx.fill();
    });
    requestAnimationFrame(tick);
  })();
}

function buildOrbits() {
  const ow = document.getElementById('orbit-wrap');
  ['💕','✨','🌸','💖','⭐','🌺','💗','✦'].forEach((h, i) => {
    const el = document.createElement('span');
    el.className = 'orb-heart';
    el.textContent = h;
    el.style.cssText = `font-size:${.85+Math.random()*.6}rem;animation-duration:${9+i*1.6}s;animation-delay:${-i*1.6}s`;
    ow.appendChild(el);
  });
}

onVis(document.getElementById('thankyou'), () => {
  if (!starsInit) { starsInit = true; initStars(); buildOrbits(); }
  ['ty-heart','ty-title','ty-msg','ty-glass','ty-footer'].forEach((id, i) => {
    setTimeout(() => document.getElementById(id).classList.add('show'), i * 280);
  });
}, 0.12);

window.addEventListener('resize', () => {
  if (starsInit) {
    sc.width = window.innerWidth;
    sc.height = document.getElementById('thankyou').offsetHeight;
  }
});

/* ═══════════════════════════════════════
   SCRATCH CARD
═══════════════════════════════════════ */
(function() {
  const SCRATCH_MESSAGES = [
    'Start scratching… 🪙',
    'Keep going… almost peeking! ✨',
    'The secret is nearly yours… 🌸',
    'Just a little more… 💕',
    'Almost there, Maa! 🎉',
  ];
  const SPARKLES = ['✨','💖','🌸','⭐','💛','🌺','💝','🌼'];

  const cardWrap    = document.getElementById('sc-card-wrap');
  const canvas      = document.getElementById('sc-canvas');
  const ctx         = canvas.getContext('2d');
  const progressBar = document.getElementById('sc-progress-fill');
  const progressLbl = document.getElementById('sc-progress-label');
  const progWrap    = document.getElementById('sc-progress-wrap');
  const doneBadge   = document.getElementById('sc-done-badge');
  const revealEl    = document.getElementById('sc-reveal');

  let scratching = false;
  let revealed   = false;
  let scInited   = false;
  let lastX = 0, lastY = 0;
  let scratchedPixels = 0;
  let totalPixels = 1;

  /* ── Init canvas when section is visible ── */
  onVis(document.getElementById('scratch'), () => {
    document.getElementById('lbl-scratch').classList.add('show');
    setTimeout(() => document.getElementById('ttl-scratch').classList.add('show'), 200);
    setTimeout(() => document.getElementById('scratch-sub').classList.add('show'), 380);
    setTimeout(() => {
      progWrap.classList.add('show');
      if (!scInited) { scInited = true; initScratch(); }
    }, 600);
  }, 0.2);

  function initScratch() {
    /* Size canvas to match the card */
    const rect = revealEl.getBoundingClientRect();
    const W = cardWrap.offsetWidth;
    const H = cardWrap.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    totalPixels = W * H;

    /* Draw the golden foil */
    drawGoldFoil(W, H);

    /* Stamp decorative text on top of foil */
    stampFoilText(W, H);
  }

  function drawGoldFoil(W, H) {
    /* Rich multi-layer gold gradient */
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0.00, '#c9943a');
    grad.addColorStop(0.15, '#e8c060');
    grad.addColorStop(0.30, '#d4a853');
    grad.addColorStop(0.45, '#f5d878');
    grad.addColorStop(0.55, '#d4a853');
    grad.addColorStop(0.70, '#c08030');
    grad.addColorStop(0.85, '#e8c060');
    grad.addColorStop(1.00, '#b87820');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* Diagonal shimmer streaks */
    for (let i = 0; i < 18; i++) {
      const x = (W / 17) * i;
      const streak = ctx.createLinearGradient(x - 30, 0, x + 30, H);
      streak.addColorStop(0,   'rgba(255,255,220,0)');
      streak.addColorStop(0.4, 'rgba(255,255,200,0.18)');
      streak.addColorStop(0.5, 'rgba(255,255,220,0.32)');
      streak.addColorStop(0.6, 'rgba(255,255,200,0.18)');
      streak.addColorStop(1,   'rgba(255,255,220,0)');
      ctx.fillStyle = streak;
      ctx.fillRect(0, 0, W, H);
    }

    /* Horizontal highlight bands */
    for (let i = 0; i < 5; i++) {
      const y = (H / 4) * i;
      const band = ctx.createLinearGradient(0, y, 0, y + H / 5);
      band.addColorStop(0,   'rgba(255,240,160,0)');
      band.addColorStop(0.5, 'rgba(255,240,160,0.12)');
      band.addColorStop(1,   'rgba(255,240,160,0)');
      ctx.fillStyle = band;
      ctx.fillRect(0, y, W, H / 5);
    }

    /* Subtle noise texture via tiny dots */
    for (let i = 0; i < 1800; i++) {
      const tx = Math.random() * W;
      const ty = Math.random() * H;
      const alpha = Math.random() * 0.06;
      ctx.fillStyle = `rgba(${Math.random()>0.5?255:100},${Math.random()>0.5?220:140},0,${alpha})`;
      ctx.fillRect(tx, ty, 1.5, 1.5);
    }
  }

  function stampFoilText(W, H) {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#7a4800';
    ctx.font = `bold ${Math.round(W * 0.055)}px 'Playfair Display', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ Scratch Here ✦', W / 2, H / 2 - 18);
    ctx.font = `italic ${Math.round(W * 0.038)}px 'Dancing Script', cursive`;
    ctx.fillText('A secret message awaits…', W / 2, H / 2 + 26);

    /* Corner flourishes */
    ctx.font = `${Math.round(W * 0.065)}px serif`;
    ctx.globalAlpha = 0.18;
    ctx.fillText('🌸', W * 0.12, H * 0.14);
    ctx.fillText('🌸', W * 0.88, H * 0.14);
    ctx.fillText('🌸', W * 0.12, H * 0.86);
    ctx.fillText('🌸', W * 0.88, H * 0.86);
    ctx.restore();

    /* Embossed border ring */
    ctx.save();
    ctx.strokeStyle = 'rgba(180,120,20,0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, W - 20, H - 20);
    ctx.strokeStyle = 'rgba(255,240,160,0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, W - 36, H - 36);
    ctx.restore();
  }

  /* ── Scratch logic ── */
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width  / rect.width),
      y: (src.clientY - rect.top)  * (canvas.height / rect.height)
    };
  }

  function scratchAt(x, y, fromX, fromY) {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    /* Smooth line between last and current point */
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(x, y);
    ctx.lineWidth  = 52;
    ctx.lineCap    = 'round';
    ctx.lineJoin   = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.stroke();

    /* Extra circle at tip for fuller feel */
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    updateProgress();
  }

  function updateProgress() {
    if (revealed) return;
    /* Sample every 4th pixel for performance */
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] < 128) transparent++;
    }
    const sampledTotal = data.length / 16;
    const pct = Math.min(1, transparent / sampledTotal);

    progressBar.style.width = `${pct * 100}%`;
    const msgIdx = Math.min(SCRATCH_MESSAGES.length - 1, Math.floor(pct * SCRATCH_MESSAGES.length));
    progressLbl.textContent = SCRATCH_MESSAGES[msgIdx];

    if (pct >= 0.62 && !revealed) autoReveal();
  }

  function autoReveal() {
    revealed = true;

    /* Fade out remaining foil */
    let alpha = 1;
    const fadeIv = setInterval(() => {
      alpha -= 0.055;
      if (alpha <= 0) {
        alpha = 0;
        canvas.style.display = 'none';
        clearInterval(fadeIv);
      }
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 0.055;
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }, 18);

    /* Progress bar completes */
    progressBar.style.transition = 'width .7s ease';
    progressBar.style.width = '100%';
    progressLbl.textContent = '💖 Message revealed! With love…';

    /* Badge */
    setTimeout(() => doneBadge.classList.add('show'), 700);

    /* Sparkle burst */
    setTimeout(burstSparkles, 400);

    /* Joyful chime */
    setTimeout(playRevealChime, 300);
  }

  function burstSparkles() {
    const rect = cardWrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    for (let i = 0; i < 28; i++) {
      const sp = document.createElement('span');
      sp.className = 'sc-sparkle';
      sp.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
      const angle  = Math.random() * Math.PI * 2;
      const dist1  = 60  + Math.random() * 140;
      const dist2  = 100 + Math.random() * 200;
      sp.style.cssText = `
        left:${cx}px;top:${cy}px;
        --tx:${Math.cos(angle)*dist1}px;--ty:${Math.sin(angle)*dist1}px;
        --tx2:${Math.cos(angle)*dist2}px;--ty2:${Math.sin(angle)*dist2}px;
        animation-delay:${Math.random()*.4}s;
        animation-duration:${.7+Math.random()*.6}s;
        font-size:${1+Math.random()*1.2}rem;
      `;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 2000);
    }
  }

  function playRevealChime() {
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      // Ascending arpeggio — warm and soft
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc  = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = actx.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain); gain.connect(actx.destination);
        osc.start(t); osc.stop(t + 0.6);
      });
    } catch(e) {}
  }

  /* ── Event listeners ── */
  canvas.addEventListener('mousedown', e => {
    if (revealed) return;
    scratching = true;
    const p = getPos(e); lastX = p.x; lastY = p.y;
    scratchAt(p.x, p.y, p.x, p.y);
  });
  window.addEventListener('mousemove', e => {
    if (!scratching || revealed) return;
    const p = getPos(e);
    scratchAt(p.x, p.y, lastX, lastY);
    lastX = p.x; lastY = p.y;
  });
  window.addEventListener('mouseup', () => { scratching = false; });

  canvas.addEventListener('touchstart', e => {
    if (revealed) return;
    e.preventDefault();
    scratching = true;
    const p = getPos(e); lastX = p.x; lastY = p.y;
    scratchAt(p.x, p.y, p.x, p.y);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!scratching || revealed) return;
    e.preventDefault();
    const p = getPos(e);
    scratchAt(p.x, p.y, lastX, lastY);
    lastX = p.x; lastY = p.y;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { scratching = false; });

  /* Re-init on resize to keep canvas sized correctly */
  window.addEventListener('resize', () => {
    if (scInited && !revealed) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      initScratch();
    }
  });
})();
</script>
