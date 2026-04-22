import { LeadStatusApi } from 'common/interfaces/Lead';

export const STATUS_OPTIONS: Array<{ value: LeadStatusApi; label: string }> = [
    { value: 'submitted', label: 'Submitted' },
    { value: 'in_review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'converted', label: 'Converted' },
    { value: 'closed', label: 'Closed' },
];

export const LEAD_STATUS_BY_CODE: Record<number, LeadStatusApi> = {
    0: 'submitted',
    1: 'in_review',
    2: 'approved',
    3: 'rejected',
    4: 'closed',
    5: 'converted',
};
