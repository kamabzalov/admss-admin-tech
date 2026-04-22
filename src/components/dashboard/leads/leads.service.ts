import { fetchApiData } from 'common/api/fetchAPI';
import { DealerType, Lead, LeadStatusApi, LeadsListResponse } from 'common/interfaces/Lead';
import { trimToUndefined } from 'common/utils';

interface GetLeadsParams {
    top?: number;
    skip?: number;
    status?: LeadStatusApi | LeadStatusApi[];
}

export interface CreateLeadPayload {
    email: string;
    company_name: string;
    company_address: string;
    city: string;
    state: string;
    zip: string;
    first_name: string;
    last_name: string;
    phone: string;
    dealer_type: DealerType;
    referral_code?: string;
    notes?: string;
    source_details?: string;
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
    if (Array.isArray(status)) {
        status.forEach((statusValue) => {
            query.append('status', String(leadStatusToCode[statusValue]));
        });
    } else if (status) {
        query.set('status', String(leadStatusToCode[status]));
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
};

export const getLeads = (params: GetLeadsParams): Promise<LeadsListResponse> => {
    return fetchApiData<LeadsListResponse>('GET', `lead${buildLeadsQuery(params)}`);
};

export const getLead = (id: string): Promise<Lead> => {
    return fetchApiData<Lead>('GET', `lead/${id}`);
};

export const createLead = (data: CreateLeadPayload): Promise<{ id: string }> => {
    return fetchApiData<{ id: string }>('POST', 'lead/submit', { data });
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

export interface UpdateLeadPayload {
    company_name?: string;
    company_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
}

export const updateLead = (leaduid: string, data: UpdateLeadPayload): Promise<Lead> => {
    return fetchApiData<Lead>('PATCH', `lead/${leaduid}`, { data });
};

export interface ConvertLeadPayload {
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

export const buildConvertLeadPayload = (lead: Partial<Lead>): ConvertLeadPayload => {
    const firstName = trimToUndefined(lead.first_name);
    const lastName = trimToUndefined(lead.last_name);
    const email = trimToUndefined(lead.email);
    const emailLocalPart = email?.split('@')[0];
    const leadId = trimToUndefined(lead.id);
    const leadBasedUsername = leadId ? `lead_${leadId.replace(/[^a-zA-Z0-9_]/g, '_')}` : undefined;
    const adminUsername = trimToUndefined(
        [firstName, lastName].filter(Boolean).join('.').toLowerCase() ||
            emailLocalPart ||
            leadBasedUsername ||
            'lead_admin'
    );

    return {
        admin_username: adminUsername,
        first_name: firstName,
        last_name: lastName,
        email,
        phone: trimToUndefined(lead.phone),
        company_name: trimToUndefined(lead.company_name),
        company_address: trimToUndefined(lead.company_address),
        city: trimToUndefined(lead.city),
        state: trimToUndefined(lead.state),
        zip: trimToUndefined(lead.zip),
        dealer_type: trimToUndefined(lead.dealer_type),
        referral_code: trimToUndefined(lead.referral_code),
        notes: trimToUndefined(lead.notes),
    };
};

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
