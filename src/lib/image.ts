/* A URL for Next's image optimiser: the file resized to `width` and re-encoded
   (webp or avif, whichever the browser takes). Widths must be one of Next's
   configured sizes. */
export const optimised = (src: string, width: number, quality = 75) =>
    `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
