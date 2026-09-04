import Image from "next/image";

export default function Portrait() {
    return (
        <div className="relative w-40 md:w-full md:max-w-[220px]">
            <Image
                src="/soumya.png"
                alt="Soumya Maheshwari"
                width={700}
                height={688}
                sizes="(min-width: 768px) 220px, 160px"
                className="w-full select-none grayscale-[0.35] contrast-[1.05]"
                style={{
                    // Dissolves the cutout edge so the matting fringe never meets the black ground.
                    maskImage:
                        "radial-gradient(ellipse 68% 72% at 50% 42%, #000 52%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 68% 72% at 50% 42%, #000 52%, transparent 100%)",
                }}
            />
        </div>
    );
}
