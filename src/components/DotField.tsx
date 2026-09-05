"use client";

import { useEffect, useRef } from "react";

/* A field of white dots behind the philosophy section.
   The old version scripted four choreographed phases on a timer, so the grid
   performed whether or not anyone was watching and the text was hostage to the
   schedule. This one has no schedule: it sits nearly still until a cursor comes
   near, then the dots under the cursor grow, brighten and lean away from it.
   The only ambient motion is a slow swell, so the field is alive without
   competing with the type sitting on top of it. */

const SPACING = 30;
const BASE_RADIUS = 2.2;
const PEAK_RADIUS = 5.4;
const BASE_ALPHA = 0.11;
const PEAK_ALPHA = 0.92;
const REACH = 190;
const PUSH = 11;

type Dot = { x: number; y: number; phase: number };

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    // Parked far off canvas so nothing is lit until a real pointer arrives.
    let pointerX = -9999;
    let pointerY = -9999;
    let frame = 0;
    let visible = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: offsetX + col * SPACING,
            y: offsetY + row * SPACING,
            phase: (col + row) * 0.45,
          });
        }
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const swell = reduced ? 0 : time / 1400;

      for (const dot of dots) {
        // 0 at the edge of the cursor's reach, 1 directly under it.
        const dx = dot.x - pointerX;
        const dy = dot.y - pointerY;
        const distance = Math.hypot(dx, dy);
        const near = distance < REACH ? 1 - distance / REACH : 0;
        const pull = near * near;

        const breath = reduced ? 0 : (Math.sin(swell + dot.phase) + 1) / 2;
        const radius = BASE_RADIUS + breath * 0.5 + (PEAK_RADIUS - BASE_RADIUS) * pull;
        const alpha = BASE_ALPHA + breath * 0.05 + (PEAK_ALPHA - BASE_ALPHA) * pull;

        // Lean away from the cursor rather than scatter, so the grid stays legible.
        const lean = pull * PUSH;
        const x = distance > 0 ? dot.x + (dx / distance) * lean : dot.x;
        const y = distance > 0 ? dot.y + (dy / distance) * lean : dot.y;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointerX = -9999;
      pointerY = -9999;
    };

    build();
    frame = requestAnimationFrame(loop);

    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(canvas);

    // Nothing is worth animating while the section is off screen.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
