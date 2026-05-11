import { DealerStatusApi } from 'common/interfaces/Dealer';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import {
    DEALER_STATUS_BADGE_CLASS,
    DEALER_STATUS_OPTIONS,
} from 'components/dashboard/dealers/constants/dealers.constants';
import { formatStatusLabel } from 'components/dashboard/dealers/parts/helpers';

interface DealerCardHeaderProps {
    dealerName: string;
    selectedStatus: DealerStatusApi;
    onStatusChange: (next: DealerStatusApi) => void;
    onBack: () => void;
    onRefresh: () => void;
    onSave: () => void;
    onDelete: () => void;
    isLoading: boolean;
    isActionLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    canInteract: boolean;
}

export const DealerCardHeader = ({
    dealerName,
    selectedStatus,
    onStatusChange,
    onBack,
    onRefresh,
    onSave,
    onDelete,
    isLoading,
    isActionLoading,
    isSaving,
    isDirty,
    canInteract,
}: DealerCardHeaderProps) => {
    const badgeClass = DEALER_STATUS_BADGE_CLASS[selectedStatus] ?? 'badge-light';
    const isBusy = isLoading || isActionLoading || isSaving;

    return (
        <div className='card-header'>
            <div className='w-100 py-4'>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-3 my-6'>
                    <div className='d-flex align-items-center gap-4'>
                        <h3 className='fw-bolder m-0'>Dealer {dealerName}</h3>
                        <span className={`badge ${badgeClass} fs-7 fw-bolder`}>
                            {formatStatusLabel(selectedStatus)}
                        </span>
                    </div>
                    <div className='d-flex align-items-center gap-3 ms-auto'>
                        <label className='text-muted fw-bold mb-0'>Status</label>
                        <select
                            className='form-select form-select-sm w-250px'
                            value={selectedStatus}
                            disabled={!canInteract || isBusy}
                            onChange={(event) =>
                                onStatusChange(event.target.value as DealerStatusApi)
                            }
                        >
                            {DEALER_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='d-flex align-items-center flex-wrap gap-3'>
                    <ActionButton
                        icon='arrow-left'
                        className='w-175px'
                        buttonClickAction={onBack}
                        appearance='light'
                    >
                        Back to dealers
                    </ActionButton>
                    <ActionButton
                        icon='arrows-circle'
                        className='w-175px'
                        buttonClickAction={onRefresh}
                        disabled={isLoading || isActionLoading}
                    >
                        Refresh
                    </ActionButton>
                    <ActionButton
                        className='ms-auto w-175px'
                        icon='check'
                        buttonClickAction={onSave}
                        appearance='primary'
                        disabled={!canInteract || isBusy || !isDirty}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </ActionButton>
                    <ActionButton
                        icon='trash'
                        className='w-175px'
                        buttonClickAction={onDelete}
                        appearance='danger'
                        disabled={!canInteract || isBusy}
                    >
                        Delete
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};
