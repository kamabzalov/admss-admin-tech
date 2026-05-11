import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dealer, DealerStatusApi, DealerUser, License } from 'common/interfaces/Dealer';
import { getApiErrorMessage } from 'common/error-utils';
import { ConfirmModal } from 'components/dashboard/helpers/modal/confirmModal';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import {
    deleteDealer,
    getDealer,
    getDealerLicenses,
    getDealerLogoUrl,
    getDealerUsers,
    updateDealer,
    UpdateDealerPayload,
    updateDealerStatus,
} from 'components/dashboard/dealers/dealers.service';
import {
    DealerCardHeader,
    DealerEditableSection,
    DealerLicensesCard,
    DealerLogoCard,
    DealerSourceLeadCard,
    DealerUsersCard,
    DealerVerificationCard,
} from 'components/dashboard/dealers/parts';
import {
    buildDraftFromDealer,
    companyFields,
    contactFields,
    EditableField,
    editableFields,
    EMAIL_PATTERN,
    fieldLabel,
    getDealerName,
    licenseFields,
    normalizeStatus,
    requiredEditableFields,
} from 'components/dashboard/dealers/parts/helpers';

export const DealerCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleShowToast } = useToast();
    const showToastRef = useRef(handleShowToast);

    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [users, setUsers] = useState<DealerUser[]>([]);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [editDraft, setEditDraft] = useState<Record<EditableField, string>>(
        {} as Record<EditableField, string>
    );
    const [editErrors, setEditErrors] = useState<Partial<Record<EditableField, string>>>({});
    const [pendingStatus, setPendingStatus] = useState<DealerStatusApi | null>(null);

    const previousLogoUrlRef = useRef<string | null>(null);

    useEffect(() => {
        showToastRef.current = handleShowToast;
    }, [handleShowToast]);

    useEffect(() => {
        setEditDraft(buildDraftFromDealer(dealer));
        setEditErrors({});
        setPendingStatus(null);
    }, [dealer]);

    useEffect(() => {
        return () => {
            if (previousLogoUrlRef.current) {
                URL.revokeObjectURL(previousLogoUrlRef.current);
            }
        };
    }, []);

    const updateLogoUrl = useCallback((nextUrl: string | null) => {
        if (previousLogoUrlRef.current && previousLogoUrlRef.current !== nextUrl) {
            URL.revokeObjectURL(previousLogoUrlRef.current);
        }
        previousLogoUrlRef.current = nextUrl;
        setLogoUrl(nextUrl);
    }, []);

    const fetchDealer = useCallback(async (): Promise<void> => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await getDealer(id);
            setDealer(data);
        } catch (err) {
            showToastRef.current({
                message: getApiErrorMessage(err, 'Failed to load dealer'),
                type: 'danger',
            });
            setDealer(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const fetchUsers = useCallback(async (): Promise<void> => {
        if (!id) return;
        try {
            const response = await getDealerUsers(id);
            setUsers(response?.users ?? []);
        } catch (err) {
            showToastRef.current({
                message: getApiErrorMessage(err, 'Failed to load dealer users'),
                type: 'danger',
            });
            setUsers([]);
        }
    }, [id]);

    const fetchLicenses = useCallback(async (): Promise<void> => {
        if (!id) return;
        try {
            const response = await getDealerLicenses(id);
            setLicenses(response?.licenses ?? []);
        } catch (err) {
            setLicenses([]);
        }
    }, [id]);

    const fetchLogo = useCallback(async (): Promise<void> => {
        if (!id) return;
        const nextUrl = await getDealerLogoUrl(id);
        updateLogoUrl(nextUrl);
    }, [id, updateLogoUrl]);

    useEffect(() => {
        void fetchDealer();
        void fetchUsers();
        void fetchLicenses();
        void fetchLogo();
    }, [fetchDealer, fetchUsers, fetchLicenses, fetchLogo]);

    const status = useMemo(() => normalizeStatus(dealer), [dealer]);
    const selectedStatus = pendingStatus ?? status;

    const originalDraft = useMemo(() => buildDraftFromDealer(dealer), [dealer]);
    const hasEditableChanges = useMemo(
        () =>
            editableFields.some(
                (fieldKey) => (editDraft[fieldKey] ?? '') !== (originalDraft[fieldKey] ?? '')
            ),
        [editDraft, originalDraft]
    );
    const hasStatusChanges = pendingStatus !== null && pendingStatus !== status;
    const isDirty = hasEditableChanges || hasStatusChanges;

    const handleDraftChange = (fieldKey: EditableField, value: string) => {
        setEditDraft((prev) => ({ ...prev, [fieldKey]: value }));
        if (editErrors[fieldKey]) {
            setEditErrors((prev) => {
                const next = { ...prev };
                delete next[fieldKey];
                return next;
            });
        }
    };

    const validateDraft = (): Partial<Record<EditableField, string>> => {
        const errors: Partial<Record<EditableField, string>> = {};
        editableFields.forEach((fieldKey) => {
            const raw = (editDraft[fieldKey] ?? '').trim();
            if (requiredEditableFields.includes(fieldKey) && !raw) {
                errors[fieldKey] = `${fieldLabel(fieldKey)} is required`;
                return;
            }
            if ((fieldKey === 'email_company' || fieldKey === 'email_contact') && raw) {
                if (!EMAIL_PATTERN.test(raw)) {
                    errors[fieldKey] = 'Invalid email format';
                }
            }
        });
        return errors;
    };

    const handleStatusChange = (next: DealerStatusApi) => {
        setPendingStatus(next === status ? null : next);
    };

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
                const payload = editableFields.reduce<UpdateDealerPayload>((acc, fieldKey) => {
                    const raw = (editDraft[fieldKey] ?? '').trim();
                    (acc as Record<string, string>)[fieldKey] = raw;
                    return acc;
                }, {});
                await updateDealer(id, payload);
            }
            if (hasStatusChanges && pendingStatus) {
                await updateDealerStatus(id, pendingStatus);
            }
            await fetchDealer();
            handleShowToast({
                message: 'Dealer successfully updated',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to update dealer'),
                type: 'danger',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;
        try {
            setIsActionLoading(true);
            await deleteDealer(id);
            setIsDeleteModalOpen(false);
            handleShowToast({
                message: 'Dealer successfully deleted',
                type: 'success',
            });
            navigate('/dashboard');
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to delete dealer'),
                type: 'danger',
            });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRefreshAll = () => {
        void fetchDealer();
        void fetchUsers();
        void fetchLicenses();
        void fetchLogo();
    };

    const dealerName = getDealerName(dealer);
    const sourceLeadUid = dealer?.source_lead_uid;
    const sectionsDisabled = isSaving || isLoading || isActionLoading;

    return (
        <div className='card mb-5 mb-xl-10'>
            <ConfirmModal
                show={isDeleteModalOpen}
                onConfirm={() => void handleDeleteConfirm()}
                onCancel={() => setIsDeleteModalOpen(false)}
                message={`Are you sure you want to delete dealer "${dealerName}"?`}
            />
            <DealerCardHeader
                dealerName={dealerName}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                onBack={() => navigate('/dashboard')}
                onRefresh={handleRefreshAll}
                onSave={() => void handleSave()}
                onDelete={() => setIsDeleteModalOpen(true)}
                isLoading={isLoading}
                isActionLoading={isActionLoading}
                isSaving={isSaving}
                isDirty={isDirty}
                canInteract={Boolean(id)}
            />

            <div className='card-body p-9 position-relative'>
                {isLoading && (
                    <div className='processing-overlay cursor-default position-absolute w-100 h-100 d-flex align-items-center justify-content-center start-0 top-0'>
                        <div className='p-6 bg-white rounded-2 shadow-sm'>Loading...</div>
                    </div>
                )}
                {!id && <div className='text-muted'>Dealer ID is missing.</div>}
                {id && !isLoading && !dealer && (
                    <div className='text-muted'>Dealer not found or could not be loaded.</div>
                )}
                {dealer && id && (
                    <>
                        <DealerLogoCard
                            dealerId={id}
                            dealerName={dealerName}
                            logoUrl={logoUrl}
                            onAfterUpload={fetchLogo}
                            disabled={sectionsDisabled}
                        />
                        {sourceLeadUid && <DealerSourceLeadCard sourceLeadUid={sourceLeadUid} />}
                        <DealerEditableSection
                            title='Company'
                            fields={companyFields}
                            draft={editDraft}
                            errors={editErrors}
                            onChange={handleDraftChange}
                            disabled={sectionsDisabled}
                        />
                        <DealerEditableSection
                            title='Contact'
                            fields={contactFields}
                            draft={editDraft}
                            errors={editErrors}
                            onChange={handleDraftChange}
                            disabled={sectionsDisabled}
                        />
                        <DealerEditableSection
                            title='License'
                            fields={licenseFields}
                            draft={editDraft}
                            errors={editErrors}
                            onChange={handleDraftChange}
                            disabled={sectionsDisabled}
                        />
                        <DealerVerificationCard dealer={dealer} />
                        <DealerUsersCard
                            users={users}
                            onOpenUser={(useruid) => navigate(`/dashboard/user/${useruid}`)}
                        />
                        <DealerLicensesCard licenses={licenses} />
                    </>
                )}
            </div>
        </div>
    );
};
