"use client";

import { useEffect, useRef } from "react";
import { ellipsePoint, keplerStep, gravityDisplace, makeStars, type Point } from "@/lib/orbit";

const ROTATION = (-10 * Math.PI) / 180;
const STARS = makeStars(28, 20260904);
const SAMPLES = 220;
const PULL_STRENGTH = 70;
const PULL_RADIUS = 320;

export default function OrbitField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursor = useRef<Point | null>(null);
    const eased = useRef<Point | null>(null);
    const theta = useRef(0);
    const raf = useRef<number | null>(null);
    const boost = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const iss = new Image();
        iss.src = "/ISS.svg";

        let w = 0;
        let h = 0;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            w = rect.width;
            h = rect.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        /** Local ellipse space -> screen space. */
        const toScreen = (p: Point): Point => ({
            x: w / 2 + (p.x * Math.cos(ROTATION) - p.y * Math.sin(ROTATION)),
            y: h / 2 + (p.x * Math.sin(ROTATION) + p.y * Math.cos(ROTATION)),
        });

        const draw = () => {
            const a = w * 0.42;
            const b = h * 0.3;
            const c = eased.current;

            ctx.clearRect(0, 0, w, h);

            // starfield. density triples while the Konami boost is active
            ctx.save();
            ctx.fillStyle = "#fff";
            const density = boost.current ? 3 : 1;
            for (const s of STARS) {
                for (let d = 0; d < density; d++) {
                    ctx.globalAlpha = s.o / (d + 1);
                    ctx.beginPath();
                    ctx.arc(((s.x + d * 0.31) % 1) * w, ((s.y + d * 0.47) % 1) * h, s.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.restore();

            // warped orbit path
            ctx.save();
            ctx.strokeStyle = "rgba(160,160,160,0.5)";
            ctx.lineWidth = 0.6;
            ctx.setLineDash([10, 20]);
            ctx.beginPath();
            for (let i = 0; i <= SAMPLES; i++) {
                const t = (i / SAMPLES) * Math.PI * 2;
                const p = gravityDisplace(toScreen(ellipsePoint(a, b, t)), c, PULL_STRENGTH, PULL_RADIUS);
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            // satellite, oriented to the (warped) path tangent
            const here = gravityDisplace(toScreen(ellipsePoint(a, b, theta.current)), c, PULL_STRENGTH, PULL_RADIUS);
            const ahead = gravityDisplace(
                toScreen(ellipsePoint(a, b, theta.current + 0.02)),
                c, PULL_STRENGTH, PULL_RADIUS,
            );
            const angle = Math.atan2(ahead.y - here.y, ahead.x - here.x);

            if (iss.complete && iss.naturalWidth > 0) {
                ctx.save();
                ctx.globalAlpha = 0.85;
                ctx.translate(here.x, here.y);
                ctx.rotate(angle);
                ctx.drawImage(iss, -40, -40, 80, 80);
                ctx.restore();
            }
        };

        resize();

        if (reduced) {
            // Static frame only. No rAF loop is ever scheduled.
            iss.onload = draw;
            draw();
            const onResizeStatic = () => { resize(); draw(); };
            window.addEventListener("resize", onResizeStatic);
            return () => window.removeEventListener("resize", onResizeStatic);
        }

        let last = performance.now();
        let running = true;

        const frame = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;

            const a = w * 0.42;
            const b = h * 0.3;
            theta.current = keplerStep(theta.current, a, b, dt, boost.current ? 0.44 : 0.11) % (Math.PI * 2);

            // ease the cursor so the path bends instead of snapping
            const target = cursor.current;
            if (target) {
                eased.current = eased.current
                    ? {
                        x: eased.current.x + (target.x - eased.current.x) * 0.12,
                        y: eased.current.y + (target.y - eased.current.y) * 0.12,
                    }
                    : target;
            } else if (eased.current) {
                eased.current = null;
            }

            draw();
            if (running) raf.current = requestAnimationFrame(frame);
        };

        const start = () => {
            if (running || reduced) return;
            running = true;
            last = performance.now();
            raf.current = requestAnimationFrame(frame);
        };
        const stop = () => {
            running = false;
            if (raf.current !== null) cancelAnimationFrame(raf.current);
            raf.current = null;
        };

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            cursor.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const onLeave = () => { cursor.current = null; };
        const onVisibility = () => (document.hidden ? stop() : start());
        const onBoost = (e: Event) => { boost.current = (e as CustomEvent<boolean>).detail; };

        const io = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? start() : stop()),
            { threshold: 0 },
        );
        io.observe(canvas);

        window.addEventListener("resize", resize);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("orbit:boost", onBoost);
        raf.current = requestAnimationFrame(frame);

        return () => {
            stop();
            io.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
            window.removeEventListener("orbit:boost", onBoost);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        />
    );
}
