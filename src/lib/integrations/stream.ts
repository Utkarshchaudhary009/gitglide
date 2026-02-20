export function createStreamMessage(type: string, data: Record<string, unknown>): string {
    return JSON.stringify({ type, ...data }) + '\n'
}
