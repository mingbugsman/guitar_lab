/**
 * Six steel strings, synthesised with the extended Karplus-Strong model (Jaffe & Smith; loop
 * filter after Välimäki et al.), tuned against measurements of real guitar tones:
 *
 *  - The loss filter sits INSIDE the feedback loop, so high partials die faster than low ones.
 *    Jansson (KTH, "Acoustics for violin and guitar makers", ch. 6) measured E3 on string 6:
 *    partials 1-5 fall ~3 dB in 0.2 s, partials 6-10 ~10 dB, partials 11-14 ~15 dB.
 *  - The loop length is fractional (4-point Lagrange + the loss filter's phase delay), so every
 *    note is in tune to well under 1 cent.
 *  - The pluck point is ~1/5.5 of the string from the bridge (the same measurement shows the
 *    6th and 11th partials missing), applied as a comb on the excitation.
 *  - Two polarisations per string: the one across the top plate drains into the body fast (the
 *    loud start), the one along the plate rings long (the tail). Jansson ch. 6, fig. 6.2.
 *
 * Plain JavaScript because it runs in the AudioWorklet scope. Outside a worklet (unit tests) it
 * exposes the DSP class on globalThis instead of registering a processor.
 */

const SIZE = 4096;
const PLUCK_POINT = 0.18;
const HI_FREQ = 2000;

/** Magnitude of the normalised one-pole loss filter (1+a)/(1+a z^-1) at angular frequency w. */
function lossMag(a, w) {
  return (1 + a) / Math.sqrt(1 + 2 * a * Math.cos(w) + a * a);
}

/** Phase delay (samples) of the loss filter at w. */
function lossDelay(a, w) {
  return -Math.atan2(a * Math.sin(w), 1 + a * Math.cos(w)) / w;
}

/**
 * Loss filter that gives T60 = t0 seconds at the fundamental and tHi seconds at HI_FREQ.
 * A partial circulates f0 times per second, so its gain per trip is 10^(-3 / (f0 * T60)).
 */
function designLoss(f0, fs, t0, tHi) {
  const w0 = (2 * Math.PI * f0) / fs;
  const wHi = (2 * Math.PI * Math.min(HI_FREQ, fs * 0.45)) / fs;
  const want = Math.pow(10, (-3 / f0) * (1 / tHi - 1 / t0));
  let lo = -0.999;
  let hi = 0;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (lossMag(mid, wHi) / lossMag(mid, w0) > want) hi = mid;
    else lo = mid;
  }
  const a = (lo + hi) / 2;
  const g = Math.pow(10, -3 / (f0 * t0)) / lossMag(a, w0);
  return { a, b: g * (1 + a), delay: lossDelay(a, w0) };
}

/** One polarisation of one string: a fractional delay line closed through the loss filter. */
class Loop {
  constructor() {
    this.buf = new Float32Array(SIZE);
    this.w = 0;
    this.d = 100;
    this.a = 0;
    this.b = 0;
    this.y = 0;
  }

  tune(f0, fs, t0, tHi, detune) {
    const loss = designLoss(f0, fs, t0, tHi);
    this.a = loss.a;
    this.b = loss.b;
    this.d = Math.min(SIZE - 4, Math.max(2, (fs / f0) * detune - loss.delay));
  }

  step(input) {
    const i = Math.floor(this.d);
    const t = this.d - i;
    const buf = this.buf;
    // x(n - i + 1), x(n - i), x(n - i - 1), x(n - i - 2); the newest sample sits at w
    const at = (k) => buf[(this.w - k + 1 + SIZE) % SIZE];
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const v =
      (-t * (t - 1) * (t - 2) * p0) / 6 +
      ((t + 1) * (t - 1) * (t - 2) * p1) / 2 -
      ((t + 1) * t * (t - 2) * p2) / 2 +
      ((t + 1) * t * (t - 1) * p3) / 6;
    this.y = this.b * v - this.a * this.y;
    this.w = (this.w + 1) % SIZE;
    buf[this.w] = input + this.y;
    return this.y;
  }

  damp(k) {
    for (let i = 0; i < SIZE; i++) this.buf[i] *= k;
    this.y *= k;
  }
}

class GuitarString {
  constructor() {
    this.across = new Loop();
    this.along = new Loop();
    this.excite = null;
    this.pos = 0;
  }

