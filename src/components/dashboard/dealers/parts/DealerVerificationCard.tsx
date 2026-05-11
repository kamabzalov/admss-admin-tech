import { Dealer } from 'common/interfaces/Dealer';
import { fieldLabel, formatFieldValue } from 'components/dashboard/dealers/parts/helpers';

const verificationFields: Array<keyof Dealer> = [
    'is_verified',
    'verified_at',
    'verified_by_user_uid',
    'sandbox_mode',
    'created',
    'updated',
];

interface DealerVerificationCardProps {
    dealer: Dealer;
}

export const DealerVerificationCard = ({ dealer }: DealerVerificationCardProps) => {
    const dealerRecord = dealer as unknown as Record<string, unknown>;
    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>Verification & meta</h4>
            </div>
            <div className='card-body py-6'>
                <div className='row'>
                    {verificationFields.map((key) => (
                        <div className='col-md-6 mb-5' key={String(key)}>
                            <div className='row align-items-center'>
                                <label className='col-lg-4 fw-bold text-muted'>
                                    {fieldLabel(String(key))}
                                </label>
                                <div className='col-lg-8'>
                                    <span className='fw-bolder fs-6 text-dark'>
                                        {formatFieldValue(String(key), dealerRecord[String(key)])}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
