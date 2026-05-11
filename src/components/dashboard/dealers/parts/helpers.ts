import { dealersKeys } from 'common/app-consts';
import { Dealer, DealerStatusApi } from 'common/interfaces/Dealer';
import { humanizeSnakeCase, isEmptyValue, toStringOrEmpty } from 'common/utils';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import {
    DEALER_STATUS_BY_CODE,
    DEALER_STATUS_OPTIONS,
} from 'components/dashboard/dealers/constants/dealers.constants';
import { UpdateDealerPayload } from 'components/dashboard/dealers/dealers.service';

export type EditableField = keyof UpdateDealerPayload;

export const companyFields: EditableField[] = [
    'company_name',
    'company_address',
    'city',
    'state',
    'zip',
    'dealer_type',
    'referral_code',
    'notes',
];

export const contactFields: EditableField[] = [
    'first_name',
    'last_name',
    'email_company',
    'email_contact',
    'phone_office',
    'phone_mobile',
];

export const licenseFields: EditableField[] = ['license_number', 'license_exp_date'];

export const editableFields: EditableField[] = [
    ...companyFields,
    ...contactFields,
    ...licenseFields,
];

export const requiredEditableFields: EditableField[] = ['company_name', 'email_company'];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const inputTypeByFieldKey = (fieldKey: EditableField): string => {
    if (fieldKey === 'email_company' || fieldKey === 'email_contact') return 'email';
    if (fieldKey === 'phone_office' || fieldKey === 'phone_mobile') return 'tel';
    if (fieldKey === 'license_exp_date') return 'date';
    return 'text';
};

const isDateLikeFieldKey = (fieldKey: string): boolean =>
    fieldKey === 'created' ||
    fieldKey === 'updated' ||
    fieldKey === 'verified_at' ||
    fieldKey === 'license_exp_date' ||
    fieldKey.endsWith('_at');

export const formatFieldValue = (fieldKey: string, value: unknown): string => {
    if (isEmptyValue(value)) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (fieldKey === 'is_verified' || fieldKey === 'sandbox_mode') {
        return value ? 'Yes' : 'No';
    }
    if (isDateLikeFieldKey(fieldKey)) return formatServerDateForDisplay(value);
    return String(value);
};

export const buildDraftFromDealer = (dealer: Dealer | null): Record<EditableField, string> => {
    return editableFields.reduce<Record<EditableField, string>>((acc, fieldKey) => {
        acc[fieldKey] = toStringOrEmpty((dealer as unknown as Record<string, unknown>)?.[fieldKey]);
        return acc;
    }, {} as Record<EditableField, string>);
};

export const normalizeStatus = (dealer: Dealer | null): DealerStatusApi => {
    const statusValue = dealer?.dealer_status;
    if (
        typeof statusValue === 'string' &&
        DEALER_STATUS_OPTIONS.some((option) => option.value === statusValue)
    ) {
        return statusValue as DealerStatusApi;
    }
    if (
        typeof dealer?.dealer_status_code === 'number' &&
        DEALER_STATUS_BY_CODE[dealer.dealer_status_code]
    ) {
        return DEALER_STATUS_BY_CODE[dealer.dealer_status_code];
    }
    if (typeof statusValue === 'number' && DEALER_STATUS_BY_CODE[statusValue]) {
        return DEALER_STATUS_BY_CODE[statusValue];
    }
    return 'pre_approved';
};

export const formatStatusLabel = (status: DealerStatusApi): string =>
    DEALER_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

export const getDealerName = (dealer: Dealer | null): string => {
    const name = dealer?.company_name?.trim();
    if (name) return name;
    return 'unknown';
};

export const fieldLabel = (key: string): string => dealersKeys[key] ?? humanizeSnakeCase(key);
