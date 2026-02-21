import { NextResponse } from "next/server";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

/**
 * Creates a standard JSON error response.
 * @param message The user-facing error message.
 * @param status HTTP status code (default: 500).
 * @param code Optional internal error code for client-side matching.
 * @param details Optional supplementary data (like validation errors).
 */
export function apiError(
    message: string,
    status: number = 500,
    code?: string,
    details?: unknown
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error: {
                message,
                ...(code ? { code } : undefined),
                ...(details !== undefined ? { details } : undefined),
            },
        },
        { status }
    );
}

/**
 * Creates a standard JSON success response.
 * @param data The data payload to return.
 * @param status HTTP status code (default: 200).
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status }
    );
}
