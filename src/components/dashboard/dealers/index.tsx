import { useEffect, useState } from 'react';
import { getDealers } from './dealers.service';
import { Dealer } from '../../../common/interfaces/Dealer';

export const Dealers = () => {
    const [dealers, setDealers] = useState<Dealer[]>([]);

    useEffect(() => {
        getDealers().then((response) => {
            if (response.dealers.length) {
                setDealers(response.dealers);
            }
            // eslint-disable-next-line no-console
            console.log(dealers);
        });
    }, []);

    return (
        <div className='card'>
            <div className='card-body'>
                <div className='table-responsive'>
                    <table className='table align-middle table-row-dashed fs-6 gy-3 dataTable no-footer'>
                        <thead>
                            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                                <th>Company name</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Sandbox mode</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 fw-bold'>
                            {dealers.map((dealer) => {
                                return (
                                    <tr role='row' key={dealer.id}>
                                        <td role='cell'>{dealer.company_name}</td>
                                        <td role='cell'>{dealer.dealer_status}</td>
                                        <td role='cell'>{dealer.dealer_type}</td>
                                        <td role='cell'>{dealer.sandbox_mode}</td>
                                        <td role='cell'>{dealer.created}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
