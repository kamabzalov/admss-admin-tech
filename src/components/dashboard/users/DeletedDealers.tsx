import { QueryRequestProvider } from 'common/core/QueryRequestProvider';
import { QueryResponseProvider } from 'common/core/QueryResponseProvider';
import { UsersListType, UsersType } from 'common/interfaces/UserData';
import { useState } from 'react';
import { CustomModal } from '../helpers/modal/renderModalHelper';
import { UserModal } from './UserModal/parts/UserModal';
import { UsersTable } from './table/UsersTable';

export const DeletedDealers = () => {
    const [activeTab] = useState<UsersListType>(UsersType.DELETED);
    const [addUserModalEnabled, setAddUserModalEnabled] = useState<boolean>(false);

    const handleAddUserModalOpen = () => setAddUserModalEnabled(!addUserModalEnabled);

    return (
        <QueryRequestProvider>
            <QueryResponseProvider listType={activeTab}>
                {addUserModalEnabled && (
                    <CustomModal onClose={handleAddUserModalOpen} title={'Add dealer'}>
                        <UserModal onClose={handleAddUserModalOpen} />
                    </CustomModal>
                )}
                <div className='card'>
                    <div className='card-body'>
                        <div className='tab-content' id='myTabContentInner'>
                            <UsersTable list={UsersType.DELETED} />
                        </div>
                    </div>
                </div>
            </QueryResponseProvider>
        </QueryRequestProvider>
    );
};
