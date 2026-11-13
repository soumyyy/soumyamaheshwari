"use client";

import { useEffect, useRef } from "react";
import { PLATES, RAMP, glyphFor, hash, type PlateKind } from "@/lib/plates";
import styles from "./Plate.module.css";
import { optimised } from "@/lib/image";

/* One picture, drawn in characters.

   A plate is either procedural (the reactor, the eclipse, the small figures) or
   sampled from an image. Either way it is a grid of cells, each with a
   brightness, and the canvas draws one glyph per cell.

   Cost is the whole design constraint here:
   - the loop only runs while the plate is on screen and the tab is visible
   - it draws at 30fps, which is the right cadence for characters anyway
   - an image plate that has finished assembling and has no cursor near it
     stops drawing entirely until something changes
   - an image is sampled from a ~256px rendition, never the full file */

type Props = {
    kind: PlateKind | "image";
    /** Image plates only. */
    src?: string;
    /** Shown instead of the glyphs on hover or focus. Defaults to `src`. */
    reveal?: boolean;
    seed?: number;
    /** Accessible description of what the plate depicts. */
    label: string;
    /** Assemble on a timer from page load instead of from scroll position. */
    boot?: boolean;
    /** Glyph size in css pixels. */
    size?: number;
    /** Tint: the parchment accent, the reactor blue, or the neutral off-white used for photographs. */
    tone?: "light" | "paper" | "reactor";
    /** How the image is fitted into the plate. */
    fit?: "cover" | "contain";
    /** Where a cropped image is anchored horizontally, 0 (left) to 1 (right). */
    focus?: number;
    className?: string;
};

const TONES = {
    light: { base: "#e3d5b8", hot: "#f4eddd" },
    reactor: { base: "#9fdcff", hot: "#f2fbff" },
    paper: { base: "#d9d6cf", hot: "#ffffff" },
};

const FRAME_MS = 1000 / 30;
const OVERSCAN = 0.14; // the canvas extends past the plate so scattered glyphs are not clipped
const CURSOR_RADIUS = 110;

