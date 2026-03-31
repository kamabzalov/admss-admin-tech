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
    company_name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    dealer_type: string;
    source: string;
}

export interface LeadsListResponse {
    leads: Lead[];
    count?: number;
    total: number;
}
