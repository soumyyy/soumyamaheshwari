import Image from "next/image";

export default function Portrait() {
    return (
        <div className="relative w-40 md:w-full md:max-w-[220px]">
            <Image
                src="/soumya-portrait.webp"
                alt="Soumya Maheshwari"
                width={560}
                height={560}
                sizes="(min-width: 768px) 220px, 160px"
                className="w-full select-none grayscale-[0.35] contrast-[1.05]"
                style={{
                    // A vignette, not an edge fix: this is a whole photograph rather than a
                    // cutout, so it has content running to all four corners and needs the
                    // fade to start well inside the frame and finish before it.
                    maskImage:
                        "radial-gradient(ellipse 58% 62% at 52% 46%, #000 26%, rgb(0 0 0 / 40%) 56%, transparent 88%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 58% 62% at 52% 46%, #000 26%, rgb(0 0 0 / 40%) 56%, transparent 88%)",
                }}
            />
        </div>
    );
}
