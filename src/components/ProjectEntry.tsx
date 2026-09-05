"use client";

import Image from "next/image";
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
    document.addEventListener("scroll", close, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      pointer.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("scroll", close);
      clearTimers();
      if (activePanel === id) setActivePanel(null);
    };
  }, [clearTimers, close, id]);

  useEffect(() => {
    if (open && focusPanel.current) closeRef.current?.focus();
    if (!open && panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    focusPanel.current = false;
  }, [open]);

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
      <h3 id={`project-${props.id}-name`} className={styles.name}>{props.heading}</h3>
      <p className={styles.who}>{props.subtitle}</p>
      <div className={styles.body}>
        <p className={styles.summary}>{props.summary}</p>
        <div className={styles.credit}>{props.credit}</div>
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
          <span className={styles.srOnly}>what i built</span>
          <span aria-hidden="true">↓</span>
        </button>
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
