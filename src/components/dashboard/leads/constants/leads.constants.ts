import { LeadStatusApi } from 'common/interfaces/Lead';

export enum LeadStatus {
    SUBMITTED = 'submitted',
    IN_REVIEW = 'in_review',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CONVERTED = 'converted',
    CLOSED = 'closed',
}

export const STATUS_OPTIONS: Array<{ value: LeadStatusApi; label: string }> = [
    { value: LeadStatus.SUBMITTED, label: 'Submitted' },
    { value: LeadStatus.IN_REVIEW, label: 'In Review' },
    { value: LeadStatus.APPROVED, label: 'Approved' },
    { value: LeadStatus.REJECTED, label: 'Rejected' },
    { value: LeadStatus.CONVERTED, label: 'Converted' },
    { value: LeadStatus.CLOSED, label: 'Closed' },
];

export const LEAD_STATUS_BY_CODE: Record<number, LeadStatusApi> = {
    0: LeadStatus.SUBMITTED,
    1: LeadStatus.IN_REVIEW,
    2: LeadStatus.APPROVED,
    3: LeadStatus.REJECTED,
    4: LeadStatus.CLOSED,
    5: LeadStatus.CONVERTED,
};

export const LEAD_MESSAGES = {
    STATUS_UPDATED: 'Lead status successfully updated',
    CONVERTED: 'Lead successfully converted',
    DELETED: 'Lead successfully deleted',
    MISSING_REQUIRED_NAMES: 'Lead must have first name and last name before conversion',
    CONVERT_APPROVED_ONLY: 'Lead can be converted only in Approved status',
} as const;
