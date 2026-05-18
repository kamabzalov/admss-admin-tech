import { useQueryResponseData, useQueryResponseLoading } from 'common/core/QueryResponseProvider';
import { useEffect, useMemo, useState } from 'react';
import { useTable, ColumnInstance, Row } from 'react-table';
import { CustomHeaderColumn } from './columns/CustomHeaderColumn';
import { CustomRow } from './columns/CustomRow';
import { usersColumns } from './columns/_columns';
import { UsersListType, User, UsersType } from 'common/interfaces/UserData';
import { CustomPagination } from 'components/dashboard/helpers/pagination/renderPagination';
import { getTotalUsersRecords } from '../user.service';
import { useQueryRequest } from 'common/core/QueryRequestProvider';
import { DefaultRecordsPerPage, RecordsPerPage } from 'common/settings/settings';

interface UsersTableProps {
    list: UsersListType;
}

export const UsersTable = ({ list }: UsersTableProps) => {
    const [listLength, setListLength] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentCount, setCurrentCount] = useState<RecordsPerPage>(DefaultRecordsPerPage);
    const users = useQueryResponseData(list);

    const { state, updateState } = useQueryRequest();

    useEffect(() => {
        if (state.search) {
            return setListLength(users.length);
        }
        getTotalUsersRecords(list === UsersType.ACTIVE ? 'list' : 'listdeleted').then((response) =>
            setListLength(response.total)
        );
    }, [list, state.search, users.length]);

    const handlePageChange = async (page: number) => {
        await setCurrentPage(page);
        updateState({ ...state, count: currentCount, currentpage: page * currentCount });
    };

    const handleCountChange = async (count: RecordsPerPage) => {
        await setCurrentCount(count);
        updateState({ ...state, count, currentpage: (Math.ceil(currentPage / count) + 1) * count });
    };

    const isLoading = useQueryResponseLoading(list);
    const usersData = useMemo(() => users, [users]);
    const columns = useMemo(() => usersColumns(list), [list]);
    const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
        columns,
        data: usersData,
    });

    return (
        <>
            <div className='table-responsive position-relative '>
                {isLoading && (
                    <div className='processing-overlay cursor-default position-absolute w-100 h-100 d-flex align-items-center justify-content-center'>
                        <div className='p-6 bg-white rounded-2 shadow-sm '>Processing...</div>
                    </div>
                )}
                <table
                    id='kt_table_users'
                    className='table align-middle table-row-dashed fs-6 gy-3 dataTable no-footer'
                    {...getTableProps()}
                >
                    <thead>
                        <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                            {headers.map((column: ColumnInstance<User>) => (
                                <CustomHeaderColumn key={column.id} column={column} />
                            ))}
                        </tr>
                    </thead>
                    <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
                        {rows.length > 0 ? (
                            rows.map((row: Row<User>, i) => {
                                prepareRow(row);
                                return <CustomRow row={row} key={`${row.id}`} />;
                            })
                        ) : (
                            <tr>
                                <td colSpan={7}>
                                    <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                        No matching records found
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <CustomPagination
                records={listLength}
                onPageChange={handlePageChange}
                count={state.count}
                onCountChange={handleCountChange}
            />
        </>
    );
};
