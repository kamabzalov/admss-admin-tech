/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { ColumnInstance, Row, useTable } from 'react-table';
import { ApiKeysHeaderColumn } from './ApiKeysTable/ApiKeysHeaderColumn';
import { ApiKeysColumns } from './ApiKeysTable/ApiKeysColumns';
import { ApiKeysRow } from './ApiKeysTable/ApiKeysRow';
import { ApiKeyRecord } from 'common/interfaces/UserApiKeys';
import { getUserApiKeysList } from './apiKeys.service';
import { ApiKeyModal } from './ApiKeysModal/ApiKeyModal';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';

const defaultDate = new Date().getTime().toString();

const initialApiKeysState: ApiKeyRecord[] = [
    {
        created: '',
        deleted: '',
        updated: '',
        issuedate: defaultDate,
        expirationdate: defaultDate,
        host: '',
        clientuid: '',
        port: 0,
        userlogin: '',
        userpassword: '',
        lastused: '',
        flags: 0,
        enabled: 0,
        apitype: '',
        useruid: '',
        itemuid: '',
        apikey: '',
        notes: '',
        id: 0,
    },
];

export const ApiKeys = ({ useruid }: { useruid: string }): JSX.Element => {
    const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(initialApiKeysState);
    const [addKeyModalEnabled, setAddKeyModalEnabled] = useState<boolean>(false);

    const updateApiKeys = (): void => {
        getUserApiKeysList(useruid).then((response: any) => {
            setApiKeys(response);
        });
    };

    useEffect(() => {
        updateApiKeys();
    }, []);

    const columns = useMemo(() => ApiKeysColumns(updateApiKeys), []);
    const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
        columns,
        data: apiKeys,
    });

    return (
        <div className='card'>
            <div className='me-4 mt-4 ms-auto'>
                <ActionButton icon='plus' buttonClickAction={() => setAddKeyModalEnabled(true)}>
                    Add API key
                </ActionButton>
            </div>
            <div className='card-body'>
                <div className='table-responsive position-relative '>
                    <table
                        id='kt_table_api_keys'
                        className='table align-middle table-row-dashed fs-6 gy-3 no-footer'
                        {...getTableProps()}
                    >
                        <thead>
                            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                                {headers.map((column: ColumnInstance<ApiKeyRecord>) => (
                                    <ApiKeysHeaderColumn key={column.id} column={column} />
                                ))}
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
                            {rows.map((row: Row<ApiKeyRecord>) => {
                                prepareRow(row);
                                return <ApiKeysRow row={row} key={`${row.id}`} />;
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {addKeyModalEnabled && (
                <ApiKeyModal
                    updateAction={updateApiKeys}
                    onClose={() => setAddKeyModalEnabled(false)}
                />
            )}
        </div>
    );
};
