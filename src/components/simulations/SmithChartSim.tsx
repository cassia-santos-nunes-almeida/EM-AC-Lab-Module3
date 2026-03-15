import { useCallback, useEffect, useRef, useState } from 'react';
import {
  calculateComplexReflectionCoefficient,
  calculateVSWR,
} from '../../utils/transmissionMath';

/** Props for the SmithChartSim component. */
interface SmithChartSimProps {
  /** Additional CSS class names for the outermost container. */
  className?: string;
}

/** Detect dark mode by checking the root element class list. */
const isDark = (): boolean =>
  document.documentElement.classList.contains('dark');

/** Constant-resistance circle values to draw. */
const R_CIRCLES = [0, 0.2, 0.5, 1, 2, 5];

/** Constant-reactance arc values to draw. */
const X_ARCS = [0.2, 0.5, 1, 2, 5];

/**
 * Interactive HTML5 Canvas Smith chart simulation.
 *
 * Students adjust the real and imaginary parts of load impedance and
 * characteristic impedance via sliders. The component renders a Smith chart
 * with constant-resistance circles, constant-reactance arcs, the impedance
 * point, VSWR circle, and Gamma vector. Clicking on the chart places an
 * impedance point directly.
 */
export function SmithChartSim({ className }: SmithChartSimProps) {
  /* ── Slider state ─────────────────────────────────────────────── */

  /** Real part of load impedance (0 to 500 ohms). */
  const [ZLr, setZLr] = useState(100);
  /** Imaginary part of load impedance (-500 to 500 ohms). */
  const [ZLi, setZLi] = useState(0);
  /** Characteristic impedance (25 to 100 ohms). */
  const [Z0, setZ0] = useState(50);
  /** Whether the matching stub section is expanded. */
  const [showMatching, setShowMatching] = useState(false);
  /** Whether the user is dragging on the VSWR circle. */
  const isDraggingRef = useRef(false);
  /** Current |Gamma| for VSWR circle drag constraint. */
  const dragGammaMagRef = useRef(0);

  /* ── Derived electrical values ────────────────────────────────── */

  const gamma = calculateComplexReflectionCoefficient(ZLr, ZLi, Z0);
  const vswr = calculateVSWR(gamma.magnitude);

  // Normalized impedance
  const zr = ZLr / Z0;
  const zi = ZLi / Z0;

  // Quarter-wave transformer impedance (only meaningful for real loads)
  const zqw = ZLr > 0 ? Math.sqrt(Z0 * ZLr) : 0;

  /* ── Canvas refs & animation ──────────────────────────────────── */

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  /** Convert Gamma coordinates (-1..1) to canvas pixel coordinates. */
  const gammaToPixel = useCallback(
    (gr: number, gi: number, cx: number, cy: number, radius: number) => ({
      x: cx + gr * radius,
      y: cy - gi * radius, // Canvas y is inverted
    }),
    [],
  );

  /** Convert canvas pixel to Gamma coordinates. */
  const pixelToGamma = useCallback(
    (px: number, py: number, cx: number, cy: number, radius: number) => ({
      real: (px - cx) / radius,
      imag: -(py - cy) / radius, // Canvas y is inverted
    }),
    [],
  );

  /** Convert Gamma to ZL. */
  const gammaToZL = useCallback(
    (gr: number, gi: number, z0: number) => {
      // ZL = Z0 * (1 + Gamma) / (1 - Gamma)
      const denR = 1 - gr;
      const denI = -gi;
      const numR = 1 + gr;
      const numI = gi;
      const denMagSq = denR * denR + denI * denI;
      if (denMagSq < 1e-12) return { real: 500, imag: 0 }; // Near open circuit
      const zlr = z0 * (numR * denR + numI * denI) / denMagSq;
      const zli = z0 * (numI * denR - numR * denI) / denMagSq;
      return { real: zlr, imag: zli };
    },
    [],
  );

  /** Draw an arrowhead at the end of a line. */
  const drawArrowhead = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      size: number,
    ) => {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - size * Math.cos(angle - Math.PI / 6),
        toY - size * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        toX - size * Math.cos(angle + Math.PI / 6),
        toY - size * Math.sin(angle + Math.PI / 6),
      );
      ctx.closePath();
      ctx.fill();
    },
    [],
  );

  /** Main render function. */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const dark = isDark();

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = dark ? '#1e293b' : '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Smith chart center and radius
    const cx = w / 2;
    const cy = h / 2;
    const chartRadius = Math.min(w, h) * 0.4;

    // ── Draw constant-resistance circles ──
    ctx.strokeStyle = dark ? 'rgba(148,163,184,0.3)' : 'rgba(156,163,175,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (const r of R_CIRCLES) {
      const centerX = cx + (r / (r + 1)) * chartRadius;
      const centerY = cy;
      const radius = (1 / (r + 1)) * chartRadius;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // Label
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = dark ? 'rgba(148,163,184,0.6)' : 'rgba(107,114,128,0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      if (r === 0) {
        ctx.fillText('0', cx - chartRadius, cy - 4);
      } else {
        const labelX = cx + (r / (r + 1)) * chartRadius + radius;
        if (labelX <= cx + chartRadius + 5) {
          ctx.fillText(String(r), Math.min(labelX, cx + chartRadius - 2), cy - 4);
        }
      }
    }

    // ── Draw constant-reactance arcs ──
    ctx.strokeStyle = dark ? 'rgba(148,163,184,0.2)' : 'rgba(156,163,175,0.3)';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([4, 4]);

    for (const x of X_ARCS) {
      for (const sign of [1, -1]) {
        const arcCenterX = cx + chartRadius; // Always at (1, 1/x) in Gamma coords
        const arcCenterY = cy - (sign / x) * chartRadius; // sign flips for ±x
        const arcRadius = (1 / x) * chartRadius;

        // Clip to unit circle: find intersection angles
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, chartRadius, 0, 2 * Math.PI);
        ctx.clip();

        ctx.beginPath();
        ctx.arc(arcCenterX, arcCenterY, arcRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();

        // Label at the unit circle boundary
        // The arc intersects the unit circle; label near that point
        const labelAngle = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        const lx = arcCenterX + arcRadius * Math.cos(labelAngle);
        const ly = arcCenterY + arcRadius * Math.sin(labelAngle);
        const dist = Math.sqrt((lx - cx) * (lx - cx) + (ly - cy) * (ly - cy));
        if (dist <= chartRadius + 15) {
          ctx.font = '9px ui-sans-serif, system-ui, sans-serif';
          ctx.fillStyle = dark ? 'rgba(148,163,184,0.5)' : 'rgba(107,114,128,0.6)';
          ctx.textAlign = 'center';
          ctx.textBaseline = sign > 0 ? 'top' : 'bottom';
          // Place label at the boundary of the unit circle along the arc direction
          const boundaryAngle = Math.atan2(ly - cy, lx - cx);
          const bx = cx + (chartRadius + 10) * Math.cos(boundaryAngle);
          const by = cy + (chartRadius + 10) * Math.sin(boundaryAngle);
          if (bx > 10 && bx < w - 10 && by > 10 && by < h - 10) {
            ctx.fillText(`${sign > 0 ? '+' : '-'}j${x}`, bx, by);
          }
        }
      }
    }

    ctx.setLineDash([]);

    // ── Unit circle (Smith chart boundary) ──
    ctx.strokeStyle = dark ? '#94a3b8' : '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, chartRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // ── Real axis ──
    ctx.strokeStyle = dark ? 'rgba(148,163,184,0.4)' : 'rgba(107,114,128,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - chartRadius, cy);
    ctx.lineTo(cx + chartRadius, cy);
    ctx.stroke();

    // Axis labels
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = dark ? '#94a3b8' : '#6b7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Short (Γ=-1)', cx - chartRadius, cy + 8);
    ctx.fillText('Open (Γ=+1)', cx + chartRadius, cy + 8);
    ctx.fillText('Matched', cx, cy + 8);

    // ── VSWR circle ──
    if (gamma.magnitude > 0.01 && gamma.magnitude < 1) {
      ctx.strokeStyle = dark ? 'rgba(96,165,250,0.5)' : 'rgba(59,130,246,0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, gamma.magnitude * chartRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Gamma vector (line from origin to impedance point) ──
    const pt = gammaToPixel(gamma.real, gamma.imag, cx, cy, chartRadius);
    ctx.strokeStyle = dark ? '#60a5fa' : '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    // Arrowhead
    ctx.fillStyle = dark ? '#60a5fa' : '#2563eb';
    if (gamma.magnitude > 0.05) {
      drawArrowhead(ctx, cx, cy, pt.x, pt.y, 10);
    }

    // ── Impedance point ──
    ctx.fillStyle = dark ? '#3b82f6' : '#2563eb';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // White inner dot
    ctx.fillStyle = dark ? '#1e293b' : '#ffffff';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // Label the impedance point
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = dark ? '#60a5fa' : '#2563eb';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    const labelOffX = pt.x + 10 > w - 60 ? -70 : 10;
    const labelOffY = pt.y - 10 < 15 ? 18 : -8;
    ctx.fillText(
      `z = ${zr.toFixed(2)}${zi >= 0 ? '+' : ''}j${zi.toFixed(2)}`,
      pt.x + labelOffX,
      pt.y + labelOffY,
    );

    animFrameRef.current = requestAnimationFrame(render);
  }, [ZLr, ZLi, Z0, gamma, zr, zi, gammaToPixel, drawArrowhead]);

  /** Start / restart the render loop whenever render changes. */
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [render]);

  /* ── Click-to-place and drag interaction ──────────────────────── */

  const getChartCoords = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const chartRadius = Math.min(rect.width, rect.height) * 0.4;
    return { cx, cy, chartRadius, rect };
  }, []);

  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const coords = getChartCoords();
      if (!coords) return;
      const { cx, cy, chartRadius, rect } = coords;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const g = pixelToGamma(px, py, cx, cy, chartRadius);
      const gMag = Math.sqrt(g.real * g.real + g.imag * g.imag);

      if (gMag > 1.05) return; // Outside chart

      // Check if near the VSWR circle (within tolerance) to start drag
      if (Math.abs(gMag - gamma.magnitude) < 0.08 && gamma.magnitude > 0.03) {
        isDraggingRef.current = true;
        dragGammaMagRef.current = gamma.magnitude;
        (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
      }

      // Place impedance point
      const clampedMag = Math.min(gMag, 0.999);
      const angle = Math.atan2(g.imag, g.real);
      const gr = clampedMag * Math.cos(angle);
      const gi = clampedMag * Math.sin(angle);
      const zl = gammaToZL(gr, gi, Z0);
      setZLr(Math.max(0, Math.min(500, Math.round(zl.real))));
      setZLi(Math.max(-500, Math.min(500, Math.round(zl.imag))));
    },
    [getChartCoords, pixelToGamma, gammaToZL, Z0, gamma.magnitude],
  );

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDraggingRef.current) return;
      const coords = getChartCoords();
      if (!coords) return;
      const { cx, cy, chartRadius, rect } = coords;
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const g = pixelToGamma(px, py, cx, cy, chartRadius);

      // Constrain to VSWR circle
      const angle = Math.atan2(g.imag, g.real);
      const constrainedMag = dragGammaMagRef.current;
      const gr = constrainedMag * Math.cos(angle);
      const gi = constrainedMag * Math.sin(angle);
      const zl = gammaToZL(gr, gi, Z0);
      setZLr(Math.max(0, Math.min(500, Math.round(zl.real))));
      setZLi(Math.max(-500, Math.min(500, Math.round(zl.imag))));
    },
    [getChartCoords, pixelToGamma, gammaToZL, Z0],
  );

  const handleCanvasPointerUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  /* ── UI ───────────────────────────────────────────────────────── */

  return (
    <div className={className}>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
        {/* Canvas */}
        <div ref={containerRef} className="w-full aspect-square min-h-[320px] max-h-[560px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair"
            aria-label="Interactive Smith chart simulation canvas"
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerCancel={handleCanvasPointerUp}
          />
        </div>

        {/* Controls + Readouts */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-700 space-y-5">
          {/* Sliders */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* ZLr slider */}
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                R<sub>L</sub> (real) = {ZLr} &Omega;
              </span>
              <input
                type="range"
                min={0}
                max={500}
                step={1}
                value={ZLr}
                onChange={(e) => setZLr(parseInt(e.target.value, 10))}
                className="w-full accent-engineering-blue-600"
              />
            </label>

            {/* ZLi slider */}
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                X<sub>L</sub> (imag) = {ZLi} &Omega;
              </span>
              <input
                type="range"
                min={-500}
                max={500}
                step={1}
                value={ZLi}
                onChange={(e) => setZLi(parseInt(e.target.value, 10))}
                className="w-full accent-engineering-blue-600"
              />
            </label>

            {/* Z0 slider */}
            <label className="block space-y-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Z<sub>0</sub> = {Z0} &Omega;
              </span>
              <input
                type="range"
                min={25}
                max={100}
                step={1}
                value={Z0}
                onChange={(e) => setZ0(parseInt(e.target.value, 10))}
                className="w-full accent-engineering-blue-600"
              />
            </label>
          </div>

          {/* Computed values */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ReadoutCard
              label="|\u0393| (magnitude)"
              value={gamma.magnitude.toFixed(4)}
            />
            <ReadoutCard
              label="\u2220\u0393 (phase)"
              value={`${gamma.phaseDeg.toFixed(1)}\u00B0`}
            />
            <ReadoutCard
              label="VSWR"
              value={isFinite(vswr) ? vswr.toFixed(3) : '\u221E'}
            />
            <ReadoutCard
              label="Normalized z = Z\u2097/Z\u2080"
              value={`${zr.toFixed(3)} ${zi >= 0 ? '+' : '\u2212'} j${Math.abs(zi).toFixed(3)}`}
            />
          </div>

          {/* Matching stub calculator (collapsible) */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMatching(!showMatching)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <span>Quarter-Wave Matching</span>
              <span className="text-slate-400">{showMatching ? '\u25B2' : '\u25BC'}</span>
            </button>
            {showMatching && (
              <div className="px-4 pb-3 pt-1 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  A quarter-wave transformer section with impedance{' '}
                  <strong className="text-slate-900 dark:text-white font-mono">
                    Z<sub>QW</sub> = &radic;(Z<sub>0</sub> &middot; R<sub>L</sub>)
                  </strong>{' '}
                  will match a purely resistive load to the line.
                </p>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
                    Quarter-wave transformer impedance
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    {ZLr > 0
                      ? `${zqw.toFixed(2)} \u03A9`
                      : 'N/A (R\u2097 must be > 0)'}
                  </p>
                </div>
                {ZLi !== 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    Note: The load has a reactive component (X<sub>L</sub> = {ZLi} &Omega;).
                    The quarter-wave transformer formula assumes a purely resistive load.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Fixed parameter note */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Click on the chart to place an impedance point. Drag along the VSWR circle to
            explore constant-|&Gamma;| impedances.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Helper sub-component ───────────────────────────────────────── */

/** Props for the ReadoutCard helper. */
interface ReadoutCardProps {
  /** Label describing the quantity. */
  label: string;
  /** Formatted value string. */
  value: string;
}

/** Small card displaying a computed quantity. */
function ReadoutCard({ label, value }: ReadoutCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2">
      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
        {value}
      </p>
    </div>
  );
}
