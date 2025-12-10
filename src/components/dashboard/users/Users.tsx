import { QueryRequestProvider } from 'common/core/QueryRequestProvider';
import { QueryResponseProvider } from 'common/core/QueryResponseProvider';
import { UsersType, UsersListType } from 'common/interfaces/UserData';
import { useState } from 'react';
import { TabNavigate, TabPanel } from '../helpers/helpers';
import { CustomModal } from '../helpers/modal/renderModalHelper';
import { PrimaryButton } from '../smallComponents/buttons/PrimaryButton';
import { UsersListSearchComponent } from '../smallComponents/search/Search';
import { UserModal } from './UserModal/parts/UserModal';
import { UsersTable } from './table/UsersTable';

const usersTabsArray: string[] = Object.values(UsersType) as string[];

export const Dealers = () => {
    const [activeTab, setActiveTab] = useState<UsersListType>(UsersType.ACTIVE);
    const [addUserModalEnabled, setAddUserModalEnabled] = useState<boolean>(false);

    const [activeTabLoaded, setActiveTabLoaded] = useState<Record<string, boolean>>({
        [UsersType.ACTIVE]: true,
        [UsersType.DELETED]: false,
    });

    const handleAddUserModalOpen = () => setAddUserModalEnabled(!addUserModalEnabled);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab as UsersListType);

        if (!activeTabLoaded[tab as UsersListType]) {
            setActiveTabLoaded((prevState) => ({ ...prevState, [tab as UsersListType]: true }));
        }
    };
    return (
        <QueryRequestProvider>
            <QueryResponseProvider listType={activeTab}>
                {addUserModalEnabled && (
                    <CustomModal onClose={handleAddUserModalOpen} title={'Add dealer'}>
                        <UserModal onClose={handleAddUserModalOpen} />
                    </CustomModal>
                )}
                <div className='card'>
                    <div className='card-header d-flex flex-column justify-content-end pb-0'>
                        <ul className='nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap'>
                            {usersTabsArray.map((tab) => (
                                <TabNavigate
                                    key={tab}
                                    activeTab={activeTab}
                                    tab={tab}
                                    onTabClick={handleTabClick}
                                />
                            ))}
                        </ul>
                    </div>

                    <div className='card-body'>
                        <div className='tab-content' id='myTabContentInner'>
                            <div className='d-flex w-100 justify-content-between my-4'>
                                <UsersListSearchComponent />
                                <PrimaryButton
                                    icon='plus'
                                    buttonClickAction={handleAddUserModalOpen}
                                >
                                    Add dealer
                                </PrimaryButton>
                            </div>
                            {activeTabLoaded[UsersType.ACTIVE] && activeTab === UsersType.ACTIVE && (
                                <TabPanel activeTab={activeTab} tabName={UsersType.ACTIVE}>
                                    <UsersTable list={UsersType.ACTIVE} />
                                </TabPanel>
                            )}
                            {activeTabLoaded[UsersType.DELETED] && activeTab === UsersType.DELETED && (
                                <TabPanel activeTab={activeTab} tabName={UsersType.DELETED}>
                                    <UsersTable list={UsersType.DELETED} />
                                </TabPanel>
                            )}
                        </div>
                    </div>
                </div>
            </QueryResponseProvider>
        </QueryRequestProvider>
    );
};
