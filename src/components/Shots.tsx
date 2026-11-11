import styles from "./Shots.module.css";

/* A real screenshot standing in a tile's screen instead of a drawn plate. Two
   devices rise from the bottom edge, cropped by the glass, and drift apart a
   little when the tile is hovered. */

export type Shot = { src: string; kind: "phone" | "card" | "screen"; alt: string };

export default function Shots({ shots }: { shots: [Shot] | [Shot, Shot] }) {
  return (
    <div className={styles.stage}>
      <div className={styles.glow} aria-hidden="true" />
      {shots.map((shot, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" decoding="async"
          data-pos={shots.length === 1 ? "only" : i === 0 ? "first" : "second"}
          className={`${styles.device} ${styles[shot.kind]} ${shots.length === 1 ? styles.only : i === 0 ? styles.first : styles.second}`} />
      ))}
    </div>
  );
}
