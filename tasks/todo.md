# Redesign: black, reactor, fewer projects up front

## Direction

- **The hook:** an eclipse and an arc reactor are the same shape, a ring of light round a dark disc. The site's one motif is that ring. It reads as a reactor without quoting Iron Man: no HUD chrome, no red and gold, no fake telemetry.
- **Palette:** pure black, the existing warm off-white for text, one accent (cold reactor blue-white) used only for light. The cream paper section goes.
- **Kept from the current site:** Zodiak display, Commit Mono small-caps labels, Instrument Sans body, all-lowercase voice, the "who it was for" framing, film grain.
- **Reference (indra's site, x.com/IndraVahan/status/2120232633288568995):** black page, mono type, every picture drawn in characters by one canvas, text that assembles out of scattered glyphs between sections, a small top nav, a "fig." caption under each plate, a subpage explaining how it is drawn. Taking the technique and the restraint, not the subject: his plates are renaissance paintings, mine are my own things.
- **Motion, in order of weight:**
  1. One glyph canvas for the whole site. The hero plate is the reactor, drawn in characters: rings, a segmented coil, a core that ignites on load. It turns slowly and the glyphs near the cursor brighten and scatter.
  2. Each section has its own plate drawn the same way: the eclipse corona for eclipse, the real poster or screenshot for each project (glyphs on arrival, resolving to the actual image or video on hover or tap), the portrait for the intro.
  3. Between sections the plate breaks into loose glyphs that drift and reform as the next one, and headings assemble out of them.
  4. Page changes: a project's plate carries across into its subpage header (View Transitions).
- **Speed rules:** one canvas, one rAF loop, paused when off screen or the tab is hidden; glyph atlas built once; plates sampled from tiny (about 160px wide) images so the page ships a few KB per plate; no three.js; drop framer-motion; videos load on click; everything statically generated; `prefers-reduced-motion` gets still plates and no drift.

## Structure

- `/` hero, short intro, eclipse as the centrepiece, four featured projects, a link to everything, experience, github grid, education, footer.
- `/work` the full index, all 17, grouped by who they were for, one line each.
- `/work/[slug]` one page per project: who, the problem paragraphs, a longer write-up, stack, shots or video, links, next project.
- `/work/eclipse` gets the five-attempt lineage as its own long page, drawing on the four eclipse readmes.
- `/demo/[id]` stays working (existing links), restyled.

## Review

Done:
- Black site, one accent (reactor blue-white). Paper section, framer-motion and lucide-react removed.
- `Plate`: every picture is drawn in characters on a canvas. Procedural plates (reactor, corona, chart, fulcrum, receipt, sigil, noise) live in `src/lib/plates.ts`; photographs sit dimmed under their own characters and come up on hover.
- Homepage: reactor hero, intro, eclipse with its mark, a wall of six screens (five projects plus the attic). On a phone the wall is a list of six short rows.
- `/work` index of all 16, `/work/[slug]` for each, with longer text from the readmes in `src/data/work.ts`.
- 404, new favicon, name carries between list and page (view transitions).
- Eclipse demo removed from the data. `public/demo/EclipseDemo.mp4` is still on disk.

Changed from the plan:
- Long alternating project rows became the wall of screens, after "takes too much space".
- The lineage list left the homepage; it is on `/work/eclipse`.
- Eclipse uses the supplied logo, small, rather than the corona. The corona is on the 404.
- No scatter between plates as one continuous canvas; each plate assembles and disperses on its own as it enters and leaves.

Not done:
- `opengraph-image.png` still shows the old hero.
- billinsight and room have no readme, so their pages carry only the existing three paragraphs.
- shit's short copy says nothing leaves the phone; its readme describes a small supabase backend. The long copy follows the readme. The short copy is unchanged.

Verified: tsc, eslint on changed files, vitest (15 pass), production build (all routes static). Screenshots checked for home, phone and wall; the last two size changes (reactor, eclipse mark) were built but not looked at.