export default function Plate({
    kind, src, reveal = true, seed = 1, label, boot = false, size = 9, tone = "light", fit = "cover", focus = 0.5, className,
}: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const colours = TONES[tone];
        const fn = kind === "image" ? null : PLATES[kind];

        // Set in layout(): a small plate gets smaller characters, so a thumbnail
        // still has enough cells to hold a shape.
        let glyph = size, cellW = size * 0.62, cellH = size * 1.18, thumb = false;

        let cols = 0, rows = 0, width = 0, height = 0, padX = 0, padY = 0;
        let offX = new Float32Array(0), offY = new Float32Array(0), delay = new Float32Array(0);
        let base: Float32Array | null = null; // image brightness per cell
        let image: HTMLImageElement | null = null;

        let visible = false;
        let raf = 0;
        let last = 0;
        let started = 0;
        let lastP = -1;
        let dirty = true;
        let boosted = false;
        let spin = 0;
        let lastScroll = window.scrollY;
        let cursorX = -9999, cursorY = -9999, cursorActive = false;

        const sample = () => {
            if (!image || cols === 0) return;
            const off = document.createElement("canvas");
            off.width = cols;
            off.height = rows;
            const o = off.getContext("2d", { willReadFrequently: true });
            if (!o) return;
            // Fit in pixel space, then squash into the cell grid.
            const scale = fit === "cover"
                ? Math.max(width / image.naturalWidth, height / image.naturalHeight)
                : Math.min(width / image.naturalWidth, height / image.naturalHeight);
            const dw = (image.naturalWidth * scale) / cellW;
            const dh = (image.naturalHeight * scale) / cellH;
            o.drawImage(image, (cols - dw) * focus, (rows - dh) / 2, dw, dh);
            const data = o.getImageData(0, 0, cols, rows).data;
            const out = new Float32Array(cols * rows);
            const sorted: number[] = [];
            for (let i = 0; i < out.length; i++) {
                const alpha = data[i * 4 + 3] / 255;
                out[i] = alpha === 0 ? -1 : (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
                if (alpha > 0) sorted.push(out[i]);
            }
            // Stretch to the image's own range. A dark screenshot and a bright
            // photograph should both use the whole ramp of characters.
            sorted.sort((a, b) => a - b);
            const low = sorted[Math.floor(sorted.length * 0.04)] ?? 0;
            const high = sorted[Math.floor(sorted.length * 0.97)] ?? 1;
            const span = Math.max(0.08, high - low);
            for (let i = 0; i < out.length; i++) {
                out[i] = out[i] < 0 ? 0 : Math.pow(Math.min(1, Math.max(0, (out[i] - low) / span)), 0.85);
            }
            base = out;
            dirty = true;
        };

        const layout = () => {
            const rect = wrap.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            if (width === 0 || height === 0) return;
            glyph = Math.min(size, Math.max(4.5, width / 30));
            thumb = glyph < size;
            cellW = glyph * 0.62;
            cellH = glyph * 1.18;
            padX = width * OVERSCAN;
            padY = height * OVERSCAN;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round((width + padX * 2) * dpr);
            canvas.height = Math.round((height + padY * 2) * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.font = `${glyph}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-mono") || "monospace"}`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            cols = Math.max(1, Math.floor(width / cellW));
            rows = Math.max(1, Math.floor(height / cellH));
            const n = cols * rows;
            offX = new Float32Array(n);
            offY = new Float32Array(n);
            delay = new Float32Array(n);
            for (let i = 0; i < n; i++) {
                const angle = hash(i * 3 + seed) * Math.PI * 2;
                const reach = 30 + hash(i * 3 + 1 + seed) * Math.min(padX, padY) * 1.6;
                offX[i] = Math.cos(angle) * reach;
                offY[i] = Math.sin(angle) * reach;
                delay[i] = hash(i * 3 + 2 + seed);
            }
            sample();
            dirty = true;
        };

        /** 0 when the plate is loose glyphs, 1 when it has fully assembled. */
        const progress = (now: number) => {
            if (reduced) return 1;
            const rect = wrap.getBoundingClientRect();
            const vh = window.innerHeight;
            const leaving = Math.min(1, Math.max(0, (rect.bottom - vh * 0.04) / (vh * 0.32)));
            if (boot) return Math.min(leaving, Math.min(1, (now - started) / 1400));
            const entering = Math.min(1, Math.max(0, (vh * 1.02 - rect.top) / (vh * 0.24)));
            return Math.min(entering, leaving);
        };

        const draw = (now: number) => {
            const p = progress(now);
            const animated = fn !== null && !reduced;
            if (!animated && !dirty && !cursorActive && p === lastP) return;
            lastP = p;
            dirty = false;

            ctx.clearRect(0, 0, width + padX * 2, height + padY * 2);
            if (p <= 0) return;

            // Scrolling winds a drawn plate forward, so the page answers a thumb
            // the way it answers a cursor.
            const scrollY = window.scrollY;
            spin += Math.min(60, Math.abs(scrollY - lastScroll)) * 0.012;
            lastScroll = scrollY;
            const t = reduced ? 8 : (now - started) / 1000 * (boosted ? 7 : 1) + spin;
            const bootP = boot && !reduced ? Math.min(1, (now - started) / 1600) : 1;
            const half = Math.min(width, height) / 2;
            const shimmerTick = Math.floor(now / 140);
            let style = "";

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const i = row * cols + col;
                    const homeX = (col + 0.5) * cellW + (width - cols * cellW) / 2;
                    const homeY = (row + 0.5) * cellH + (height - rows * cellH) / 2;

                    let v: number;
                    if (fn) {
                        const u = (homeX - width / 2) / half;
                        const w = (homeY - height / 2) / half;
                        v = fn(u, w, t, seed, bootP);
                        // On a scaled-down plate a thin line can fall between cell
                        // centres and vanish. Take the brightest of a few points
                        // inside the cell instead of the centre alone.
                        if (thumb) {
                            const du = cellW / 3 / half;
                            const dw = cellH / 3 / half;
                            v = Math.max(v, fn(u, w - dw, t, seed, bootP), fn(u, w + dw, t, seed, bootP),
                                fn(u - du, w, t, seed, bootP), fn(u + du, w, t, seed, bootP));
                        }
                    } else v = base ? base[i] : 0;
                    if (v < 0.07) continue;

                    // Each cell arrives on its own schedule, so the plate condenses rather than fades.
                    const local = Math.min(1, Math.max(0, (p - delay[i] * 0.55) / 0.45));
                    if (local <= 0) continue;
                    const ease = 1 - Math.pow(1 - local, 3);

                    let x = homeX + offX[i] * (1 - ease);
                    let y = homeY + offY[i] * (1 - ease);
                    // Tone is carried by which character is drawn, so opacity only has to
                    // keep the faint ones from shouting.
                    let alpha = (0.34 + 0.66 * v) * (0.15 + 0.85 * ease);

                    if (cursorActive) {
                        const dx = x - cursorX;
                        const dy = y - cursorY;
                        const dist = Math.hypot(dx, dy);
                        if (dist < CURSOR_RADIUS) {
                            const force = Math.pow(1 - dist / CURSOR_RADIUS, 2);
                            x += (dx / (dist || 1)) * force * 16;
                            y += (dy / (dist || 1)) * force * 16;
                            alpha = Math.min(1, alpha + force * 0.6);
                            v = Math.min(1, v + force * 0.3);
                        }
                    }

                    let char = glyphFor(v);
                    // A few cells in the bright parts keep changing character, so a still plate is never dead.
                    if (animated && v > 0.45 && hash(i * 17 + shimmerTick) < 0.02) {
                        char = RAMP[4 + Math.floor(hash(i + shimmerTick * 3) * (RAMP.length - 4))];
                    }
                    if (local < 1) char = RAMP[1 + Math.floor(hash(i * 5 + Math.floor(local * 6)) * (RAMP.length - 1))];

                    const next = v > 0.9 || boosted ? colours.hot : colours.base;
                    if (next !== style) { ctx.fillStyle = next; style = next; }
                    ctx.globalAlpha = Math.min(1, alpha);
                    ctx.fillText(char, x + padX, y + padY);
                }
            }
            ctx.globalAlpha = 1;
        };

        const frame = (now: number) => {
            raf = 0;
            if (!visible || document.hidden) return;
            if (now - last >= FRAME_MS - 2) {
                last = now;
                draw(now);
            }
            raf = requestAnimationFrame(frame);
        };
        const wake = () => {
            if (reduced) { draw(performance.now()); return; }
            if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
        };

        started = performance.now();
        layout();

        if (kind === "image" && src) {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => { image = img; sample(); wake(); };
            // The optimiser's 256px rendition: a few kilobytes, and more than the grid can resolve.
            img.src = optimised(src, 256);
        }

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) wake();
        }, { rootMargin: "20% 0px" });
        io.observe(wrap);

        const ro = new ResizeObserver(() => { layout(); wake(); });
        ro.observe(wrap);

        const onMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            const rect = wrap.getBoundingClientRect();
            cursorX = event.clientX - rect.left;
            cursorY = event.clientY - rect.top;
            const near = cursorX > -CURSOR_RADIUS && cursorY > -CURSOR_RADIUS &&
                cursorX < width + CURSOR_RADIUS && cursorY < height + CURSOR_RADIUS;
            if (near !== cursorActive) dirty = true;
            cursorActive = near;
        };
        const onBoost = (event: Event) => { boosted = Boolean((event as CustomEvent).detail); dirty = true; };
        const onVisibility = () => wake();

        if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });
        if (kind === "reactor") window.addEventListener("reactor:boost", onBoost);
        document.addEventListener("visibilitychange", onVisibility);
        // The mono face may land after first paint; redraw with it rather than the fallback.
        document.fonts?.ready.then(() => { layout(); wake(); });

        return () => {
            if (raf) cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("reactor:boost", onBoost);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [kind, src, seed, boot, size, tone, fit, focus]);

    return (
        <div
            ref={wrapRef}
            className={`${styles.plate} ${className ?? ""}`}
            role="img"
            aria-label={label}
            data-kind={kind}
        >
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
            {kind === "image" && src && reveal && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.reveal} data-fit={fit} src={optimised(src, 640)} alt="" loading="lazy" decoding="async" draggable={false}
                    style={{ objectPosition: `${focus * 100}% 50%` }} />
            )}
        </div>
    );
}
