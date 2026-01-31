import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Soumya Maheshwari - Portfolio';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#050505', // Deep black
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Subtle Grid or Stars (Dots) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.2,
                        zIndex: 0,
                    }}
                />

                {/* Orbit Graphic */}
                <svg
                    height="1200"
                    width="1200"
                    viewBox="0 0 1000 1000"
                    style={{
                        position: 'absolute',
                        top: '-30%',
                        left: '10%',
                        opacity: 0.3,
                        transform: 'rotate(-10deg)',
                    }}
                >
                    <ellipse cx="500" cy="500" rx="450" ry="200" fill="none" stroke="white" strokeWidth="2" strokeDasharray="20 20" />
                </svg>

                {/* "soumysphere" Watermark */}
                <div
                    style={{
                        position: 'absolute',
                        right: '-100px',
                        bottom: '-50px',
                        fontSize: 180,
                        fontWeight: 900,
                        color: '#111',
                        transform: 'rotate(0deg)', // Keep it horizontal or vertical? Vertical is hard in OG. Let's do horizontal watermark at bottom right.
                        opacity: 0.5,
                        zIndex: 1,
                        letterSpacing: '-0.05em',
                    }}
                >
                    soumysphere
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, textAlign: 'center' }}>
                    <h1 style={{ fontSize: 140, margin: 0, fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1 }}>
                        Hello.
                    </h1>
                    <div style={{ width: '100px', height: '4px', background: 'white', margin: '20px 0', opacity: 0.5, borderRadius: '2px' }} />
                    <div style={{ fontSize: 36, color: '#aaa', maxWidth: '800px', fontWeight: 400, letterSpacing: '-0.02em' }}>
                        I break things, fix them, and build cool stuff along the way.
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
