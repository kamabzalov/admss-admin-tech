export interface Dealer {
    id: string;
    dealer_status: string;
    dealer_type: string;
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
    is_verified: number;
    verified_at: string;
    verified_by_user_uid: string;
    sandbox_mode: number;
    source_lead_uid: string;
    source: string;
    referral_code: string;
    created: string;
    updated: string;
}
