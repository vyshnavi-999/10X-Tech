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

// Quintic smooth ease for organic, fluid morphing
function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

// Spatial sorting helper: organizes points by angle and radial distance so particles travel in smooth, coherent streams
function sortPointsSpatially(points) {
  return [...points].sort((a, b) => {
    const angleA = Math.atan2(a.ny, a.nx);
    const angleB = Math.atan2(b.ny, b.nx);
    if (Math.abs(angleA - angleB) > 0.06) {
      return angleA - angleB;
    }
    const distA = a.nx * a.nx + a.ny * a.ny;
    const distB = b.nx * b.nx + b.ny * b.ny;
    return distA - distB;
  });
}

const ParticleImageMorph = ({ activeIndex = 0 }) => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRefs = useRef([]);

  const [activeImgIndex, setActiveImgIndex] = useState(activeIndex);
  const [isReady, setIsReady] = useState(false);

  const curRef = useRef(activeIndex);
  const ptsRef = useRef([null, null, null, null]);
  const particlesRef = useRef([]);
  const latticeRef = useRef([]);
  const animFrameRef = useRef(null);
  const transitionRef = useRef({
    isAnimating: false,
    startTime: 0,
    duration: 1000,
    fromIndex: activeIndex,
    toIndex: activeIndex,
  });
  const canvasAlphaRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0, imgSize: 0, dpr: 1 });

  // High-density image sampling: extracts thousands of exact dot coordinates directly from the PNG luminance
  const sampleImg = useCallback((img, idx, cb) => {
    const R = 300; // Ultra high-resolution sampling grid
    const c = document.createElement('canvas');
    c.width = R;
    c.height = R;
    const x = c.getContext('2d');
    x.fillStyle = '#000000';
    x.fillRect(0, 0, R, R);

    // Maintain exact object-contain aspect ratio
    const nw = img.naturalWidth || img.width || 1;
    const nh = img.naturalHeight || img.height || 1;
    const aspect = nw / nh;

    let dw = R;
    let dh = R;
    let dx = 0;
    let dy = 0;

    if (aspect > 1) {
      dh = R / aspect;
      dy = (R - dh) / 2;
    } else if (aspect < 1) {
      dw = R * aspect;
      dx = (R - dw) / 2;
    }

    x.drawImage(img, dx, dy, dw, dh);
    const d = x.getImageData(0, 0, R, R).data;
    const rawPoints = [];

    // 1:1 exact scale across all images so particle formations match the image dimensions exactly
    const scaleMult = 1.0;

    for (let j = 0; j < R; j += 2) {
      for (let i = 0; i < R; i += 2) {
        const p = (j * R + i) * 4;
        const r = d[p];
        const g = d[p + 1];
        const b = d[p + 2];
        const a = d[p + 3];
        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);

        if (brightness > 40) {
          const dotRadius = (0.55 + (brightness / 255) * 0.85) * 0.96;
          const dotAlpha = Math.min(0.92, (brightness / 255) * 0.9);
          rawPoints.push({
            nx: (i / R - 0.5) * scaleMult,
            ny: (j / R - 0.5) * scaleMult,
            r: dotRadius,
            alpha: dotAlpha,
          });
        }
      }
    }

    // Sort spatially so neighboring pixels morph to neighboring target pixels without random chaotic crisscrossing
    const sorted = sortPointsSpatially(rawPoints);

    // Normalize to fixed pool of 3200 particles so every image has dense, rich definition
    const TARGET_POOL = 3200;
    const normalized = [];
    if (sorted.length > 0) {
      for (let k = 0; k < TARGET_POOL; k++) {
        const srcPoint = sorted[k % sorted.length];
        // For duplicates, add subtle sub-pixel spread to fill dense contour lines
        const isDuplicate = k >= sorted.length;
        const jitter = isDuplicate ? (Math.random() - 0.5) * 0.003 : 0;
        normalized.push({
          nx: srcPoint.nx + jitter,
          ny: srcPoint.ny + jitter,
          r: srcPoint.r,
          alpha: srcPoint.alpha,
        });
      }
    }

    cb(normalized);
  }, []);

  // Preload all 4 images
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

  // Build grid/lattice and initialize persistent particle system
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

    const N = 3200;
    const cx = W / 2;
    const cy = H / 2;

    // Ambient lattice background
    const gap = W < 520 ? 14 : 12;
    const cols = Math.floor(W / gap);
    const rows = Math.floor(H / gap);
    const ox = (W - (cols - 1) * gap) / 2;
    const oy = (H - (rows - 1) * gap) / 2;

    const lattice = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        lattice.push({ x: ox + i * gap, y: oy + j * gap, r: 1.0, alpha: 0.1 });
      }
    }
    latticeRef.current = lattice;

    // Persistent particles array
    if (!particlesRef.current.length) {
      const P = [];
      const currentPts = ptsRef.current[curRef.current] || [];

      for (let k = 0; k < N; k++) {
        let initX = cx;
        let initY = cy;
        let initR = 1.0;
        let initAlpha = 0.8;

        if (currentPts.length > k) {
          const pt = currentPts[k];
          initX = cx + pt.nx * imgSize;
          initY = cy + pt.ny * imgSize;
          initR = pt.r;
          initAlpha = pt.alpha;
        } else if (lattice.length) {
          const s = lattice[k % lattice.length];
          initX = s.x;
          initY = s.y;
        }

        P.push({
          x: initX,
          y: initY,
          startX: initX,
          startY: initY,
          tx: initX,
          ty: initY,
          r: initR,
          startR: initR,
          tr: initR,
          alpha: initAlpha,
          startAlpha: initAlpha,
          targetAlpha: initAlpha,
          delay: 0,
          curveFactor: (Math.random() - 0.5) * 28, // gentle organic curvature
          shimmerOffset: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = P;
    }
  }, [getRenderedImageSize]);

  // Trigger high-precision particle morph transition
  const transitionTo = useCallback((toIndex) => {
    const from = curRef.current;
    curRef.current = toIndex;

    const { w: W, h: H, imgSize: S } = sizeRef.current;
    if (!W || !H || !S) return;

    const cx = W / 2;
    const cy = H / 2;
    const P = particlesRef.current;
    const N = P.length;
    const targetPts = ptsRef.current[toIndex] || [];
    if (!targetPts.length || !N) return;

    // 1. Immediately hide the active crisp PNG so the viewer sees the image dissolve directly into matching dots
    setActiveImgIndex(-1);
    canvasAlphaRef.current = 1.0;

    // 2. Set up smooth morph trajectories for each persistent particle
    for (let i = 0; i < N; i++) {
      const p = P[i];
      const t = targetPts[i % targetPts.length];

      p.startX = p.x;
      p.startY = p.y;
      p.startR = p.r;
      p.startAlpha = p.alpha;

      p.tx = cx + t.nx * S;
      p.ty = cy + t.ny * S;
      p.tr = t.r;
      p.targetAlpha = t.alpha;

      // Distance-based wave delay: particles dissolve in an outward radiating fluid wave
      const dist = Math.hypot(p.startX - cx, p.startY - cy);
      p.delay = Math.min(0.25, (dist / (S * 0.55)) * 0.22);
    }

    transitionRef.current = {
      isAnimating: true,
      startTime: performance.now(),
      duration: 1050, // 1050ms continuous, visible morph
      fromIndex: from,
      toIndex: toIndex,
    };
  }, []);

  // Sync with activeIndex prop
  useEffect(() => {
    if (!isReady) return;
    build();
    transitionTo(activeIndex);
  }, [activeIndex, isReady, build, transitionTo]);

  // Main canvas animation and render loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');

    const handleResize = () => {
      build();
      const { w: W, h: H, imgSize: S } = sizeRef.current;
      const cx = W / 2;
      const cy = H / 2;
      const P = particlesRef.current;
      const targetPts = ptsRef.current[curRef.current] || [];
      if (targetPts.length && P.length && S) {
        for (let i = 0; i < P.length; i++) {
          const t = targetPts[i % targetPts.length];
          P[i].x = cx + t.nx * S;
          P[i].y = cy + t.ny * S;
          P[i].tx = P[i].x;
          P[i].ty = P[i].y;
          P[i].r = t.r;
          P[i].tr = t.r;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    const render = (now) => {
      const { w: W, h: H } = sizeRef.current;

      if (W && H) {
        ctx.clearRect(0, 0, W, H);

        const trans = transitionRef.current;
        const P = particlesRef.current;
        const len = P.length;

        if (trans.isAnimating) {
          const elapsed = (now - trans.startTime) / trans.duration;
          const globalT = Math.max(0, Math.min(1, elapsed));

          for (let i = 0; i < len; i++) {
            const p = P[i];

            // Calculate progress for particle including its wave delay
            const localProgress = Math.max(0, Math.min(1, (globalT - p.delay) / (1 - 0.25)));
            const easeT = easeInOutQuint(localProgress);

            // Interpolate straight path
            const straightX = p.startX + (p.tx - p.startX) * easeT;
            const straightY = p.startY + (p.ty - p.startY) * easeT;

            // Organic curved arc during flight: peak displacement at progress = 0.5
            const arc = Math.sin(localProgress * Math.PI) * p.curveFactor;
            const dx = p.tx - p.startX;
            const dy = p.ty - p.startY;
            const dist = Math.hypot(dx, dy) || 1;
            const perpX = -dy / dist;
            const perpY = dx / dist;

            p.x = straightX + perpX * arc;
            p.y = straightY + perpY * arc;
            p.r = p.startR + (p.tr - p.startR) * easeT;
            p.alpha = p.startAlpha + (p.targetAlpha - p.startAlpha) * easeT;
          }

          // As particles reach their final positions (progress > 95%), fade in the crisp PNG image
          if (globalT >= 0.96) {
            trans.isAnimating = false;
            setActiveImgIndex(trans.toIndex);
          }
        }

        // Crossfade canvas particles: when image is visible, canvas alpha fades out gracefully
        const isImageShown = activeImgIndex >= 0;
        const targetCanvasAlpha = isImageShown ? 0.0 : 1.0;
        canvasAlphaRef.current += (targetCanvasAlpha - canvasAlphaRef.current) * 0.12;

        if (canvasAlphaRef.current > 0.01) {
          const masterAlpha = canvasAlphaRef.current;

          for (let i = 0; i < len; i++) {
            const p = P[i];
            const dotOpacity = Math.min(1.0, Math.max(0.0, p.alpha * masterAlpha));

            if (dotOpacity > 0.02) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(240, 240, 248, ${dotOpacity.toFixed(3)})`;
              ctx.fill();
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [build, activeImgIndex]);

  const { imgSize } = sizeRef.current;

  return (
    <div
      ref={stageRef}
      className="relative w-full h-full min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center justify-center overflow-hidden select-none bg-black"
    >
      {/* 4 Real Full-Fidelity Crisp PNG Images (Positioned & Sized Exactly with Canvas Scale) */}
      {SRC.map((src, i) => (
        <img
          key={src}
          ref={(el) => (imgRefs.current[i] = el)}
          src={src}
          alt={`Point ${i + 1}`}
          className="absolute aspect-square object-contain pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            width: imgSize ? `${imgSize}px` : '76%',
            height: imgSize ? `${imgSize}px` : '76%',
            maxWidth: '380px',
            maxHeight: '380px',
            opacity: activeImgIndex === i ? 1 : 0,
            filter: 'brightness(1.18) contrast(1.06)',
          }}
        />
      ))}

      {/* High-Density Persistent Particle Transition Canvas */}
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
