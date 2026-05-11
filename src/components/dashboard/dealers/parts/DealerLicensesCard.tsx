import { License } from 'common/interfaces/Dealer';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';

interface DealerLicensesCardProps {
    licenses: License[];
}

export const DealerLicensesCard = ({ licenses }: DealerLicensesCardProps) => {
    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>
                    Licenses
                    <span className='ms-2 fs-6 text-muted fw-bold'>({licenses.length})</span>
                </h4>
            </div>
            <div className='card-body py-6'>
                {licenses.length === 0 ? (
                    <div className='text-muted'>No licenses found.</div>
                ) : (
                    <div className='table-responsive'>
                        <table className='table align-middle table-row-dashed fs-6 gy-3'>
                            <thead>
                                <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                                    <th>Number</th>
                                    <th>Type</th>
                                    <th>Active</th>
                                    <th>Issued</th>
                                    <th>Expires</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-600 fw-bold'>
                                {licenses.map((license, index) => {
                                    const isActive = license.is_active === 1;
                                    return (
                                        <tr key={license.id || `${index}`}>
                                            <td>{license.license_number || '-'}</td>
                                            <td>{license.license_type || '-'}</td>
                                            <td>
                                                <span
                                                    className={`badge fs-8 fw-bolder ${
                                                        isActive
                                                            ? 'badge-light-success'
                                                            : 'badge-light-danger'
                                                    }`}
                                                >
                                                    {isActive ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td>
                                                {license.issue_date
                                                    ? formatServerDateForDisplay(license.issue_date)
                                                    : '-'}
                                            </td>
                                            <td>
                                                {license.expiration_date
                                                    ? formatServerDateForDisplay(
                                                          license.expiration_date
                                                      )
                                                    : '-'}
                                            </td>
                                            <td>{license.notes || '-'}</td>
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
