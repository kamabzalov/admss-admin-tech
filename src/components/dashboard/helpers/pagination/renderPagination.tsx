/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
    useQueryResponseDataLength,
    useQueryResponseLoading,
} from 'common/core/QueryResponseProvider';
import { useQueryRequest } from 'common/core/QueryRequestProvider';
import { getLocalState } from '_metronic/helpers';
import { UsersListType, UsersType } from 'common/interfaces/UserData';
import { LOC_STORAGE_USER_STATE } from 'common/app-consts';
import { getTotalUsersRecords } from 'components/dashboard/users/user.service';

interface UsersListPaginationProps {
    list: UsersListType;
}

const { login, usersPage } = getLocalState();

export const UsersListPagination = ({ list }: UsersListPaginationProps) => {
    const { state, updateState } = useQueryRequest();
    const [currentPage, setCurrentPage] = useState<number>(state.currentpage);
    const isLoading = useQueryResponseLoading(list);
    const listLength = useQueryResponseDataLength(list);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const showedPages = 3;

    useEffect(() => {
        const fetchTotalRecords = async () => {
            const totalList = list === UsersType.ACTIVE ? 'list' : 'listdeleted';
            const { total } = await getTotalUsersRecords(totalList);
            setTotalRecords(total);
        };
        fetchTotalRecords();
        const getPages = async (): Promise<number> => {
            const res = await Math.ceil(totalRecords / count);
            return res;
        };
        getPages().then((res) => {
            updatePageNumbers(res);
            setTotalPages(res);
        });
    }, [totalRecords, currentPage]);

    const { count } = state;

    const updatePageNumbers = (length: number): void => {
        setPageNumbers(Array.from({ length }, (_, index) => index));
    };

    useEffect(() => {
        updatePageNumbers(totalPages);
        const page = getLocalState().usersPage;
        if (page) {
            handleSetCurrentPage(page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersPage, totalRecords]);

    useEffect(() => {
        if (!listLength) {
            currentPage > 0 && handleSetCurrentPage(currentPage - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listLength]);

    useEffect(() => {
        if (!!state.search?.length) {
            setTotalRecords(listLength);
        } else {
            setTotalRecords(totalRecords);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listLength, state.search, currentPage]);

    const handleSetCurrentPage = (page: number): void => {
        setCurrentPage(page);
        localStorage.setItem(LOC_STORAGE_USER_STATE, JSON.stringify({ login, usersPage: page }));

        updateState({ ...state, currentpage: page });
    };

    return (
        <div className='w-100 py-6 col-sm-12 col-md-7 d-flex align-items-center justify-content-center'>
            <div id='kt_table_users_paginate'>
                <ul className='pagination'>
                    <li
                        className={clsx('page-item first', {
                            disabled: isLoading || currentPage === 0,
                        })}
                    >
                        <a href='#' className='page-link' onClick={() => handleSetCurrentPage(0)}>
                            <i className='ki-outline ki-double-left fs-4'></i>
                        </a>
                    </li>
                    <li
                        className={clsx('page-item previous me-6', {
                            disabled: isLoading || currentPage === 0,
                        })}
                    >
                        <a
                            href='#'
                            className='page-link'
                            onClick={() => handleSetCurrentPage(currentPage - 1)}
                        >
                            <i className='ki-outline ki-left fs-4'></i>
                        </a>
                    </li>

                    {pageNumbers &&
                        pageNumbers.map((pageNumber) => {
                            if (
                                currentPage + showedPages > pageNumber &&
                                currentPage - showedPages < pageNumber
                            ) {
                                return (
                                    <li
                                        key={pageNumber}
                                        className={clsx('page-item', {
                                            disabled: isLoading,
                                            active: pageNumber === currentPage,
                                        })}
                                    >
                                        <a
                                            href='#'
                                            className='page-link'
                                            onClick={() => handleSetCurrentPage(pageNumber)}
                                        >
                                            {pageNumber + 1}
                                        </a>
                                    </li>
                                );
                            } else return null;
                        })}

                    <li
                        className={clsx('page-item next ms-6', {
                            disabled:
                                isLoading ||
                                currentPage === totalPages - 1 ||
                                currentPage > totalPages,
                        })}
                    >
                        <a
                            href='#'
                            className='page-link'
                            onClick={() => handleSetCurrentPage(currentPage + 1)}
                        >
                            <i className='ki-outline ki-right fs-4'></i>
                        </a>
                    </li>
                    <li
                        className={clsx('page-item last', {
                            disabled:
                                isLoading ||
                                currentPage === totalPages - 1 ||
                                currentPage > totalPages,
                        })}
                    >
                        <a
                            href='#'
                            className='page-link'
                            onClick={() => handleSetCurrentPage(totalPages - 1)}
                        >
                            <i className='ki-outline ki-double-right fs-4'></i>
                        </a>
                    </li>
                </ul>

                <div className='mt-4 text-center fs-5'>Records per page: {count}</div>
                <div className='mt-4 text-center fs-5'>Total records: {totalRecords}</div>
            </div>
        </div>
    );
};
