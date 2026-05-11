import { DealerType } from './Lead';

export type DealerStatusApi = 'pre_approved' | 'active' | 'suspended' | 'expired';

export interface Dealer {
    id: string;
    dealer_status?: DealerStatusApi | string;
    dealer_status_code?: number;
    dealer_type?: DealerType | string;
    dealer_type_code?: number;
    company_name: string;
    company_address: string;
    city: string;
    state: string;
    zip: string;
    first_name: string;
    last_name: string;
    phone_office: string;
    email_company: string;
    phone_mobile: string;
    email_contact: string;
    license_number: string;
    license_exp_date: string;
    is_verified: boolean;
    verified_at: string;
    verified_by_user_uid: string;
    sandbox_mode: boolean;
    source_lead_uid?: string;
    source: string;
    referral_code: string;
    notes?: string;
    created: string;
    updated: string;
}

export interface DealersListResponse {
    dealers: Dealer[];
    count?: number;
    total?: number;
    status?: string;
}

export interface DealerUser {
    useruid: string;
    username: string;
    dealer_id?: string;
    parentuid?: string;
    parentusername?: string;
    createdbyuid?: string;
    creatorusername?: string;
    rolename?: string;
    roleuid?: string;
    type?: string;
    isadmin?: number;
    issubuser?: boolean;
    enabled?: number;
    index?: number;
    created?: string;
    updated?: string;
}

export interface DealerUsersResponse {
    users: DealerUser[];
    total?: number;
    count?: number;
    status?: string;
}

export interface License {
    id: string;
    dealer_id?: string;
    license_type?: string;
    license_number?: string;
    issue_date?: string;
    expiration_date?: string;
    is_active?: number;
    document_uid?: string;
    notes?: string;
    created?: string;
    updated?: string;
}

export interface LicensesResponse {
    licenses: License[];
    total?: number;
    count?: number;
    status?: string;
}
