import { fetchApiData } from 'common/api/fetchAPI';
import { LeadStatusApi, LeadsListResponse } from 'common/interfaces/Lead';

interface GetLeadsParams {
    top?: number;
    skip?: number;
    status?: LeadStatusApi;
}

const leadStatusToCode: Record<LeadStatusApi, number> = {
    submitted: 0,
    in_review: 1,
    approved: 2,
    rejected: 3,
    closed: 4,
    converted: 5,
};

const buildLeadsQuery = ({ top, skip, status }: GetLeadsParams): string => {
    const query = new URLSearchParams();

    if (typeof top === 'number') {
        query.set('top', String(top));
    }
    if (typeof skip === 'number') {
        query.set('skip', String(skip));
    }
    if (status) {
        query.set('status', String(leadStatusToCode[status]));
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
};

export const getLeads = (params: GetLeadsParams): Promise<LeadsListResponse> => {
    return fetchApiData<LeadsListResponse>('GET', `lead${buildLeadsQuery(params)}`);
};

export const updateLeadStatus = (
    leaduid: string,
    status: LeadStatusApi
): Promise<{ id: string; lead_status: LeadStatusApi }> => {
    return fetchApiData<{ id: string; lead_status: LeadStatusApi }>(
        'PATCH',
        `lead/${leaduid}/review`,
        {
            data: { status },
        }
    );
};

interface ConvertLeadPayload {
    admin_username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    company_name?: string;
    company_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    dealer_type?: string;
    referral_code?: string;
    notes?: string;
}

export const convertLead = (
    leaduid: string,
    data?: ConvertLeadPayload
): Promise<{
    dealer_id: string;
    id: string;
    admin_username: string;
    admin_email: string;
    admin_useruid: string;
    temporary_password: string;
}> => {
    return fetchApiData<{
        dealer_id: string;
        id: string;
        admin_username: string;
        admin_email: string;
        admin_useruid: string;
        temporary_password: string;
    }>('PATCH', `lead/${leaduid}/convert`, { data });
};

export const deleteLead = (leaduid: string): Promise<{ id: string }> => {
    return fetchApiData<{ id: string }>('DELETE', `lead/${leaduid}`);
};
