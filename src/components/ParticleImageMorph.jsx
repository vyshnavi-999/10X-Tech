import React, { useRef, useEffect, useState, useCallback } from 'react';

const SRC = [
  '/asset_point_1.png',
  '/asset_point_2.png',
  '/asset_point_3.png',
  '/asset_point_4.png',
];

const CAPS = [
  'Weights on your disk',
  'Licensed in your name',
  'Your hardware, your choice',
  'No meter, no seat count',
];

const ParticleImageMorph = ({ activeIndex = 0 }) => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRefs = useRef([]);

  const [activeImgIndex, setActiveImgIndex] = useState(activeIndex);
  const [isReady, setIsReady] = useState(false);

  const curRef = useRef(activeIndex);
  const ptsRef = useRef([null, null, null, null]);
  const latticeRef = useRef([]);
  const particlesRef = useRef([]);
  const alphaRef = useRef(1);
  const phaseRef = useRef('idle');
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, imgSize: 0, dpr: 1 });

  // Sample image with precise dot centers and intensity
  const sampleImg = useCallback((img, idx, cb) => {
    const R = 220; // High resolution sampling
    const c = document.createElement('canvas');
    c.width = R;
    c.height = R;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0, R, R);
    const d = x.getImageData(0, 0, R, R).data;
    const out = [];

    // Scale multiplier: Point 1 gets a 1.24x boost so its artwork matches the visual size of the other icons
    const scaleMult = idx === 0 ? 1.24 : 1.0;

    for (let j = 0; j < R; j += 2) {
      for (let i = 0; i < R; i += 2) {
        const p = (j * R + i) * 4;
        const r = d[p];
        const g = d[p + 1];
        const b = d[p + 2];
        const a = d[p + 3];
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);

        if (brightness > 65) {
          const radius = (0.9 + (brightness / 255) * 1.3) * (idx === 0 ? 1.12 : 1.0);
          out.push({
            nx: (i / R - 0.5) * scaleMult,
            ny: (j / R - 0.5) * scaleMult,
            r: radius,
          });
        }
      }
    }

    // Shuffle points for natural dispersion/travel
    for (let k = out.length - 1; k > 0; k--) {
      const q = Math.floor(Math.random() * (k + 1));
      const t = out[k];
      out[k] = out[q];
      out[q] = t;
    }
    cb(out);
  }, []);

  // Preload and sample images
  useEffect(() => {
    let loadedCount = 0;
    SRC.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        sampleImg(img, idx, (out) => {
          ptsRef.current[idx] = out;
          loadedCount++;
          if (loadedCount === SRC.length) {
            setIsReady(true);
          }
        });
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === SRC.length) {
          setIsReady(true);
        }
      };
    });
  }, [sampleImg]);

  // Compute exact image dimensions matching the container box
  const getRenderedImageSize = useCallback((W, H) => {
    const naturalFit = Math.min(W * 0.84, H * 0.84);
    return Math.min(naturalFit, 380);
  }, []);

  // Build grid/lattice and particle pool
  const build = useCallback(() => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    if (!stage || !cv) return;

    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = rect.width;
    const H = rect.height;
    if (!W || !H) return;

    const imgSize = getRenderedImageSize(W, H);

    sizeRef.current = { w: W, h: H, imgSize, dpr };
    cv.width = W * dpr;
    cv.height = H * dpr;

    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gap = W < 520 ? 14 : 12;
    const cols = Math.floor(W / gap);
    const rows = Math.floor(H / gap);
    const ox = (W - (cols - 1) * gap) / 2;
    const oy = (H - (rows - 1) * gap) / 2;

    const lattice = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        lattice.push({ x: ox + i * gap, y: oy + j * gap, r: 1.1 });
      }
    }
    latticeRef.current = lattice;

    const N = 1200;
    if (!particlesRef.current.length && lattice.length) {
      const P = [];
      for (let k = 0; k < N; k++) {
        const s = lattice[k % lattice.length];
        P.push({
          x: s.x,
          y: s.y,
          tx: s.x,
          ty: s.y,
          sp: 0.065 + Math.random() * 0.06,
          r: 1.1,
          tr: 1.1,
        });
      }
      particlesRef.current = P;
    }
  }, [getRenderedImageSize]);

  const place = (list, snap) => {
    const { w: W, h: H, imgSize: S } = sizeRef.current;
    const P = particlesRef.current;
    const N = P.length;
    if (!list || !list.length) return;

    for (let i = 0; i < N; i++) {
      const p = list[i % list.length];
      P[i].tx = W / 2 + p.nx * S;
      P[i].ty = H / 2 + p.ny * S;
      P[i].tr = p.r || 1.1;
      if (snap) {
        P[i].x = P[i].tx;
        P[i].y = P[i].ty;
        P[i].r = P[i].tr;
      }
    }
  };

  const toLattice = (snap) => {
    const P = particlesRef.current;
    const lattice = latticeRef.current;
    const N = P.length;
    if (!lattice.length) return;

    for (let i = 0; i < N; i++) {
      const p = lattice[(i * 7) % lattice.length];
      P[i].tx = p.x;
      P[i].ty = p.y;
      P[i].tr = 1.1;
      if (snap) {
        P[i].x = p.x;
        P[i].y = p.y;
        P[i].r = p.tr;
      }
    }
  };

  // Perform precise particle morph transition
  const transitionTo = useCallback((toIndex) => {
    const from = curRef.current;
    curRef.current = toIndex;
    const pts = ptsRef.current;

    // 1. Hide current crisp image
    setActiveImgIndex(-1);

    // 2. Dots stand exactly where the current image artwork was
    if (from >= 0 && pts[from]) {
      place(pts[from], true);
    } else {
      toLattice(true);
    }

    alphaRef.current = 1;
    phaseRef.current = 'fly';

    // 3. Dots smoothly fly to where the next image will be
    if (toIndex >= 0 && pts[toIndex]) {
      place(pts[toIndex], false);
    } else {
      toLattice(false);
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      phaseRef.current = 'fade';
      // 4. Fade in full-fidelity crisp image exactly on top of settled dots
      if (toIndex >= 0) {
        setActiveImgIndex(toIndex);
      }
    }, 580);
  }, []);

  // Update when activeIndex changes
  useEffect(() => {
    if (!isReady) return;
    build();
    transitionTo(activeIndex);
  }, [activeIndex, isReady, build, transitionTo]);

  // Main canvas render loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const handleResize = () => {
      build();
      if (curRef.current >= 0 && ptsRef.current[curRef.current]) {
        place(ptsRef.current[curRef.current], true);
      } else {
        toLattice(true);
      }
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      const { w: W, h: H } = sizeRef.current;
      if (W && H) {
        ctx.clearRect(0, 0, W, H);

        if (phaseRef.current === 'fade') {
          alphaRef.current += (0 - alphaRef.current) * 0.12;
          if (alphaRef.current < 0.01) {
            alphaRef.current = 0;
            phaseRef.current = curRef.current < 0 ? 'idle' : 'off';
          }
        }
        if (phaseRef.current === 'idle') {
          alphaRef.current += (1 - alphaRef.current) * 0.10;
        }

        if (!(alphaRef.current < 0.01 && phaseRef.current === 'off')) {
          ctx.fillStyle = `rgba(255, 255, 255, ${(alphaRef.current * 0.94).toFixed(3)})`;
          const P = particlesRef.current;
          const len = P.length;
          for (let i = 0; i < len; i++) {
            const p = P[i];
            p.x += (p.tx - p.x) * p.sp;
            p.y += (p.ty - p.y) * p.sp;
            p.r += (p.tr - p.r) * 0.12;

            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.6, p.r), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [build]);

  const { imgSize } = sizeRef.current;

  return (
    <div
      ref={stageRef}
      className="relative w-full h-full min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center justify-center overflow-hidden select-none bg-black"
    >
      {/* 4 Real Full-Fidelity Crisp PNG Images (Positioned & Sized Exactly with Canvas Scale) */}
      {SRC.map((src, i) => {
        const isPointOne = i === 0;
        const scaleFactor = isPointOne ? 1.24 : 1.0;
        const renderPx = imgSize ? Math.min(Math.round(imgSize * scaleFactor), 430) : null;

        return (
          <img
            key={src}
            ref={(el) => (imgRefs.current[i] = el)}
            src={src}
            alt={`Point ${i + 1}`}
            className="absolute aspect-square object-contain pointer-events-none transition-opacity duration-300 ease-out"
            style={{
              width: renderPx ? `${renderPx}px` : (isPointOne ? '92%' : '76%'),
              height: renderPx ? `${renderPx}px` : (isPointOne ? '92%' : '76%'),
              maxWidth: isPointOne ? '430px' : '380px',
              maxHeight: isPointOne ? '430px' : '380px',
              opacity: activeImgIndex === i ? 1 : 0,
            }}
          />
        );
      })}

      {/* Particle Transition Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Caption Tag */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10 transition-opacity duration-300">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-white/45 font-mono"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {activeIndex >= 0 ? CAPS[activeIndex % CAPS.length] : 'Select an item'}
        </span>
      </div>
    </div>
  );
};

export default ParticleImageMorph;
