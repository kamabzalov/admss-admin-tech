import axios from 'axios';
import { fetchApiData } from 'common/api/fetchAPI';
import { API_URL } from 'common/app-consts';
import {
    Dealer,
    DealersListResponse,
    DealerStatusApi,
    DealerUsersResponse,
    LicensesResponse,
} from 'common/interfaces/Dealer';
import { UserQuery } from 'common/interfaces/QueriesParams';
import { getToken } from 'common/utils';
import { DEALER_STATUS_TO_CODE } from './constants/dealers.constants';

export const getDealers = (params?: UserQuery): Promise<DealersListResponse> => {
    const initialParams: UserQuery = {
        column: params?.column,
        type: params?.type,
        skip: params?.skip,
        qry: params?.qry,
        top: params?.top,
    };

    return fetchApiData<DealersListResponse>('GET', `dealer`, { params: initialParams });
};

export const getDealer = (dealerId: string): Promise<Dealer> => {
    return fetchApiData<Dealer>('GET', `dealer/${dealerId}`);
};

export interface UpdateDealerPayload {
    company_name?: string;
    company_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    first_name?: string;
    last_name?: string;
    email_company?: string;
    email_contact?: string;
    phone_office?: string;
    phone_mobile?: string;
    referral_code?: string;
    license_number?: string;
    license_exp_date?: string;
    dealer_type?: string;
    notes?: string;
    sandbox_mode?: boolean;
}

export const updateDealer = (dealerId: string, data: UpdateDealerPayload): Promise<Dealer> => {
    return fetchApiData<Dealer>('PATCH', `dealer/${dealerId}`, { data });
};

export const updateDealerStatus = (dealerId: string, status: DealerStatusApi): Promise<Dealer> => {
    return fetchApiData<Dealer>('PATCH', `dealer/${dealerId}/status`, {
        data: {
            dealer_status: status,
            dealer_status_code: DEALER_STATUS_TO_CODE[status],
        },
    });
};

export const deleteDealer = (dealerId: string): Promise<{ id: string }> => {
    return fetchApiData<{ id: string }>('DELETE', `dealer/${dealerId}`);
};

export const getDealerUsers = (dealerId: string): Promise<DealerUsersResponse> => {
    return fetchApiData<DealerUsersResponse>('GET', `dealer/${dealerId}/users`);
};

export const getDealerLicenses = (dealerId: string): Promise<LicensesResponse> => {
    return fetchApiData<LicensesResponse>('GET', `dealer/${dealerId}/licenses`);
};

export const getDealerLogoUrl = async (dealerId: string): Promise<string | null> => {
    try {
        const response = await axios.get(`${API_URL}media/${dealerId}/dealer-logo`, {
            responseType: 'blob',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        const blob = response.data as Blob | undefined;
        if (!blob || (blob instanceof Blob && blob.size === 0)) {
            return null;
        }
        return URL.createObjectURL(blob);
    } catch (error) {
        return null;
    }
};

export const uploadDealerLogo = async (
    dealerId: string,
    file: File
): Promise<{ status?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}media/${dealerId}/dealer-logo`, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
