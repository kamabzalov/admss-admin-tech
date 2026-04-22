import { Lead, LeadStatusApi } from 'common/interfaces/Lead';
import { leadsKeys } from 'common/app-consts';
import { getApiErrorMessage } from 'common/error-utils';
import { ShowEmptyLeadFields } from 'common/settings/settings';
import { humanizeSnakeCase, isEmptyValue, toStringOrEmpty } from 'common/utils';
import { formatServerDateForDisplay } from 'components/dashboard/helpers/common';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import {
    buildConvertLeadPayload,
    convertLead,
    deleteLead,
    getLead,
    updateLead,
    UpdateLeadPayload,
    updateLeadStatus,
} from 'components/dashboard/leads/leads.service';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { ConfirmModal } from 'components/dashboard/helpers/modal/confirmModal';
import {
    LEAD_STATUS_BY_CODE,
    STATUS_OPTIONS,
} from 'components/dashboard/leads/constants/leads.constants';

const isDateLikeFieldKey = (fieldKey: string): boolean =>
    fieldKey === 'created' || fieldKey === 'updated' || fieldKey.endsWith('_at');

const formatFieldValue = (fieldKey: string, value: unknown): string => {
    if (isEmptyValue(value)) {
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
    return 'submitted';
};

const formatStatusLabel = (status: LeadStatusApi): string =>
    STATUS_OPTIONS.find((option) => option.value === status)?.label || status;

const companyFields: LeadField[] = ['company_name', 'company_address', 'city', 'state', 'zip'];
const contactFields: LeadField[] = ['first_name', 'last_name', 'email', 'phone'];

const editableFields: LeadField[] = [...companyFields, ...contactFields];
const requiredEditableFields: LeadField[] = ['company_name', 'email'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputTypeByFieldKey = (fieldKey: LeadField): string => {
    if (fieldKey === 'email') return 'email';
    if (fieldKey === 'phone') return 'tel';
    return 'text';
};

const buildDraftFromRecord = (record: Record<string, unknown> | null): Record<string, string> => {
    return editableFields.reduce<Record<string, string>>((acc, fieldKey) => {
        acc[fieldKey] = toStringOrEmpty(record?.[fieldKey]);
        return acc;
    }, {});
};
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
    const [editDraft, setEditDraft] = useState<Record<string, string>>({});
    const [editErrors, setEditErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [pendingStatus, setPendingStatus] = useState<LeadStatusApi | null>(null);
    const { handleShowToast } = useToast();
    const navigate = useNavigate();
    const showToastRef = useRef(handleShowToast);

    useEffect(() => {
        showToastRef.current = handleShowToast;
    }, [handleShowToast]);

    useEffect(() => {
        setEditDraft(buildDraftFromRecord(leadRecord));
        setEditErrors({});
        setPendingStatus(null);
    }, [leadRecord]);

    const fetchLead = useCallback(async (): Promise<void> => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await getLead(id);
            setLeadRecord(data as unknown as Record<string, unknown>);
        } catch (err) {
            showToastRef.current({
                message: getApiErrorMessage(err, 'Failed to load lead'),
                type: 'danger',
            });
            setLeadRecord(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const shouldDisplayField = useCallback(
        (value: unknown): boolean => ShowEmptyLeadFields || !isEmptyValue(value),
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
    const selectedStatus = pendingStatus ?? status;
    const canConvert = status === 'approved' && !isLoading && !isActionLoading;
    const showConversionInfo = status === 'converted' || conversionRows.length > 0;

    const getFieldValue = useCallback(
        (fieldKey: string): unknown => {
            if (fieldKey === 'lead_status') {
                return formatStatusLabel(selectedStatus);
            }
            return leadRecord?.[fieldKey];
        },
        [leadRecord, selectedStatus]
    );

    const handleDraftChange = (fieldKey: string, value: string) => {
        setEditDraft((prev) => ({ ...prev, [fieldKey]: value }));
        if (editErrors[fieldKey]) {
            setEditErrors((prev) => {
                const next = { ...prev };
                delete next[fieldKey];
                return next;
            });
        }
    };

    const validateDraft = (): Record<string, string> => {
        const errors: Record<string, string> = {};
        editableFields.forEach((fieldKey) => {
            const raw = (editDraft[fieldKey] ?? '').trim();
            if (requiredEditableFields.includes(fieldKey) && !raw) {
                errors[fieldKey] = `${
                    leadsKeys[fieldKey] ?? humanizeSnakeCase(fieldKey)
                } is required`;
                return;
            }
            if (fieldKey === 'email' && raw && !EMAIL_PATTERN.test(raw)) {
                errors[fieldKey] = 'Invalid email format';
            }
        });
        return errors;
    };

    const originalDraft = useMemo(() => buildDraftFromRecord(leadRecord), [leadRecord]);
    const hasEditableChanges = useMemo(
        () =>
            editableFields.some(
                (fieldKey) => (editDraft[fieldKey] ?? '') !== originalDraft[fieldKey]
            ),
        [editDraft, originalDraft]
    );
    const hasStatusChanges = pendingStatus !== null && pendingStatus !== status;
    const isDirty = hasEditableChanges || hasStatusChanges;

    const handleSave = async () => {
        if (!id) return;
        const errors = validateDraft();
        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }
        try {
            setIsSaving(true);
            if (hasEditableChanges) {
                const payload: UpdateLeadPayload = editableFields.reduce<UpdateLeadPayload>(
                    (acc, fieldKey) => {
                        const raw = (editDraft[fieldKey] ?? '').trim();
                        (acc as Record<string, string>)[fieldKey] = raw;
                        return acc;
                    },
                    {}
                );
                await updateLead(id, payload);
            }
            if (hasStatusChanges && pendingStatus) {
                await updateLeadStatus(id, pendingStatus);
            }
            await fetchLead();
            handleShowToast({
                message: 'Lead successfully updated',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to update lead'),
                type: 'danger',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const renderSection = (title: string, fieldKeys: LeadField[], editable = false) => {
        const sectionRows = fieldKeys
            .map((fieldKey) => ({ key: fieldKey, value: getFieldValue(fieldKey) }))
            .filter(({ value }) => editable || shouldDisplayField(value));

        return (
            <div className='card shadow-sm mb-6'>
                <div className='card-header'>
                    <h4 className='card-title m-0'>{title}</h4>
                </div>
                <div className='card-body py-6'>
                    {sectionRows.length === 0 ? (
                        <div className='text-muted'>No data available.</div>
                    ) : (
                        sectionRows.map(({ key, value }) => {
                            const label = leadsKeys[key] ?? humanizeSnakeCase(key);
                            if (editable) {
                                const isRequired = requiredEditableFields.includes(key);
                                const errorMessage = editErrors[key];
                                return (
                                    <div className='row mb-5 col-md-6' key={key}>
                                        <label
                                            className={`col-lg-4 fw-bold text-muted ${
                                                isRequired ? 'required' : ''
                                            }`}
                                        >
                                            {label}
                                        </label>
                                        <div className='col-lg-8'>
                                            <input
                                                type={inputTypeByFieldKey(key)}
                                                autoComplete='off'
                                                className={`form-control form-control-sm ${
                                                    errorMessage ? 'is-invalid' : ''
                                                }`}
                                                value={editDraft[key] ?? ''}
                                                onChange={(event) =>
                                                    handleDraftChange(key, event.target.value)
                                                }
                                                disabled={isSaving || isLoading || isActionLoading}
                                            />
                                            {errorMessage && (
                                                <div className='fv-plugins-message-container'>
                                                    <span role='alert' className='text-danger'>
                                                        {errorMessage}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className='row mb-5 col-md-6' key={key}>
                                    <label className='col-lg-4 fw-bold text-muted'>{label}</label>
                                    <div className='col-lg-8'>
                                        <span className='fw-bolder fs-6 text-dark'>
                                            {formatFieldValue(key, value)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    };

    const handleStatusChange = (newStatus: LeadStatusApi) => {
        setPendingStatus(newStatus === status ? null : newStatus);
    };

    const handleConvert = async () => {
        if (!id || status !== 'approved') return;
        const leadData = leadRecord as Partial<Lead> | null;
        const hasFirstName =
            typeof leadData?.first_name === 'string' && leadData.first_name.trim() !== '';
        const hasLastName =
            typeof leadData?.last_name === 'string' && leadData.last_name.trim() !== '';
        if (!hasFirstName || !hasLastName) {
            handleShowToast({
                message: 'Lead must have first name and last name before conversion',
                type: 'danger',
            });
            return;
        }
        try {
            setIsActionLoading(true);
            await convertLead(id, buildConvertLeadPayload(leadData));
            await fetchLead();
            handleShowToast({
                message: 'Lead successfully converted',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to convert lead'),
                type: 'danger',
            });
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
                message: 'Lead successfully deleted',
                type: 'success',
            });
            navigate('/dashboard/leads');
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to delete lead'),
                type: 'danger',
            });
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
                                value={selectedStatus}
                                disabled={!id || isLoading || isActionLoading || isSaving}
                                onChange={(event) =>
                                    handleStatusChange(event.target.value as LeadStatusApi)
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
                        <ActionButton
                            icon='arrow-left'
                            className='w-175px'
                            buttonClickAction={() => navigate('/dashboard/leads')}
                            appearance='light'
                        >
                            Back to leads
                        </ActionButton>
                        <ActionButton
                            icon='arrows-circle'
                            className='w-175px'
                            buttonClickAction={() => void fetchLead()}
                            disabled={isLoading || isActionLoading}
                        >
                            Refresh
                        </ActionButton>
                        <ActionButton
                            icon='check-circle'
                            className='w-175px'
                            buttonClickAction={() => void handleConvert()}
                            appearance='primary'
                            disabled={!canConvert}
                            title={
                                status !== 'approved'
                                    ? 'Lead can be converted only in Approved status'
                                    : undefined
                            }
                        >
                            Convert
                        </ActionButton>
                        <ActionButton
                            className='ms-auto w-175px'
                            icon='check'
                            buttonClickAction={() => void handleSave()}
                            appearance='primary'
                            disabled={!id || isLoading || isActionLoading || isSaving || !isDirty}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </ActionButton>
                        <ActionButton
                            icon='trash'
                            className='w-175px'
                            buttonClickAction={() => setIsDeleteModalOpen(true)}
                            appearance='danger'
                            disabled={!id || isLoading || isActionLoading || isSaving}
                        >
                            Delete
                        </ActionButton>
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
                        {renderSection('Company', companyFields, true)}
                        {renderSection('Contact', contactFields, true)}
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
                                            <div className='row mb-5 col-md-6' key={key}>
                                                <label className='col-lg-4 fw-bold text-muted'>
                                                    {leadsKeys[key] ?? humanizeSnakeCase(key)}
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
                                        <div className='row mb-5 col-md-6' key={key}>
                                            <label className='col-lg-4 fw-bold text-muted'>
                                                {leadsKeys[key] ?? humanizeSnakeCase(key)}
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
