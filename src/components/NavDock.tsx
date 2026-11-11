"use client";

import { useEffect } from "react";

/* On the landing page there is no header to begin with. The name is part of
   the hero, and as the page scrolls it rides up, slides to the corner and
   shrinks until it is the header, with the links fading in around it.

   There is only one name on screen at a time: the fixed one in the nav. The
   copy in the hero is a placeholder that holds the space and says where the
   name starts. While the page is above the docking point the fixed name is
   moved onto the placeholder exactly, so it scrolls like ordinary content. */
export default function NavDock() {
    useEffect(() => {
        const nav = document.querySelector<HTMLElement>("[data-site-nav]");
        const name = nav?.querySelector<HTMLElement>("[data-nav-name]");
        const slot = document.querySelector<HTMLElement>("[data-name-slot]");
        if (!nav || !name || !slot) return;

        let frame = 0;
        let slotTop = 0, slotLeft = 0, scale = 1, baseX = 0, baseY = 0;
        // With scroll-driven animations the browser moves the name itself, in
        // step with the scroll. Script then only measures where it starts.
        const native = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
        if (native) nav.setAttribute("data-native", "");

        const measure = () => {
            const rect = slot.getBoundingClientRect();
            slotTop = rect.top + window.scrollY;
            slotLeft = rect.left;
            // offset* ignore transforms, so these are the name's docked position.
            baseX = name.offsetLeft;
            baseY = name.offsetTop;
            scale = name.offsetHeight ? rect.height / name.offsetHeight : 1;
            nav.style.setProperty("--dx0", `${slotLeft - baseX}px`);
            nav.style.setProperty("--dy0", `${Math.max(1, slotTop - baseY)}px`);
            nav.style.setProperty("--s0", String(scale));
        };

        const update = () => {
            frame = 0;
            const travel = Math.max(1, slotTop - baseY);
            const dy = Math.max(0, slotTop - window.scrollY - baseY);
            const p = 1 - Math.min(1, dy / travel);
            nav.toggleAttribute("data-top", p < 0.8);
            if (native) return;
            const ease = p * p * (3 - 2 * p);
            nav.style.setProperty("--dy", `${dy}px`);
            nav.style.setProperty("--dx", `${(slotLeft - baseX) * (1 - ease)}px`);
            nav.style.setProperty("--s", String(1 + (scale - 1) * (1 - ease)));
            nav.style.setProperty("--p", String(Math.max(0, (p - 0.55) / 0.45)));
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        const remeasure = () => { measure(); schedule(); };

        measure();
        update();
        slot.style.visibility = "hidden";
        nav.setAttribute("data-ready", "");

        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", remeasure);
        document.fonts?.ready.then(remeasure);
        // The hero eases into place over its first second and a half, taking the
        // placeholder with it. Follow it frame by frame until it has settled.
        const started = performance.now();
        let settle = 0;
        const follow = (now: number) => {
            measure();
            update();
            settle = now - started < 1700 ? requestAnimationFrame(follow) : 0;
        };
        settle = requestAnimationFrame(follow);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            if (settle) cancelAnimationFrame(settle);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", remeasure);
            slot.style.visibility = "";
            nav.removeAttribute("data-ready");
            nav.removeAttribute("data-native");
        };
    }, []);

    return null;
}
