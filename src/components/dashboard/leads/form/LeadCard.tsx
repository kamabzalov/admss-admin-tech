import { AxiosError } from 'axios';
import { Lead, LeadStatusApi } from 'common/interfaces/Lead';
import { leadsKeys } from 'common/app-consts';
import { ShowEmptyLeadFields } from 'common/settings/settings';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import {
    buildConvertLeadPayload,
    convertLead,
    deleteLead,
    getLead,
    updateLeadStatus,
} from 'components/dashboard/leads/leads.service';
import { PrimaryButton } from 'components/dashboard/smallComponents/buttons/PrimaryButton';
import { ConfirmModal } from 'components/dashboard/helpers/modal/confirmModal';
import {
    LEAD_MESSAGES,
    LEAD_STATUS_BY_CODE,
    LeadStatus,
    STATUS_OPTIONS,
} from 'components/dashboard/leads/constants/leads.constants';

const isEmpty = (value: unknown): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    return false;
};

const isDateLikeFieldKey = (fieldKey: string): boolean =>
    fieldKey === 'created' || fieldKey === 'updated' || fieldKey.endsWith('_at');

const formatFieldValue = (fieldKey: string, value: unknown): string => {
    if (isEmpty(value)) {
        return '-';
    }
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (isDateLikeFieldKey(fieldKey)) {
        return formatServerDateForDisplay(value);
    }
    return String(value);
};

type LeadField = keyof Lead;

const LEAD_FIELD_ORDER: LeadField[] = [
    'id',
    'created',
    'updated',
    'status',
    'lead_status',
    'status_code',
    'source',
    'source_code',
    'source_details',
    'company_name',
    'company_address',
    'city',
    'state',
    'zip',
    'first_name',
    'last_name',
    'email',
    'phone',
    'dealer_type',
    'referral_code',
    'notes',
    'recaptcha_verified',
    'reviewed_by_user_uid',
    'reviewed_at',
    'review_notes',
];

const humanizeKey = (key: string): string =>
    key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char, index) => (index === 0 ? char.toUpperCase() : char));

const sortLeadKeys = (keys: string[]): string[] => {
    const orderMap = new Map(LEAD_FIELD_ORDER.map((fieldKey, index) => [fieldKey, index]));
    const unknownRank = LEAD_FIELD_ORDER.length;
    return [...keys].sort((leftKey, rightKey) => {
        const rankLeft = orderMap.has(leftKey as LeadField)
            ? orderMap.get(leftKey as LeadField)!
            : unknownRank;
        const rankRight = orderMap.has(rightKey as LeadField)
            ? orderMap.get(rightKey as LeadField)!
            : unknownRank;
        if (rankLeft !== rankRight) return rankLeft - rankRight;
        return leftKey.localeCompare(rightKey);
    });
};

const normalizeLeadStatus = (leadRecord: Record<string, unknown> | null): LeadStatusApi => {
    const leadStatus = leadRecord?.lead_status;
    if (
        typeof leadStatus === 'string' &&
        STATUS_OPTIONS.some((option) => option.value === leadStatus)
    ) {
        return leadStatus as LeadStatusApi;
    }
    const statusCode = leadRecord?.status_code;
    if (typeof statusCode === 'number' && LEAD_STATUS_BY_CODE[statusCode]) {
        return LEAD_STATUS_BY_CODE[statusCode];
    }
    return LeadStatus.SUBMITTED;
};

const formatStatusLabel = (status: LeadStatusApi): string =>
    STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

const companyFields: LeadField[] = ['company_name', 'company_address', 'city', 'state', 'zip'];
const contactFields: LeadField[] = ['first_name', 'last_name', 'email', 'phone'];
const generalFields: LeadField[] = [
    'status',
    'lead_status',
    'source',
    'referral_code',
    'notes',
    'review_notes',
    'created',
    'updated',
    'reviewed_at',
];
const conversionFields: LeadField[] = [
    'dealer_id',
    'converted_at',
    'converted_by',
    'converted_by_user_uid',
    'converted_by_user_id',
    'converted_by_username',
    'converted_to_dealer_uid',
];

