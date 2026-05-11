import { Link } from 'react-router-dom';

interface DealerSourceLeadCardProps {
    sourceLeadUid: string;
}

export const DealerSourceLeadCard = ({ sourceLeadUid }: DealerSourceLeadCardProps) => {
    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>Source lead</h4>
            </div>
            <div className='card-body py-6'>
                <div className='row'>
                    <label className='col-lg-2 fw-bold text-muted'>Lead ID</label>
                    <div className='col-lg-10'>
                        <Link
                            to={`/dashboard/lead/${sourceLeadUid}`}
                            className='fw-bolder text-primary'
                        >
                            {sourceLeadUid}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
