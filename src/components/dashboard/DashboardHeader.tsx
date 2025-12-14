import { useNavigate } from 'react-router-dom';
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
            <div
                className='app-container flex-lg-grow-1 d-flex align-items-stretch
            justify-content-between w-100'
            >
                <div className='app-navbar flex-shrink-0 ms-auto'>
                    <div className='app-navbar-item ms-1'>
                        <div className='cursor-pointer symbol symbol-35px'>
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
        </header>
    );
}
