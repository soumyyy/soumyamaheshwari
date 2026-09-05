"use client";

import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import VideoLightbox from "./VideoLightbox";
import styles from "./ProjectEntry.module.css";

// A shared disclosure store keeps panels exclusive across server-rendered groups.
let activePanel: string | null = null;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function setActivePanel(id: string | null) {
  activePanel = id;
  listeners.forEach((listener) => listener());
}
const getActivePanel = () => activePanel;
const getServerPanel = () => null;

type PreviewProps = { name: string; video?: string; poster?: string };
type EntryProps = PreviewProps & {
  previewOnly?: false;
  id: string;
  number: number;
  heading: ReactNode;
  github?: string;
  liveUrl?: string;
  subtitle: ReactNode;
  summary: ReactNode;
  credit: ReactNode;
  children: ReactNode;
};
type Props = EntryProps | (PreviewProps & { previewOnly: true });

export default function ProjectEntry(props: Props) {
  const id = props.previewOnly ? null : props.id;
  const open = useSyncExternalStore(subscribe, getActivePanel, getServerPanel) === id && id !== null;
  const [canHover, setCanHover] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const focusPanel = useRef(false);

  const clearTimers = useCallback(() => {
    if (openTimer.current !== null) clearTimeout(openTimer.current);
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    openTimer.current = closeTimer.current = null;
  }, []);

  const close = useCallback(() => {
    clearTimers();
    if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    if (id !== null && activePanel === id) setActivePanel(null);
  }, [clearTimers, id]);

  useEffect(() => {
    if (id === null) return;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktop = window.matchMedia("(min-width: 820px)");
    const update = () => {
      setCanHover(pointer.matches && desktop.matches);
      close();
    };
    // Initialize after hydration; media queries are never read during render.
    const frame = requestAnimationFrame(update);
    pointer.addEventListener("change", update);
    desktop.addEventListener("change", update);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      pointer.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("keydown", onKey);
      clearTimers();
      if (activePanel === id) setActivePanel(null);
    };
  }, [clearTimers, close, id]);

  // Scrolling closes the panel only where the panel floats over the entry and
  // would otherwise drift away from what it belongs to. On touch it sits in
  // the flow, so closing it on scroll would shut it the moment anyone tried
  // to read past the first line.
  useEffect(() => {
    if (!canHover || id === null) return;
    document.addEventListener("scroll", close, { passive: true });
    return () => document.removeEventListener("scroll", close);
  }, [canHover, close, id]);

  useEffect(() => {
    if (open && focusPanel.current) closeRef.current?.focus();
    if (!open && panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    focusPanel.current = false;
  }, [open]);

  // On touch the panel opens in the flow below the fold as often as not, so
  // the tap appears to do nothing. Bring it into view.
  useEffect(() => {
    if (!open || canHover) return;
    const panel = panelRef.current;
    if (!panel) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      panel.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : "auto" });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, canHover]);

  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const preview = props.video && props.poster ? (
    <>
      <button
        type="button"
        className={styles.preview}
        aria-label={`Play ${props.name} demo`}
        onClick={() => { close(); setVideoOpen(true); }}
      >
        <Image src={props.poster} alt="" width={92} height={52} sizes="92px" />
        <span aria-hidden="true" className={styles.play}>▶</span>
      </button>
      <VideoLightbox src={props.video} open={videoOpen} onClose={closeVideo} />
    </>
  ) : null;

  if (props.previewOnly) return preview;

  const panelId = `project-${props.id}-details`;
  return (
    <article
      id={`project-${props.id}`}
      className={styles.entry}
      data-open={open}
      onMouseEnter={canHover ? () => {
        clearTimers();
        if (!videoOpen) openTimer.current = setTimeout(() => setActivePanel(props.id), 120);
      } : undefined}
      onMouseLeave={canHover ? () => {
        clearTimers();
        closeTimer.current = setTimeout(close, 80);
      } : undefined}
    >
      <div className={styles.markers}>
        <span className={styles.number}>{String(props.number).padStart(2, "0")}</span>
        {preview}
      </div>
      <div className={styles.nameRow}>
        <h3 id={`project-${props.id}-name`} className={styles.name}>{props.heading}</h3>
        <span className={styles.links}>
          {props.github && (
            <a href={props.github} target="_blank" rel="noopener noreferrer"
               aria-label={`${props.name} source on GitHub`} className={styles.iconLink}>
              <Github aria-hidden="true" />
            </a>
          )}
          {props.liveUrl && (
            <a href={props.liveUrl} target="_blank" rel="noopener noreferrer"
               aria-label={`${props.name} live site`} className={styles.iconLink}>
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </span>
      </div>
      <div className={styles.whoRow}>
        <p className={styles.who}>{props.subtitle}</p>
        <button
          ref={triggerRef}
          type="button"
          className={styles.disclosure}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            clearTimers();
            if (open) close();
            else { focusPanel.current = true; setActivePanel(props.id); }
          }}
        >
          <span className={styles.srOnly}>{open ? "hide the detail" : "read the detail"}</span>
          <span aria-hidden="true">{open ? "↑" : "↓"}</span>
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.summary}>{props.summary}</p>
        <div className={styles.credit}>{props.credit}</div>
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={`project-${props.id}-name`}
          hidden={!open}
          className={styles.panel}
        >
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close" onClick={close}>✕</button>
          {props.children}
        </div>
      </div>
    </article>
  );
}
