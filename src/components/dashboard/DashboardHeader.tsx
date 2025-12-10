import { Link, useNavigate } from 'react-router-dom';
import { LoginResponse, logout } from 'common/auth.service';
import { CustomDropdown } from './helpers/renderDropdownHelper';
import { LOC_STORAGE_USER } from 'common/app-consts';
import { useState } from 'react';
import { CustomModal } from './helpers/modal/renderModalHelper';
import { UserModal } from './users/UserModal/parts/UserModal';

export function DashboardHeader() {
    const navigate = useNavigate();
    const [editUserModalEnabled, setEditUserModalEnabled] = useState<boolean>(false);
    const { useruid, loginname }: LoginResponse = JSON.parse(
        localStorage.getItem(LOC_STORAGE_USER) ?? ''
    );

    const handleUserCardOpen = () => {
        navigate(`/dashboard/user/${useruid}`);
    };

    const handleEditUserModalOpen = () => {
        setEditUserModalEnabled(true);
    };
    const signOut = () => {
        if (useruid) {
            logout(useruid)
                .then((response) => {
                    if (response.status) {
                        localStorage.removeItem(LOC_STORAGE_USER);
                    }
                })
                .finally(() => {
                    navigate('/');
                });
        }
    };
    return (
        <header className='app-header'>
            {editUserModalEnabled && (
                <CustomModal
                    onClose={() => setEditUserModalEnabled(false)}
                    title={'Change password'}
                >
                    <UserModal
                        onClose={() => setEditUserModalEnabled(false)}
                        user={{ username: loginname, useruid }}
                    />
                </CustomModal>
            )}
            <div className='container flex-lg-grow-1 d-flex align-items-stretch justify-content-between'>
                <div className='d-flex align-items-stretch justify-content-between flex-grow-1'>
                    <div className='app-header-menu d-flex align-items-stretch w-100'>
                        <div className='menu menu-rounded menu-column menu-row my-5 my-lg-0 align-items-stretch fw-semibold  px-lg-0 w-100'>
                            <div className='menu-item me-lg-1'>
                                <Link className='menu-link py-3 text-hover-primary' to={''}>
                                    <i className='ki-outline ki-user-tick fs-2 m-2'></i>
                                    <span className='menu-title w-0'>Dealers</span>
                                </Link>
                            </div>
                            <div className='menu-item me-lg-1'>
                                <Link
                                    className='menu-link py-3 text-hover-primary'
                                    to={'microservices'}
                                >
                                    <i className='ki-outline ki-wrench fs-2 m-2'></i>
                                    <span className='menu-title'>Microservices</span>
                                </Link>
                            </div>
                            <div className='menu-item me-lg-1'>
                                <CustomDropdown
                                    title={'Common'}
                                    background='none'
                                    iconBefore='gear'
                                    width={250}
                                    items={[
                                        {
                                            menuItemName: 'Data import',
                                            icon: 'data',
                                            menuItemAction: () => navigate('data-import'),
                                        },
                                        {
                                            menuItemName: 'Templates for reports',
                                            icon: 'calendar-edit',
                                            menuItemAction: () => navigate('template-reports'),
                                        },
                                        {
                                            menuItemName: 'Templates for printed forms',
                                            icon: 'printer',
                                            menuItemAction: () => navigate('template-printed'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className='menu-item me-lg-1 ms-auto'>
                                <CustomDropdown
                                    title={loginname}
                                    width={200}
                                    items={[
                                        {
                                            menuItemName: `${loginname} card`,
                                            icon: 'user-tick',
                                            menuItemAction: () => handleUserCardOpen(),
                                        },
                                        {
                                            menuItemName: 'Change password',
                                            icon: 'lock-2',
                                            menuItemAction: () => handleEditUserModalOpen(),
                                        },
                                        {
                                            menuItemName: 'Log out',
                                            icon: 'exit-right',
                                            menuItemAction: () => signOut(),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
