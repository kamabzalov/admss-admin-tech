import { UserQuery } from '../../../common/interfaces/QueriesParams';
import { fetchApiData } from '../../../common/api/fetchAPI';

export const getDealers = (params?: UserQuery): Promise<any> => {
    const initialParams: UserQuery = {
        column: params?.column,
        type: params?.type,
        skip: params?.skip,
        qry: params?.qry,
        top: params?.top,
    };

    return fetchApiData<any>('GET', `dealer`, { params: initialParams });
};
