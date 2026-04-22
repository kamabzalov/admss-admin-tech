export type LeadStatusApi =
    | 'submitted'
    | 'in_review'
    | 'approved'
    | 'rejected'
    | 'closed'
    | 'converted';

export enum DealerType {
    DISMANTLER = 'dismantler',
    NON_AUTOMOTIVE = 'non_automotive',
    OTHER = 'other',
    REBUILDER = 'rebuilder',
    SCRAPPER = 'scrapper',
    INDIVIDUAL = 'individual',
}

export interface Lead {
    id: string;
    created: string;
    updated?: string;
    status?: string;
    lead_status: LeadStatusApi;
    status_code?: number;
    source?: string;
    source_code?: number;
    source_details?: string;
    company_name?: string;
    company_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    dealer_type?: DealerType;
    referral_code?: string;
    notes?: string;
    recaptcha_verified?: boolean;
    reviewed_by_user_uid?: string;
    reviewed_at?: string;
    review_notes?: string;
    dealer_id?: string;
    converted_at?: string;
    converted_by?: string;
    converted_by_user_uid?: string;
    converted_by_user_id?: string;
    converted_by_username?: string;
    converted_to_dealer_uid?: string;
}

export interface LeadsListResponse {
    leads: Lead[];
    count?: number;
    total: number;
}