export const LeadCard = () => {
    const { id } = useParams();
    const [leadRecord, setLeadRecord] = useState<Record<string, unknown> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const { handleShowToast } = useToast();
    const navigate = useNavigate();
    const showToastRef = useRef(handleShowToast);

    useEffect(() => {
        showToastRef.current = handleShowToast;
    }, [handleShowToast]);

    const fetchLead = useCallback(async (): Promise<void> => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await getLead(id);
            setLeadRecord(data as unknown as Record<string, unknown>);
        } catch (err) {
            const { message } = err as Error | AxiosError;
            showToastRef.current({ message, type: 'danger' });
            setLeadRecord(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const shouldDisplayField = useCallback(
        (value: unknown): boolean => ShowEmptyLeadFields || !isEmpty(value),
        []
    );

    useEffect(() => {
        void fetchLead();
    }, [fetchLead]);

    const rows = useMemo(() => {
        if (!leadRecord) return [];
        const keys = sortLeadKeys(Object.keys(leadRecord));
        return keys
            .map((key) => ({ key, value: leadRecord[key] }))
            .filter(({ value }) => shouldDisplayField(value));
    }, [leadRecord, shouldDisplayField]);
    const status = useMemo(() => normalizeLeadStatus(leadRecord), [leadRecord]);
    const leadCompanyName = useMemo(() => {
        const companyName = leadRecord?.company_name;
        if (typeof companyName === 'string' && companyName.trim() !== '') return companyName;
        return 'unknown';
    }, [leadRecord]);
    const conversionRows = useMemo(
        () => rows.filter(({ key }) => conversionFields.includes(key as keyof Lead)),
        [rows]
    );
    const displayedSectionKeys = useMemo(
        () =>
            new Set<LeadField>([
                ...companyFields,
                ...contactFields,
                ...generalFields,
                ...conversionFields,
            ]),
        []
    );
    const otherRows = useMemo(
        () => rows.filter(({ key }) => !displayedSectionKeys.has(key as LeadField)),
        [rows, displayedSectionKeys]
    );
    const canConvert = status === LeadStatus.APPROVED && !isLoading && !isActionLoading;
    const showConversionInfo = status === LeadStatus.CONVERTED || conversionRows.length > 0;

    const getFieldValue = useCallback(
        (fieldKey: string): unknown => {
            if (fieldKey === 'lead_status') {
                return formatStatusLabel(status);
            }
            return leadRecord?.[fieldKey];
        },
        [leadRecord, status]
    );

    const renderSection = (title: string, fieldKeys: LeadField[]) => {
        const sectionRows = fieldKeys
            .map((fieldKey) => ({ key: fieldKey, value: getFieldValue(fieldKey) }))
            .filter(({ value }) => shouldDisplayField(value));

        return (
            <div className='card shadow-sm mb-6'>
                <div className='card-header'>
                    <h4 className='card-title m-0'>{title}</h4>
                </div>
                <div className='card-body py-6'>
                    {sectionRows.length === 0 ? (
                        <div className='text-muted'>No data available.</div>
                    ) : (
                        sectionRows.map(({ key, value }) => (
                            <div className='row mb-5' key={key}>
                                <label className='col-lg-4 fw-bold text-muted'>
                                    {leadsKeys[key] ?? humanizeKey(key)}
                                </label>
                                <div className='col-lg-8'>
                                    <span className='fw-bolder fs-6 text-dark'>
                                        {formatFieldValue(key, value)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const handleStatusChange = async (newStatus: LeadStatusApi) => {
        if (!id || !leadRecord || newStatus === status) return;
        try {
            setIsActionLoading(true);
            await updateLeadStatus(id, newStatus);
            await fetchLead();
            handleShowToast({
                message: LEAD_MESSAGES.STATUS_UPDATED,
                type: 'success',
            });
        } catch (err) {
            const { message } = err as Error | AxiosError;
            handleShowToast({ message, type: 'danger' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleConvert = async () => {
        if (!id || status !== LeadStatus.APPROVED) return;
        const leadData = leadRecord as Partial<Lead> | null;
        const hasFirstName =
            typeof leadData?.first_name === 'string' && leadData.first_name.trim() !== '';
        const hasLastName =
            typeof leadData?.last_name === 'string' && leadData.last_name.trim() !== '';
        if (!hasFirstName || !hasLastName) {
            handleShowToast({
                message: LEAD_MESSAGES.MISSING_REQUIRED_NAMES,
                type: 'danger',
            });
            return;
        }
        try {
            setIsActionLoading(true);
            await convertLead(id, buildConvertLeadPayload(leadData));
            await fetchLead();
            handleShowToast({
                message: LEAD_MESSAGES.CONVERTED,
                type: 'success',
            });
        } catch (err) {
            const { message } = err as Error | AxiosError;
            handleShowToast({ message, type: 'danger' });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;
        try {
            setIsActionLoading(true);
            await deleteLead(id);
            setIsDeleteModalOpen(false);
            handleShowToast({
                message: LEAD_MESSAGES.DELETED,
                type: 'success',
            });
            navigate('/dashboard/leads');
        } catch (err) {
            const { message } = err as Error | AxiosError;
            handleShowToast({ message, type: 'danger' });
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className='card mb-5 mb-xl-10'>
            <ConfirmModal
                show={isDeleteModalOpen}
                onConfirm={() => void handleDeleteConfirm()}
                onCancel={() => setIsDeleteModalOpen(false)}
                message={`Are you sure you want to delete lead "${leadCompanyName}"?`}
            />
            <div className='card-header'>
                <div className='w-100 py-4'>
                    <div className='d-flex align-items-center justify-content-between flex-wrap gap-3 my-6'>
                        <h3 className='fw-bolder m-0'>Lead {leadCompanyName}</h3>
                        <div className='d-flex align-items-center gap-3 ms-auto'>
                            <label className='text-muted fw-bold mb-0'>Status</label>
                            <select
                                className='form-select form-select-sm w-175px'
                                value={status}
                                disabled={!id || isLoading || isActionLoading}
                                onChange={(event) =>
                                    void handleStatusChange(event.target.value as LeadStatusApi)
                                }
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='d-flex align-items-center flex-wrap gap-3'>
                        <PrimaryButton
                            icon='arrow-left'
                            buttonClickAction={() => navigate('/dashboard/leads')}
                            appearance='light'
                        >
                            Back to leads
                        </PrimaryButton>
                        <PrimaryButton
                            icon='arrows-circle'
                            buttonClickAction={() => void fetchLead()}
                            disabled={isLoading || isActionLoading}
                        >
                            Refresh
                        </PrimaryButton>
                        <PrimaryButton
                            icon='check-circle'
                            buttonClickAction={() => void handleConvert()}
                            appearance='primary'
                            disabled={!canConvert}
                            title={
                                status !== LeadStatus.APPROVED
                                    ? LEAD_MESSAGES.CONVERT_APPROVED_ONLY
                                    : undefined
                            }
                        >
                            Convert
                        </PrimaryButton>
                        <PrimaryButton
                            className='ms-auto'
                            icon='trash'
                            buttonClickAction={() => setIsDeleteModalOpen(true)}
                            appearance='danger'
                            disabled={!id || isLoading || isActionLoading}
                        >
                            Delete
                        </PrimaryButton>
                    </div>
                </div>
            </div>
            <div className='card-body p-9 position-relative'>
                {isLoading && (
                    <div className='processing-overlay cursor-default position-absolute w-100 h-100 d-flex align-items-center justify-content-center start-0 top-0'>
                        <div className='p-6 bg-white rounded-2 shadow-sm'>Loading...</div>
                    </div>
                )}
                {!id && <div className='text-muted'>Lead ID is missing.</div>}
                {id && !isLoading && !leadRecord && (
                    <div className='text-muted'>Lead not found or could not be loaded.</div>
                )}
                {leadRecord && (
                    <>
                        {renderSection('Company', companyFields)}
                        {renderSection('Contact', contactFields)}
                        {renderSection('General', generalFields)}
                        {showConversionInfo && (
                            <div className='card shadow-sm mb-6'>
                                <div className='card-header'>
                                    <h4 className='card-title m-0'>Conversion info</h4>
                                </div>
                                <div className='card-body py-6'>
                                    {conversionRows.length === 0 ? (
                                        <div className='text-muted'>
                                            No conversion details available.
                                        </div>
                                    ) : (
                                        conversionRows.map(({ key, value }) => (
                                            <div className='row mb-5' key={key}>
                                                <label className='col-lg-4 fw-bold text-muted'>
                                                    {leadsKeys[key] ?? humanizeKey(key)}
                                                </label>
                                                <div className='col-lg-8'>
                                                    <span className='fw-bolder fs-6 text-dark'>
                                                        {formatFieldValue(key, value)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {otherRows.length > 0 && (
                            <div className='card shadow-sm'>
                                <div className='card-header'>
                                    <h4 className='card-title m-0'>Other fields</h4>
                                </div>
                                <div className='card-body py-6'>
                                    {otherRows.map(({ key, value }) => (
                                        <div className='row mb-5' key={key}>
                                            <label className='col-lg-4 fw-bold text-muted'>
                                                {leadsKeys[key] ?? humanizeKey(key)}
                                            </label>
                                            <div className='col-lg-8'>
                                                <span className='fw-bolder fs-6 text-dark'>
                                                    {formatFieldValue(key, value)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
