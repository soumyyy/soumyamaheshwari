import Image from "next/image";

export default function Portrait() {
    return (
        <div className="relative w-52 md:w-full md:max-w-[300px]">
            <Image
                src="/portrait-oval.webp"
                alt="Soumya Maheshwari"
                width={448}
                height={560}
                sizes="(min-width: 768px) 300px, 208px"
                className="w-full select-none grayscale-[0.35] contrast-[1.05]"
                style={{
                    // The frame is 4:5, so an ellipse at half its width and half its
                    // height inscribes it exactly: a portrait oval that reaches every
                    // edge and only has the four corners left over to dissolve. It
                    // holds solid to 68% so the face and shoulders are untouched and
                    // the fade is spent entirely on meeting the background.
                    maskImage:
                        "radial-gradient(ellipse 50% 50% at 50% 50%, #000 68%, rgb(0 0 0 / 72%) 86%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 50% 50% at 50% 50%, #000 68%, rgb(0 0 0 / 72%) 86%, transparent 100%)",
                }}
            />
        </div>
    );
}
