import { useParams, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    getUserExtendedInfo,
    getUserLocations,
    getUserShortInfo,
    listSalesPersons,
    listSubusers,
    listUserLogins,
    listUserSessions,
} from 'components/dashboard/users/user.service';
import { ShortUserInfo } from 'common/interfaces/UserData';
import { renderTable } from 'components/dashboard/microservices/MicroserviceCard';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { CustomPagination } from 'components/dashboard/helpers/pagination/renderPagination';
import { DefaultRecordsPerPage, type RecordsPerPage } from 'common/settings/settings';

const renderFieldRow = (label: string, value: ReactNode) => (
    <div className='row mb-5 col-md-6' key={label}>
        <label className='col-lg-4 fw-bold text-muted'>{label}</label>
        <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-dark'>{value}</span>
        </div>
    </div>
);

const renderShadowSection = (title: string, children: ReactNode) => (
    <div className='card shadow-sm mb-6'>
        <div className='card-header'>
            <h4 className='card-title m-0'>{title}</h4>
        </div>
        <div className='card-body py-6'>{children}</div>
    </div>
);

export function UserCard() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [extendedInfo, setExtendedInfo] = useState<Record<string, any> | null>(null);
    const [shortInfo, setShortInfo] = useState<ShortUserInfo | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [userSessions, setUserSessions] = useState<any[]>([]);
    const [userLogins, setUserLogins] = useState<any[]>([]);
    const [userSubusers, setUserSubusers] = useState<any[]>([]);
    const [userSalesPersons, setSalesPersons] = useState<any[]>([]);

    const [loginsPage, setLoginsPage] = useState(0);
    const [loginsPerPage, setLoginsPerPage] = useState<RecordsPerPage>(DefaultRecordsPerPage);
    const [loginsPaginationKey, setLoginsPaginationKey] = useState(0);

    const paginatedLogins = useMemo(() => {
        const start = loginsPage * loginsPerPage;
        return userLogins.slice(start, start + loginsPerPage);
    }, [userLogins, loginsPage, loginsPerPage]);

    const fetchUserData = useCallback(async (): Promise<void> => {
        if (!id) return;

        setIsLoading(true);
        try {
            setExtendedInfo(await getUserExtendedInfo(id));
            setShortInfo(await getUserShortInfo(id));
            setLocations((await getUserLocations(id)).locations);
            setUserSessions(await listUserSessions(id));
            setUserLogins(await listUserLogins(id));
            setLoginsPage(0);
            setLoginsPaginationKey((k) => k + 1);
            setUserSubusers(await listSubusers(id));
            setSalesPersons(await listSalesPersons(id));
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchUserData();
    }, [fetchUserData]);

    const userTitle = shortInfo?.userName ?? id ?? '…';

    return (
        <div className='card mb-5 mb-xl-10'>
            <div className='card-header'>
                <div className='w-100 py-4'>
                    <div className='d-flex align-items-center justify-content-between flex-wrap gap-3 my-6'>
                        <h3 className='fw-bolder m-0'>User {userTitle}</h3>
                    </div>
                    <div className='d-flex align-items-center flex-wrap gap-3'>
                        <ActionButton
                            icon='arrow-left'
                            className='w-175px'
                            buttonClickAction={() => navigate('/dashboard/users')}
                            appearance='light'
                        >
                            Back to users
                        </ActionButton>
                        <ActionButton
                            icon='arrows-circle'
                            className='w-175px'
                            buttonClickAction={() => void fetchUserData()}
                            disabled={isLoading}
                        >
                            Refresh
                        </ActionButton>
                    </div>
                </div>
            </div>

            <div className='card-body p-9 position-relative'>
                {isLoading && (
                    <div className='processing-overlay cursor-default position-absolute w-100 h-100 d-flex align-items-center justify-content-center start-0 top-0'>
                        <div className='p-6 bg-white rounded-2 shadow-sm'>Loading...</div>
                    </div>
                )}
                {!id && <div className='text-muted'>User ID is missing.</div>}
                {id && (
                    <>
                        {renderShadowSection(
                            'Summary',
                            <>
                                {extendedInfo?.city && renderFieldRow('City', extendedInfo.city)}
                                {extendedInfo?.phone1 &&
                                    renderFieldRow('Phone', extendedInfo.phone1)}
                                {extendedInfo?.email &&
                                    renderFieldRow('Email', extendedInfo.email1)}
                                {!extendedInfo?.city &&
                                    !extendedInfo?.phone1 &&
                                    !extendedInfo?.email1 &&
                                    !extendedInfo?.email && (
                                        <div className='text-muted'>No data available.</div>
                                    )}
                            </>
                        )}

                        {renderShadowSection(
                            'Dealer info',
                            <>
                                {renderFieldRow('Dealer Name', shortInfo?.userName)}
                                {renderFieldRow(
                                    'Full Name',
                                    <>
                                        {extendedInfo?.firstName} {extendedInfo?.lastName}
                                    </>
                                )}
                                {renderFieldRow('Email 1', extendedInfo?.email1)}
                                {renderFieldRow('Email 2', extendedInfo?.email2)}
                                {renderFieldRow('Contact Phone 1', extendedInfo?.phone1)}
                                {renderFieldRow('Contact Phone 2', extendedInfo?.phone2)}
                                {renderFieldRow('Company name', extendedInfo?.companyName)}
                                {renderFieldRow('Address', extendedInfo?.streetAddress)}
                                {renderFieldRow('ZIP code', extendedInfo?.zipCode)}
                            </>
                        )}

                        {renderShadowSection(
                            'Dealer locations',
                            locations.length ? (
                                renderTable(locations)
                            ) : (
                                <div className='text-muted'>No data available.</div>
                            )
                        )}

                        {renderShadowSection(
                            'Dealer subusers',
                            userSubusers.length ? (
                                renderTable(userSubusers)
                            ) : (
                                <div className='text-muted'>No data available.</div>
                            )
                        )}

                        {renderShadowSection(
                            'Dealer sales persons',
                            userSalesPersons.length ? (
                                renderTable(userSalesPersons)
                            ) : (
                                <div className='text-muted'>No data available.</div>
                            )
                        )}

                        {renderShadowSection(
                            'Dealer sessions',
                            userSessions.length ? (
                                renderTable(userSessions)
                            ) : (
                                <div className='text-muted'>No data available.</div>
                            )
                        )}

                        {renderShadowSection(
                            'Dealer logins',
                            userLogins.length ? (
                                <div className='table-responsive position-relative'>
                                    {renderTable(paginatedLogins)}
                                    <CustomPagination
                                        key={`logins-${id}-${loginsPaginationKey}`}
                                        records={userLogins.length}
                                        onPageChange={setLoginsPage}
                                        count={loginsPerPage}
                                        onCountChange={(count) => {
                                            setLoginsPerPage(count);
                                            setLoginsPage(0);
                                            setLoginsPaginationKey((k) => k + 1);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className='text-muted'>No data available.</div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
