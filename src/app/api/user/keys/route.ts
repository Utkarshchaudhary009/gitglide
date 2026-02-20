import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { encrypt, decrypt } from '@/lib/security/encryption'

type Provider = 'jules' | 'vercel'

const FIELD_MAP: Record<Provider, 'julesApiKey' | 'vercelToken'> = {
    jules: 'julesApiKey',
    vercel: 'vercelToken',
}

function mask(key: string): string {
    if (key.length <= 4) return '****'
    return key.slice(0, 4) + '••••••••••••'
}

export async function GET() {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const settings = await prisma.userSettings.findUnique({
            where: { clerkUserId: userId },
            select: { julesApiKey: true, vercelToken: true },
        })

        const providers: Record<Provider, { isSet: boolean; masked: string | null }> = {
            jules: { isSet: false, masked: null },
            vercel: { isSet: false, masked: null },
        }

        if (settings?.julesApiKey) {
            try {
                const decrypted = decrypt(settings.julesApiKey)
                providers.jules = { isSet: true, masked: mask(decrypted) }
            } catch {
                providers.jules = { isSet: true, masked: '••••••••' }
            }
        }

        if (settings?.vercelToken) {
            try {
                const decrypted = decrypt(settings.vercelToken)
                providers.vercel = { isSet: true, masked: mask(decrypted) }
            } catch {
                providers.vercel = { isSet: true, masked: '••••••••' }
            }
        }

        return NextResponse.json({ providers })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { provider: Provider; key: string }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { provider, key } = body

    if (!provider || !FIELD_MAP[provider]) {
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    if (!key || typeof key !== 'string' || !key.trim()) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    try {
        const encrypted = encrypt(key.trim())
        const field = FIELD_MAP[provider]

        await prisma.userSettings.upsert({
            where: { clerkUserId: userId },
            update: { [field]: encrypted },
            create: { clerkUserId: userId, [field]: encrypted },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider') as Provider | null

    if (!provider || !FIELD_MAP[provider]) {
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    try {
        const field = FIELD_MAP[provider]
        await prisma.userSettings.upsert({
            where: { clerkUserId: userId },
            update: { [field]: null },
            create: { clerkUserId: userId },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
