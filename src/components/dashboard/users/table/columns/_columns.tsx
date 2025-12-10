// @ts-nocheck
import { Column } from 'react-table';
import { UserCustomHeader } from './UserCustomHeader';
import { UserLinkCell } from './UserLinkCell';
import { UserActionsCell } from './UserActionsCell';
import { DeletedUsersActionsCell } from './DeletedUsersActionsCell';
import { UsersListType, User, UsersType } from 'common/interfaces/UserData';

export const usersColumns = (list: UsersListType): ReadonlyArray<Column<User>> => {
    const { ACTIVE, DELETED } = UsersType;
    const generalColumns = [
        {
            Header: (props) => (
                <UserCustomHeader tableProps={props} title='Dealer name' className='w-300px' />
            ),
            id: 'username',
            Cell: ({ ...props }) => {
                const { useruid, username }: User = props.data[props.row.index];
                return <UserLinkCell useruid={useruid} username={username} />;
            },
        },
    ];

    const actionColumn = {
        Header: 'Actions',
        id: 'actions',

        Cell: ({ ...props }) => {
            const { useruid, username }: User = props.data[props.row.index];
            switch (list) {
                case ACTIVE:
                    return <UserActionsCell useruid={useruid} username={username} />;
                case DELETED:
                    return <DeletedUsersActionsCell useruid={useruid} username={username} />;
            }
        },
    };

    const userColumns = [
        {
            Header: 'Created by',
            accessor: 'creatorusername',
        },
        {
            Header: 'Is admin',
            id: 'isadmin',
            Cell: ({ ...props }) => (props.data[props.row.index].isadmin ? 'yes' : 'no'),
        },
    ];

    return list === ACTIVE
        ? [...generalColumns, ...userColumns, actionColumn]
        : [...generalColumns, actionColumn];
};
