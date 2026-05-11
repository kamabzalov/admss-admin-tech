import { DealerStatusApi } from 'common/interfaces/Dealer';

export const DEALER_STATUS_OPTIONS: Array<{ value: DealerStatusApi; label: string }> = [
    { value: 'pre_approved', label: 'Pre-Approved (Trial/Sandbox)' },
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended (read-only)' },
    { value: 'expired', label: 'Expired (blocked)' },
];

export const DEALER_STATUS_BY_CODE: Record<number, DealerStatusApi> = {
    0: 'pre_approved',
    1: 'active',
    2: 'suspended',
    3: 'expired',
};

export const DEALER_STATUS_TO_CODE: Record<DealerStatusApi, number> = {
    pre_approved: 0,
    active: 1,
    suspended: 2,
    expired: 3,
};

export const DEALER_STATUS_BADGE_CLASS: Record<DealerStatusApi, string> = {
    pre_approved: 'badge-light-info',
    active: 'badge-light-success',
    suspended: 'badge-light-warning',
    expired: 'badge-light-danger',
};
