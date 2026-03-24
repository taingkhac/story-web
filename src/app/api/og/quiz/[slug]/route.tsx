import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { searchParams } = new URL(request.url)
    const score = searchParams.get('score')
    const total = searchParams.get('total')
    const title = searchParams.get('title') || 'NovaLore Quiz'
    const imageUrl = searchParams.get('image')

    // Optional: Fetch custom fonts if needed, built-in sans-serif is usually OK for simple mockups

    if (!score || !total) {
        return new Response('Missing score or total parameters', { status: 400 })
    }

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
                    backgroundColor: '#18181b',
                    backgroundImage: imageUrl && imageUrl !== 'null' ? `url(${imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay for readability */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        zIndex: 10,
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 'bold',
                            color: '#5eead4', // teal-300
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            marginBottom: 20,
                        }}
                    >
                        {title}
                    </div>
                    
                    <div
                        style={{
                            display: 'flex',
                            fontSize: 110,
                            fontWeight: '900',
                            color: 'white',
                            marginBottom: 20,
                            lineHeight: 1,
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        }}
                    >
                        I scored {score}/{total}!
                    </div>
                    
                    <div
                        style={{
                            fontSize: 40,
                            fontWeight: 'bold',
                            color: '#d4d4d8', // zinc-300
                        }}
                    >
                        Can you beat my score?
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        right: 40,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 28,
                        fontWeight: '900',
                        color: 'white',
                        letterSpacing: '3px',
                    }}
                >
                    NOVALORE
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
