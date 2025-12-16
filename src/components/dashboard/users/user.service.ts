import { fetchApiData } from 'common/api/fetchAPI';
import { ActionStatus, Status } from 'common/interfaces/ActionStatus';
import { UserQuery } from 'common/interfaces/QueriesParams';
import {
    ShortUserInfo,
    User,
    UserErrorResponse,
    UserSuccessResponse,
} from 'common/interfaces/UserData';
import { UserSettingsResponse, UserSettingDeals } from 'common/interfaces/users/UserSettings';

export const createOrUpdateUser = (
    loginname: string,
    loginpassword: string,
    uid: string = '0'
): Promise<UserSuccessResponse | UserErrorResponse> => {
    return fetchApiData<UserSuccessResponse | UserErrorResponse>('POST', `user/${uid}/user`, {
        data: { loginname, loginpassword },
    });
};

export const undeleteUser = (uid: string): Promise<ActionStatus> => {
    return fetchApiData<ActionStatus>('POST', `user/${uid}/undelete`);
};

export const copyUser = (uid: string): Promise<ActionStatus> => {
    return fetchApiData<ActionStatus>('POST', `user/${uid}/copyuser`);
};

export const setUserOptionalData = (uid: string, data: unknown): Promise<ActionStatus> => {
    return fetchApiData('POST', `user/${uid}/set`, { data });
};

export const getUsers = (params?: UserQuery): Promise<User[]> => {
    const initialParams: UserQuery = {
        column: params?.column,
        type: params?.type,
        skip: params?.skip,
        qry: params?.qry,
        top: params?.top,
    };

    return fetchApiData<User[]>('GET', `user/0/list`, { params: initialParams });
};

export const getDeletedUsers = (params?: UserQuery): Promise<User[]> => {
    const initialParams: UserQuery = {
        column: params?.column || 'username',
        type: params?.type || 'asc',
        skip: params?.skip || 0,
        qry: params?.qry || '',
        top: params?.top || 10,
    };

    return fetchApiData<User[]>('GET', `user/0/listdeleted`, { params: initialParams });
};

export const deleteUser = (uid: string): Promise<ActionStatus> => {
    return fetchApiData<ActionStatus>('POST', `user/${uid}/delete`);
};

export const setUserPermissions = (uid: string, data: unknown): Promise<ActionStatus> => {
    return fetchApiData('POST', `user/${uid}/permissions`, { data });
};

export const getUserPermissions = (uid: string): Promise<string> => {
    return fetchApiData<string>('GET', `user/${uid}/permissions`);
};

export const getUserExtendedInfo = (uid: string): Promise<Record<string, any>> => {
    return fetchApiData<Record<string, any>>('GET', `user/${uid}/info`);
};

export const getUserLocations = (uid: string): Promise<any> => {
    return fetchApiData<any>('GET', `user/${uid}/locations`);
};

export const getUserProfile = (uid: string): Promise<string> => {
    return fetchApiData<string>('GET', `user/${uid}/profile`);
};

export const setUserSettings = (uid: string, data: unknown): Promise<ActionStatus> => {
    return fetchApiData('POST', `user/${uid}/settings`, { data });
};

export const getUserSettings = (uid: string): Promise<UserSettingsResponse> => {
    return fetchApiData('GET', `user/${uid}/settings`);
};

export const listUserSessions = (uid: string): Promise<any[]> => {
    return fetchApiData<any[]>('GET', `user/${uid}/sessions`);
};

export const killSession = (uid: string): Promise<ActionStatus> => {
    return fetchApiData('POST', `user/${uid}/session`);
};

export const listUserLogins = (uid: string): Promise<any[]> => {
    return fetchApiData<any[]>('GET', `user/${uid}/logins`);
};

export const listSubusers = (uid: string): Promise<any[]> => {
    return fetchApiData<any[]>('GET', `user/${uid}/subusers`);
};

export const listSalesPersons = (uid: string): Promise<any[]> => {
    return fetchApiData<any[]>('GET', `user/${uid}/salespersons`);
};

export const getUserShortInfo = (uid: string): Promise<ShortUserInfo> => {
    return fetchApiData<ShortUserInfo>('GET', `user/${uid}/username`);
};

export const clearCache = (): Promise<string[]> => {
    return fetchApiData<string[]>('GET', 'user/updateall');
};

export const getTotalUsersRecords = (
    list: 'list' | 'listdeleted'
): Promise<{ status: Status; total: number }> => {
    return fetchApiData<{ status: Status; total: number }>('GET', `user/0/${list}?total=1`);
};

export const getDealsOptions = (deal: UserSettingDeals) => {
    return fetchApiData<{ status: Status; [key: string]: string[] | unknown }>(
        'GET',
        `deals/${deal}`
    );
};

export const getUserStatistics = (useruid: string): Promise<string> => {
    return fetchApiData<string>('GET', `user/${useruid}/statistics`);
};

export const getUserReports = (useruid: string): Promise<string> => {
    return fetchApiData<string>('GET', `reports/${useruid}/list`);
};

export const getUserPrinted = (useruid: string): Promise<string> => {
    return fetchApiData<string>('GET', `user/${useruid}/statistics`);
};
