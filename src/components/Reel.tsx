"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SHOTS, numberOf, ordered, plateFor } from "@/data/work";
import Plate from "./Plate";
import Shots from "./Shots";
import styles from "./Reel.module.css";

/* Every project as one card on a single horizontal strip. Whichever card sits in
   the middle is the live one: it comes forward, the rest recede. Start it on the
   project that is open, or on a chosen one from the landing page. */

export default function Reel({ current, start = "shit" }: { current?: string; start?: string }) {
  const strip = useRef<HTMLUListElement>(null);
  const focus = current ?? start;

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];

    const mark = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;
      for (const card of cards) {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (distance < bestDistance) { best = card; bestDistance = distance; }
      }
      for (const card of cards) card.toggleAttribute("data-active", card === best);
    };

    const target = cards.find((card) => card.dataset.id === focus);
    if (target) el.scrollLeft = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    mark();

    let frame = 0;
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(mark); };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", mark);

    // Mouse: drag to scroll. Touch and trackpad already do it natively.
    let startX = 0, startLeft = 0, dragging = false, moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; el.dataset.drag = ""; }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = () => { dragging = false; delete el.dataset.drag; };
    const swallow = (e: Event) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", swallow, true);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", mark);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", swallow, true);
    };
  }, [focus]);

  return (
    <ul className={styles.strip} ref={strip} aria-label="all projects">
      {ordered.map((project) => {
        const plate = plateFor(project);
        const shots = SHOTS[project.id];
        return (
          <li key={project.id} className={styles.card} data-id={project.id}>
            <Link href={`/work/${project.id}`} className={styles.link} draggable={false}
              aria-current={project.id === current ? "page" : undefined}>
              <div className={styles.screen}>
                {shots ? <Shots shots={shots} /> : (
                  <Plate {...plate} tone={plate.kind === "image" ? "paper" : "light"} size={8} className={styles.plate} />
                )}
              </div>
              <span className={styles.number}>{numberOf(project.id)}</span>
              <span className={styles.name}>{project.name}</span>
              <span className={styles.who}>{project.who}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
