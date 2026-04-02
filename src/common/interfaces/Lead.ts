export type LeadStatusApi =
    | 'submitted'
    | 'in_review'
    | 'approved'
    | 'rejected'
    | 'closed'
    | 'converted';

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
    dealer_type?: string;
    referral_code?: string;
    notes?: string;
    recaptcha_verified?: boolean;
}

export interface LeadsListResponse {
    leads: Lead[];
    count?: number;
    total: number;
}
