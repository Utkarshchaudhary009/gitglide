export type ApiErrorResponse = {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: unknown;
    };
};

export type ApiSuccessResponse<T> = {
    success: true;
    data: T;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
