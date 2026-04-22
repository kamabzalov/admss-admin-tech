import { LOC_STORAGE_USER } from 'common/app-consts';

export function getToken(): string | null {
    const userLocalStorage = localStorage.getItem(LOC_STORAGE_USER);

    return !!userLocalStorage ? JSON.parse(userLocalStorage)?.token : null;
}

export const isEmptyValue = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
};

export const toStringOrEmpty = (value: unknown): string => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return String(value);
};

export const trimToUndefined = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed || undefined;
};

export const humanizeSnakeCase = (value: string): string =>
    value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char, index) => (index === 0 ? char.toUpperCase() : char));
