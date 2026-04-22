import { Lead, LeadStatusApi } from 'common/interfaces/Lead';
import { getApiErrorMessage } from 'common/error-utils';
import { DefaultRecordsPerPage, RecordsPerPage } from 'common/settings/settings';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from 'components/dashboard/helpers/modal/confirmModal';
import { CustomModal } from 'components/dashboard/helpers/modal/renderModalHelper';
import { CustomPagination } from 'components/dashboard/helpers/pagination/renderPagination';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { CustomDropdown } from 'components/dashboard/helpers/renderDropdownHelper';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { deleteLead, getLeads, updateLeadStatus } from 'components/dashboard/leads/leads.service';
import {
    LEAD_STATUS_BY_CODE,
    STATUS_OPTIONS,
} from 'components/dashboard/leads/constants/leads.constants';
import { LeadCreateModal } from 'components/dashboard/leads/form/LeadCreateModal';

const normalizeStatus = (lead: Lead): LeadStatusApi => {
    if (lead.lead_status) {
        return lead.lead_status;
    }
    if (typeof lead.status_code === 'number') {
        return LEAD_STATUS_BY_CODE[lead.status_code] || 'submitted';
    }
    return 'submitted';
};

const getLeadUid = (lead: Lead): string => {
    const candidate =
        (lead as Lead & { uid?: string; id?: string; lead_uid?: string }).id ||
        (lead as Lead & { uid?: string; id?: string; lead_uid?: string }).uid ||
        (lead as Lead & { uid?: string; id?: string; lead_uid?: string }).id ||
        (lead as Lead & { uid?: string; id?: string; lead_uid?: string }).lead_uid;

    return candidate ? String(candidate) : '';
};

const getLeadDeleteLabel = (lead: Lead): string => {
    const name = lead.company_name?.trim();
    if (name) return name;
    const email = lead.email?.trim();
    if (email) return email;
    return 'this lead';
};