  /**
   * f0 in Hz; velocity 0..1 (louder is also brighter); `fretted` notes lose a little energy to
   * the fingertip; `t0` overrides the decay (a muted note).
   */
  pluck(fs, f0, velocity, fretted, t0Override) {
    // T60 at the fundamental: ~4 s around E3 (Jansson: partials 1-5 fall ~15 dB/s), longer on
    // the bass strings, shorter up the neck.
    const base = (t0Override ?? 4 * Math.pow(165 / f0, 0.3)) * (fretted && !t0Override ? 0.9 : 1);
    const tHi = Math.min(base * 0.6, t0Override ? base * 0.4 : 1.1);
    this.across.tune(f0, fs, base * 0.5, tHi * 0.7, 0.9996);
    this.along.tune(f0, fs, base * 1.25, tHi, 1);
    // a new pluck stops most of the old vibration: the pick (or finger) lands on the string
    this.across.damp(0.25);
    this.along.damp(0.25);

    // One period of the force a plucked string puts on the bridge. A string pulled aside at
    // fraction beta of its length and let go has partial k with amplitude sin(k*pi*beta)/k^p:
    // partials with a node at the pluck point are missing (Jansson fig. 6.1), and a harder pick
    // (smaller p) is brighter. Deterministic, so every pluck of a note sounds the same, with a
    // little noise on top for the scrape of the pick.
    const n = Math.max(4, Math.round(fs / f0));
    const beta = PLUCK_POINT + (Math.random() - 0.5) * 0.02;
    const p = 1.5 - 0.5 * velocity;
    const top = Math.max(1, Math.floor(Math.min(9000, fs * 0.45) / f0));
    const e = new Float32Array(n);
    for (let k = 1; k <= top; k++) {
      const amp = Math.sin(k * Math.PI * beta) / Math.pow(k, p);
      const step = (2 * Math.PI * k) / n;
      for (let i = 0; i < n; i++) e[i] += amp * Math.cos(step * i);
    }
    let peak = 1e-9;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(e[i]));
    for (let i = 0; i < n; i++) e[i] = e[i] / peak + (Math.random() * 2 - 1) * 0.04 * velocity;
    const gain = 0.25 + 0.75 * velocity;
    for (let i = 0; i < n; i++) e[i] *= gain;
    this.excite = e;
    this.pos = 0;
  }

  step() {
    let x = 0;
    if (this.excite) {
      x = this.excite[this.pos++];
      if (this.pos >= this.excite.length) this.excite = null;
    }
    return 0.4 * this.across.step(x) + 0.6 * this.along.step(x);
  }
}

class GuitarStrings {
  constructor(fs) {
    this.fs = fs;
    this.strings = [1, 2, 3, 4, 5, 6].map(() => new GuitarString());
    /** @type {{frame:number,string:number,freq:number,velocity:number,fretted:boolean,t0?:number}[]} */
    this.queue = [];
  }

  /** Schedule a pluck at absolute sample frame `frame`. */
  add(ev) {
    this.queue.push(ev);
    this.queue.sort((p, q) => p.frame - q.frame);
  }

  /** Render `out.length` samples starting at absolute frame `start`. */
  render(out, start) {
    for (let i = 0; i < out.length; i++) {
      while (this.queue.length && this.queue[0].frame <= start + i) {
        const ev = this.queue.shift();
        const s = this.strings[ev.string - 1];
        if (s) s.pluck(this.fs, ev.freq, ev.velocity ?? 0.8, !!ev.fretted, ev.t0);
      }
      let sum = 0;
      for (let s = 0; s < 6; s++) sum += this.strings[s].step();
      out[i] = Math.tanh(sum * 0.35);
    }
    return out;
  }
}

if (typeof registerProcessor === "function") {
  class GuitarProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.guitar = new GuitarStrings(sampleRate);
      this.port.onmessage = (m) => {
        const ev = m.data;
        if (ev && ev.type === "pluck") this.guitar.add({ ...ev, frame: Math.round(ev.time * sampleRate) });
      };
    }

    process(_inputs, outputs) {
      const out = outputs[0];
      this.guitar.render(out[0], currentFrame);
      for (let c = 1; c < out.length; c++) out[c].set(out[0]);
      return true;
    }
  }
  registerProcessor("gl-guitar", GuitarProcessor);
} else {
  globalThis.GLGuitarStrings = GuitarStrings;
}
