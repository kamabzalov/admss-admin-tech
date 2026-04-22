import { AxiosError } from 'axios';

type ApiErrorPayload = {
    warning?: string;
    error?: string;
    info?: string;
    message?: string;
    status?: string;
};

const extractMessageFromPayload = (payload: unknown): string | undefined => {
    if (!payload) return undefined;
    if (typeof payload === 'string') return payload;
    if (typeof payload !== 'object') return undefined;
    const data = payload as ApiErrorPayload;
    return data.warning || data.info || data.error || data.message;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const nestedData = (error as { data?: unknown })?.data;
    return (
        extractMessageFromPayload(axiosError?.response?.data) ||
        extractMessageFromPayload(nestedData) ||
        extractMessageFromPayload(error) ||
        axiosError?.message ||
        (error as Error)?.message ||
        fallback
    );
};
