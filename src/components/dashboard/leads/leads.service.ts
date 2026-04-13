import { fetchApiData } from 'common/api/fetchAPI';
import { Lead, LeadStatusApi, LeadsListResponse } from 'common/interfaces/Lead';
import { LeadStatus } from 'components/dashboard/leads/constants/leads.constants';

interface GetLeadsParams {
    top?: number;
    skip?: number;
    status?: LeadStatusApi;
}

const leadStatusToCode: Record<LeadStatusApi, number> = {
    [LeadStatus.SUBMITTED]: 0,
    [LeadStatus.IN_REVIEW]: 1,
    [LeadStatus.APPROVED]: 2,
    [LeadStatus.REJECTED]: 3,
    [LeadStatus.CLOSED]: 4,
    [LeadStatus.CONVERTED]: 5,
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

export const getLead = (id: string): Promise<Lead> => {
    return fetchApiData<Lead>('GET', `lead/${id}`);
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

const normalizeString = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim();
    return normalized ? normalized : undefined;
};

export const buildConvertLeadPayload = (lead: Partial<Lead>): ConvertLeadPayload => {
    const firstName = normalizeString(lead.first_name);
    const lastName = normalizeString(lead.last_name);
    const email = normalizeString(lead.email);
    const emailLocalPart = email?.split('@')[0];
    const leadId = normalizeString(lead.id);
    const leadBasedUsername = leadId ? `lead_${leadId.replace(/[^a-zA-Z0-9_]/g, '_')}` : undefined;
    const adminUsername = normalizeString(
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
        phone: normalizeString(lead.phone),
        company_name: normalizeString(lead.company_name),
        company_address: normalizeString(lead.company_address),
        city: normalizeString(lead.city),
        state: normalizeString(lead.state),
        zip: normalizeString(lead.zip),
        dealer_type: normalizeString(lead.dealer_type),
        referral_code: normalizeString(lead.referral_code),
        notes: normalizeString(lead.notes),
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
