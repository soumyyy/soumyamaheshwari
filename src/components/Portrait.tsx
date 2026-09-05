import Image from "next/image";

export default function Portrait() {
    return (
        <div className="relative w-52 md:w-full md:max-w-[300px]">
            <Image
                src="/portrait-wide.webp"
                alt="Soumya Maheshwari"
                width={560}
                height={700}
                sizes="(min-width: 768px) 300px, 208px"
                className="w-full select-none contrast-[1.06] saturate-[1.08] brightness-[1.05]"
                style={{
                    // The frame is 4:5, so an ellipse at half its width and half its
                    // height inscribes it exactly: a portrait oval that reaches every
                    // edge and only has the four corners left over to dissolve. It
                    // holds solid to 82%, so almost the whole photograph is untouched
                    // and the fade is a soft outer band, not a spotlight on the face.
                    maskImage:
                        "radial-gradient(ellipse 50% 50% at 50% 50%, #000 82%, rgb(0 0 0 / 55%) 93%, transparent 100%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 50% 50% at 50% 50%, #000 82%, rgb(0 0 0 / 55%) 93%, transparent 100%)",
                }}
            />
        </div>
    );
}
