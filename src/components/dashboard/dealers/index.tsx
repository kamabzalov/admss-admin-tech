import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dealer, DealerStatusApi } from 'common/interfaces/Dealer';
import { getApiErrorMessage } from 'common/error-utils';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { getDealers } from 'components/dashboard/dealers/dealers.service';
import {
    DEALER_STATUS_BADGE_CLASS,
    DEALER_STATUS_BY_CODE,
    DEALER_STATUS_OPTIONS,
} from 'components/dashboard/dealers/constants/dealers.constants';

const normalizeStatus = (dealer: Dealer): DealerStatusApi | null => {
    const statusValue = dealer.dealer_status;
    if (
        typeof statusValue === 'string' &&
        DEALER_STATUS_OPTIONS.some((option) => option.value === statusValue)
    ) {
        return statusValue as DealerStatusApi;
    }
    if (
        typeof dealer.dealer_status_code === 'number' &&
        DEALER_STATUS_BY_CODE[dealer.dealer_status_code]
    ) {
        return DEALER_STATUS_BY_CODE[dealer.dealer_status_code];
    }
    if (typeof statusValue === 'number' && DEALER_STATUS_BY_CODE[statusValue]) {
        return DEALER_STATUS_BY_CODE[statusValue];
    }
    return null;
};

const formatStatusLabel = (status: DealerStatusApi | null): string => {
    if (!status) return '-';
    return DEALER_STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
};

export const Dealers = () => {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { handleShowToast } = useToast();

    const loadDealers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getDealers();
            setDealers(response?.dealers ?? []);
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to load dealers'),
                type: 'danger',
            });
            setDealers([]);
        } finally {
            setIsLoading(false);
        }
    }, [handleShowToast]);

    useEffect(() => {
        void loadDealers();
    }, [loadDealers]);

    const rows = useMemo(
        () =>
            dealers.map((dealer) => {
                const status = normalizeStatus(dealer);
                return {
                    dealer,
                    status,
                    statusLabel: formatStatusLabel(status),
                    badgeClass: status ? DEALER_STATUS_BADGE_CLASS[status] : 'badge-light',
                };
            }),
        [dealers]
    );

    return (
        <div className='card'>
            <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <h3 className='m-0'>Dealers</h3>
                    <ActionButton
                        icon='arrows-circle'
                        appearance='light'
                        buttonClickAction={() => void loadDealers()}
                        disabled={isLoading}
                    >
                        Refresh
                    </ActionButton>
                </div>
                <div className='table-responsive position-relative'>
                    {isLoading && (
                        <div className='processing-overlay cursor-default position-absolute w-100 h-100 d-flex align-items-center justify-content-center'>
                            <div className='p-6 bg-white rounded-2 shadow-sm'>Processing...</div>
                        </div>
                    )}
                    <table className='table align-middle table-row-dashed fs-6 gy-3 dataTable no-footer'>
                        <thead>
                            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
                                <th>Company name</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Sandbox</th>
                                <th>Created</th>
                                <th style={{ width: 80 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 fw-bold'>
                            {rows.length > 0 ? (
                                rows.map(({ dealer, statusLabel, badgeClass }) => (
                                    <tr role='row' key={dealer.id}>
                                        <td role='cell'>{dealer.company_name || '-'}</td>
                                        <td role='cell'>
                                            <span className={`badge ${badgeClass} fs-7 fw-bolder`}>
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td role='cell'>{dealer.dealer_type || '-'}</td>
                                        <td role='cell'>{dealer.sandbox_mode ? 'Yes' : 'No'}</td>
                                        <td role='cell'>
                                            {dealer.created
                                                ? formatServerDateForDisplay(dealer.created)
                                                : '-'}
                                        </td>
                                        <td role='cell'>
                                            <ActionButton
                                                icon='eye'
                                                iconOnly
                                                appearance='light'
                                                className='btn-sm'
                                                buttonClickAction={() =>
                                                    navigate(`/dashboard/dealer/${dealer.id}`)
                                                }
                                                aria-label='Open dealer card'
                                                title='Open dealer card'
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                            No matching records found
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