export const Leads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [statusFilter, setStatusFilter] = useState<LeadStatusApi[]>([]);
    const [draftStatusFilter, setDraftStatusFilter] = useState<LeadStatusApi[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentCount, setCurrentCount] = useState<RecordsPerPage>(DefaultRecordsPerPage);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [pendingDeleteUid, setPendingDeleteUid] = useState<string>('');
    const [pendingDeleteLabel, setPendingDeleteLabel] = useState<string>('');
    const navigate = useNavigate();
    const { handleShowToast } = useToast();

    const loadLeads = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await getLeads({
                top: currentCount,
                skip: currentPage * currentCount,
                status: statusFilter.length > 0 ? statusFilter : undefined,
            });
            setLeads(response.leads || []);
            setTotal(response.total || 0);
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to load leads'),
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [currentCount, currentPage, statusFilter, handleShowToast]);

    useEffect(() => {
        void loadLeads();
    }, [loadLeads]);

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
    };

    const handleCountChange = async (count: RecordsPerPage) => {
        setCurrentCount(count);
        setCurrentPage(0);
    };

    const handleStatusFilterToggle = (status: LeadStatusApi) => {
        setDraftStatusFilter((current) =>
            current.includes(status)
                ? current.filter((item) => item !== status)
                : [...current, status]
        );
    };

    const handleApplyFilters = () => {
        setStatusFilter(draftStatusFilter);
        setCurrentPage(0);
    };

    const handleResetFilters = () => {
        setDraftStatusFilter([]);
        setStatusFilter([]);
        setCurrentPage(0);
    };

    const handleStatusChange = async (leaduid: string, status: LeadStatusApi): Promise<void> => {
        try {
            await updateLeadStatus(leaduid, status);
            await loadLeads();
            handleShowToast({
                message: 'Lead status successfully updated',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to update lead status'),
                type: 'danger',
            });
        }
    };

    const openDeleteConfirm = (lead: Lead, leaduid: string): void => {
        setPendingDeleteUid(leaduid);
        setPendingDeleteLabel(getLeadDeleteLabel(lead));
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async (): Promise<void> => {
        if (!pendingDeleteUid) return;
        try {
            await deleteLead(pendingDeleteUid);
            setIsDeleteModalOpen(false);
            setPendingDeleteUid('');
            setPendingDeleteLabel('');
            await loadLeads();
            handleShowToast({
                message: 'Lead successfully deleted',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to delete lead'),
                type: 'danger',
            });
        }
    };

    return (
        <div className='card'>
            <ConfirmModal
                show={isDeleteModalOpen}
                onConfirm={() => void handleDeleteConfirm()}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setPendingDeleteUid('');
                    setPendingDeleteLabel('');
                }}
                message={`Are you sure you want to delete lead "${pendingDeleteLabel}"?`}
            />
            {isCreateModalOpen && (
                <CustomModal
                    onClose={() => setIsCreateModalOpen(false)}
                    title='Create lead'
                    width={900}
                >
                    <LeadCreateModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreated={() => void loadLeads()}
                    />
                </CustomModal>
            )}
            <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-5'>
                    <h3 className='m-0'>Leads</h3>
                    <div className='d-flex align-items-center gap-3'>
                        <ActionButton
                            icon='plus'
                            appearance='primary'
                            buttonClickAction={() => setIsCreateModalOpen(true)}
                        >
                            Add lead
                        </ActionButton>
                        <CustomDropdown
                            title={
                                statusFilter.length > 0
                                    ? `Status (${statusFilter.length})`
                                    : 'Status'
                            }
                            iconBefore='filter'
                            width={220}
                        >
                            <div className='px-5 py-3'>
                                {STATUS_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className='form-check form-check-sm form-check-custom form-check-solid mb-3'
                                    >
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            checked={draftStatusFilter.includes(option.value)}
                                            onChange={() => handleStatusFilterToggle(option.value)}
                                        />
                                        <span className='form-check-label text-gray-700 ms-2'>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <div className='separator my-1'></div>
                            <div className='d-flex justify-content-end gap-2 px-5 pt-3 pb-2'>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-light'
                                    onClick={handleResetFilters}
                                >
                                    Reset
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-primary'
                                    onClick={handleApplyFilters}
                                >
                                    Apply
                                </button>
                            </div>
                        </CustomDropdown>
                    </div>
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
                                <th>Created</th>
                                <th>Company Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City/State</th>
                                <th>Dealer Type</th>
                                <th>Source</th>
                                <th style={{ width: '110px' }}>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-gray-600 fw-bold'>
                            {leads.length > 0 ? (
                                leads.map((lead) => {
                                    const leaduid = getLeadUid(lead);

                                    return (
                                        <tr key={leaduid || lead.created}>
                                            <td>{formatServerDateForDisplay(lead.created)}</td>
                                            <td>{lead.company_name}</td>
                                            <td>{lead.email}</td>
                                            <td>{lead.phone}</td>
                                            <td>{`${lead.city || ''}${
                                                lead.city && lead.state ? ', ' : ''
                                            }${lead.state || ''}`}</td>
                                            <td>{lead.dealer_type}</td>
                                            <td>{lead.source}</td>
                                            <td>
                                                <select
                                                    className='form-select form-select-sm'
                                                    style={{ width: '110px' }}
                                                    disabled={!leaduid}
                                                    value={normalizeStatus(lead)}
                                                    onChange={(event) =>
                                                        void handleStatusChange(
                                                            leaduid,
                                                            event.target.value as LeadStatusApi
                                                        )
                                                    }
                                                >
                                                    {STATUS_OPTIONS.map((option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                {leaduid ? (
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <ActionButton
                                                            icon='pencil'
                                                            iconOnly
                                                            appearance='light'
                                                            className='btn-sm'
                                                            buttonClickAction={() =>
                                                                navigate(
                                                                    `/dashboard/lead/${leaduid}`
                                                                )
                                                            }
                                                            aria-label='Edit lead'
                                                            title='Edit'
                                                        />
                                                        <ActionButton
                                                            icon='trash'
                                                            iconOnly
                                                            appearance='danger'
                                                            className='btn-sm'
                                                            buttonClickAction={() =>
                                                                openDeleteConfirm(lead, leaduid)
                                                            }
                                                            aria-label='Delete lead'
                                                            title='Delete'
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className='text-muted'>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9}>
                                        <div className='d-flex text-center w-100 align-content-center justify-content-center'>
                                            No matching records found
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <CustomPagination
                    records={total}
                    count={currentCount}
                    initialCurrentPage={currentPage}
                    onPageChange={handlePageChange}
                    onCountChange={handleCountChange}
                />
            </div>
        </div>
    );
};
