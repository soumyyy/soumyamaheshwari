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
                    backgroundColor: '#000000',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Text */}
                <div
                    style={{
                        position: 'absolute',
                        fontSize: 200,
                        fontWeight: 900,
                        color: '#111',
                        transform: 'rotate(-10deg)',
                        zIndex: 0,
                    }}
                >
                    soumysphere
                </div>

                <div style={{ display: 'flex', alignItems: 'center', zIndex: 10 }}>
                    <h1 style={{ fontSize: 130, margin: 0, fontWeight: 'bold', letterSpacing: '-0.05em' }}>
                        Hello.
                    </h1>
                </div>

                <div style={{ display: 'flex', marginTop: 40, zIndex: 10 }}>
                    <div style={{ fontSize: 40, color: '#888' }}>
                        I build cool stuff, break them, fix them along the way.
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
