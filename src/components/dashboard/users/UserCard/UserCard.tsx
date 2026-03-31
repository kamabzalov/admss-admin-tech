/* eslint-disable no-unused-vars */
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getUserExtendedInfo,
    getUserLocations,
    getUserPermissions,
    getUserSettings,
    getUserShortInfo,
    getUserStatistics,
    listSalesPersons,
    listSubusers,
    listUserLogins,
    listUserSessions,
    setUserPermissions,
} from 'components/dashboard/users/user.service';
import { AxiosError } from 'axios';
import { useToast } from '../../helpers/renderToastHelper';
import { Status } from 'common/interfaces/ActionStatus';
import { LOC_STORAGE_USER } from 'common/app-consts';
import { LoginResponse } from 'common/interfaces/UserData';
import { ShortUserInfo } from '../../../../common/interfaces/UserData';
import { renderTable } from '../../microservices/MicroserviceCard';

export function UserCard() {
    const { id } = useParams();
    const { useruid }: LoginResponse = JSON.parse(localStorage.getItem(LOC_STORAGE_USER) ?? '');
    const [extendedInfo, setExtendedInfo] = useState<Record<string, any> | null>(null);
    const [shortInfo, setShortInfo] = useState<ShortUserInfo | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [userPermissionsJSON, setUserPermissionsJSON] = useState<string>('');
    const [userSettingsJSON, setUserSettingsJSON] = useState<string>('');
    const [userSessions, setUserSessions] = useState<any[]>([]);
    const [userLogins, setUserLogins] = useState<any[]>([]);
    const [userSubusers, setUserSubusers] = useState<any[]>([]);
    const [userSalesPersons, setSalesPersons] = useState<any[]>([]);
    const [userStatisticsJSON, setUserStatisticsJSON] = useState<string>('');

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [initialUserPermissions, setInitialUserPermissions] = useState<string>('');

    useEffect(() => {
        if (id) {
            getUserExtendedInfo(id).then((response) => {
                setExtendedInfo(response);
            });
            getUserShortInfo(id).then((response) => {
                setShortInfo(response);
            });
            getUserLocations(id).then((response) => {
                setLocations(response.locations);
            });
            getUserPermissions(id).then((response) => {
                // eslint-disable-next-line no-console
                console.log('permissions', response);
                const stringifiedResponse = JSON.stringify(response, null, 2);
                setUserPermissionsJSON(stringifiedResponse);
                setInitialUserPermissions(stringifiedResponse);
            });
            getUserSettings(id).then((response) => {
                setUserSettingsJSON(JSON.stringify(response, null, 2));
            });
            listUserSessions(id).then((response) => {
                setUserSessions(response);
            });
            listUserLogins(id).then((response) => {
                setUserLogins(response);
            });
            listSubusers(id).then((response) => {
                setUserSubusers(response);
            });
            listSalesPersons(id).then((response) => {
                setSalesPersons(response);
            });
            getUserStatistics(id).then((response) => {
                // eslint-disable-next-line no-console
                // console.log(response);
                setUserStatisticsJSON(JSON.stringify(response, null, 2));
            });
        }
    }, [id]);

    const { handleShowToast } = useToast();

    useEffect(() => {
        if (initialUserPermissions !== userPermissionsJSON) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [userPermissionsJSON, initialUserPermissions]);

    const handleChangeUserPermissions = ([fieldName, fieldValue]: [string, number]): void => {
        const parsedUserPermission = JSON.parse(userPermissionsJSON);
        parsedUserPermission[fieldName] = fieldValue;
        setUserPermissionsJSON(JSON.stringify(parsedUserPermission, null, 2));
    };

    const handleSetUserPermissions = (): void => {
        if (id) {
            setUserPermissions(id, JSON.parse(userPermissionsJSON)).then((response) => {
                try {
                    if (response.status === Status.OK) {
                        handleShowToast({
                            message: 'Permissions successfully saved',
                            type: 'success',
                        });
                    }
                } catch (err) {
                    const { message } = err as Error | AxiosError;
                    handleShowToast({ message, type: 'danger' });
                }

                try {
                    setIsButtonDisabled(true);
                    setInitialUserPermissions(userPermissionsJSON);
                } catch (error) {
                    setIsButtonDisabled(true);
                }
            });
        }
    };

    return (
        <>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-body pt-9 pb-0'>
                    <div className='d-flex flex-wrap flex-sm-nowrap mb-3'>
                        <div className='flex-grow-1'>
                            <div className='d-flex justify-content-between align-items-start flex-wrap mb-2'>
                                <div className='d-flex flex-column'>
                                    <div className='d-flex align-items-center mb-2'>
                                        <a
                                            href='#'
                                            className='text-gray-800 text-hover-primary fs-2 fw-bolder me-1'
                                        >
                                            {shortInfo?.userName}
                                        </a>
                                    </div>

                                    <div className='d-flex flex-wrap fw-bold fs-6 mb-4 pe-2'>
                                        {extendedInfo && (
                                            <>
                                                {extendedInfo.city && (
                                                    <span className='d-flex align-items-center text-gray-400 me-5 mb-2'>
                                                        City: {extendedInfo.city}
                                                    </span>
                                                )}
                                                {extendedInfo.phone1 && (
                                                    <span className='d-flex align-items-center text-gray-400 me-5 mb-2'>
                                                        Phone: {extendedInfo.phone1}
                                                    </span>
                                                )}
                                                {extendedInfo.email && (
                                                    <span className='d-flex align-items-center text-gray-400 me-5 mb-2'>
                                                        Email: {extendedInfo.email1}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex overflow-auto h-55px'>
                        <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                            <li className='nav-item'>
                                <Link
                                    className='nav-link text-active-primary me-6 active'
                                    to={`/dashboard/user/${useruid}`}
                                >
                                    Overview
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer info</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Dealer Name</label>

                        <div className='col-lg-8'>
                            <span className='fw-bolder fs-6 text-dark'>{shortInfo?.userName}</span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Full Name</label>

                        <div className='col-lg-8'>
                            <span className='fw-bolder fs-6 text-dark'>
                                {extendedInfo?.firstName} {extendedInfo?.lastName}
                            </span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Email 1</label>

                        <div className='col-lg-8 fv-row'>
                            <span className='fw-bold fs-6'>{extendedInfo?.email1}</span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Email 2</label>

                        <div className='col-lg-8 fv-row'>
                            <span className='fw-bold fs-6'>{extendedInfo?.email2}</span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Contact Phone 1</label>

                        <div className='col-lg-8 d-flex align-items-center'>
                            <span className='fw-bolder fs-6 me-2'>{extendedInfo?.phone1}</span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Contact Phone 1</label>

                        <div className='col-lg-8 d-flex align-items-center'>
                            <span className='fw-bolder fs-6 me-2'>{extendedInfo?.phone2}</span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Company name</label>

                        <div className='col-lg-8'>
                            <div className='col-lg-8 d-flex align-items-center'>
                                <span className='fw-bolder fs-6 me-2'>
                                    {extendedInfo?.companyName}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>Address</label>

                        <div className='col-lg-8'>
                            <span className='fw-bolder fs-6 text-dark'>
                                {extendedInfo?.streetAddress}
                            </span>
                        </div>
                    </div>

                    <div className='row mb-7'>
                        <label className='col-lg-4 fw-bold text-muted'>ZIP code</label>

                        <div className='col-lg-8'>
                            <span className='fw-bolder fs-6 text-dark'>
                                {extendedInfo?.zipCode}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer locations</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {locations.length ? renderTable(locations) : 'No data available'}
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer subusers</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {userSubusers.length ? renderTable(userSubusers) : 'No data available'}
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer sales persons</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {userSalesPersons.length ? renderTable(userSalesPersons) : 'No data available'}
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer sessions</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {userSessions.length ? renderTable(userSessions) : 'No data available'}
                </div>
            </div>

            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Dealer logins</h3>
                    </div>
                </div>

                <div className='card-body p-9'>
                    {userLogins.length ? renderTable(userLogins) : 'No data available'}
                </div>
            </div>
        </>
    );
}
