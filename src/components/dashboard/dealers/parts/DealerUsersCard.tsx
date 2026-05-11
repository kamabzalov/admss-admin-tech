import { DealerUser } from 'common/interfaces/Dealer';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';

interface DealerUsersCardProps {
    users: DealerUser[];
    onOpenUser: (useruid: string) => void;
}

export const DealerUsersCard = ({ users, onOpenUser }: DealerUsersCardProps) => {
    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>
                    Users
                    <span className='ms-2 fs-6 text-muted fw-bold'>({users.length})</span>
                </h4>
            </div>
            <div className='card-body py-6'>
                {users.length === 0 ? (
                    <div className='text-muted'>No users associated with this dealer.</div>
                ) : (
                    <div className='table-responsive'>
                        <table className='table align-middle table-row-dashed fs-6 gy-3'>
                            <thead>
                                <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Parent user</th>
                                    <th>Enabled</th>
                                    <th>Created</th>
                                    <th style={{ width: 80 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-600 fw-bold'>
                                {users.map((user) => {
                                    const isEnabled = user.enabled === 1;
                                    return (
                                        <tr key={user.useruid}>
                                            <td>
                                                <div className='d-flex align-items-center gap-2'>
                                                    <span>{user.username || '-'}</span>
                                                    {user.isadmin === 1 && (
                                                        <span className='badge badge-light-primary fs-8'>
                                                            Admin
                                                        </span>
                                                    )}
                                                    {user.issubuser && (
                                                        <span className='badge badge-light-info fs-8'>
                                                            Subuser
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{user.rolename || '-'}</td>
                                            <td>
                                                {user.parentusername || user.creatorusername || '-'}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge fs-8 fw-bolder ${
                                                        isEnabled
                                                            ? 'badge-light-success'
                                                            : 'badge-light-danger'
                                                    }`}
                                                >
                                                    {isEnabled ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td>
                                                {user.created
                                                    ? formatServerDateForDisplay(user.created)
                                                    : '-'}
                                            </td>
                                            <td>
                                                <ActionButton
                                                    icon='eye'
                                                    iconOnly
                                                    appearance='light'
                                                    className='btn-sm'
                                                    buttonClickAction={() =>
                                                        onOpenUser(user.useruid)
                                                    }
                                                    aria-label='Open user card'
                                                    title='Open user card'
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
