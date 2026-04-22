import clsx from 'clsx';
import { useFormik } from 'formik';
import { DealerType } from 'common/interfaces/Lead';
import { getApiErrorMessage } from 'common/error-utils';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import * as Yup from 'yup';
import { createLead, CreateLeadPayload } from 'components/dashboard/leads/leads.service';

interface LeadCreateModalProps {
    onClose: () => void;
    onCreated: () => Promise<void> | void;
}

type LeadFormValues = CreateLeadPayload;

const dealerTypeOptions: LeadFormValues['dealer_type'][] = [
    DealerType.DISMANTLER,
    DealerType.NON_AUTOMOTIVE,
    DealerType.OTHER,
    DealerType.REBUILDER,
    DealerType.SCRAPPER,
    DealerType.INDIVIDUAL,
];

export const LeadCreateModal = ({ onClose, onCreated }: LeadCreateModalProps): JSX.Element => {
    const { handleShowToast } = useToast();

    const formik = useFormik<LeadFormValues>({
        initialValues: {
            email: '',
            company_name: '',
            company_address: '',
            city: '',
            state: '',
            zip: '',
            first_name: '',
            last_name: '',
            phone: '',
            dealer_type: DealerType.OTHER,
            referral_code: '',
            notes: '',
            source_details: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().trim().email('Invalid email format').required('Email is required'),
            company_name: Yup.string().trim().required('Company name is required'),
            company_address: Yup.string().trim().optional(),
            city: Yup.string().trim().optional(),
            state: Yup.string().trim().optional(),
            zip: Yup.string().trim().optional(),
            first_name: Yup.string().trim().optional(),
            last_name: Yup.string().trim().optional(),
            phone: Yup.string().trim().optional(),
            dealer_type: Yup.mixed<LeadFormValues['dealer_type']>()
                .oneOf(dealerTypeOptions)
                .optional(),
            referral_code: Yup.string().trim().optional(),
            notes: Yup.string().trim().optional(),
            source_details: Yup.string().trim().optional(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                const referralCode = values.referral_code?.trim() || undefined;
                const notes = values.notes?.trim() || undefined;
                const sourceDetails = values.source_details?.trim() || undefined;
                const payload: CreateLeadPayload = {
                    ...values,
                    referral_code: referralCode,
                    notes,
                    source_details: sourceDetails,
                };
                const response = await createLead(payload);
                if (response.id) {
                    handleShowToast({
                        message: 'Lead successfully created',
                        type: 'success',
                    });
                    await onCreated();
                    onClose();
                }
            } catch (err: any) {
                handleShowToast({
                    message: getApiErrorMessage(err, 'Failed to create lead'),
                    type: 'danger',
                });
            } finally {
                setSubmitting(false);
            }
        },
    });

    const renderError = (field: keyof LeadFormValues) =>
        formik.touched[field] && formik.errors[field] ? (
            <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors[field]}</span>
            </div>
        ) : null;

    return (
        <form className='form' onSubmit={formik.handleSubmit} noValidate>
            <div className='row g-6'>
                <div className='col-md-6'>
                    <label className='required form-label fw-bolder text-dark'>Email</label>
                    <input
                        type='email'
                        autoComplete='off'
                        {...formik.getFieldProps('email')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.email && formik.errors.email,
                        })}
                    />
                    {renderError('email')}
                </div>
                <div className='col-md-6'>
                    <label className='form-label fw-bolder text-dark'>Phone</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('phone')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.phone && formik.errors.phone,
                        })}
                    />
                    {renderError('phone')}
                </div>
                <div className='col-md-6'>
                    <label className='form-label fw-bolder text-dark'>First name</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('first_name')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.first_name && formik.errors.first_name,
                        })}
                    />
                    {renderError('first_name')}
                </div>
                <div className='col-md-6'>
                    <label className='form-label fw-bolder text-dark'>Last name</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('last_name')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.last_name && formik.errors.last_name,
                        })}
                    />
                    {renderError('last_name')}
                </div>
                <div className='col-md-8'>
                    <label className='required form-label fw-bolder text-dark'>Company name</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('company_name')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.company_name && formik.errors.company_name,
                        })}
                    />
                    {renderError('company_name')}
                </div>
                <div className='col-md-4'>
                    <label className='form-label fw-bolder text-dark'>Dealer type</label>
                    <select
                        {...formik.getFieldProps('dealer_type')}
                        className={clsx('form-select', {
                            'is-invalid': formik.touched.dealer_type && formik.errors.dealer_type,
                        })}
                    >
                        {dealerTypeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {renderError('dealer_type')}
                </div>
                <div className='col-md-12'>
                    <label className='form-label fw-bolder text-dark'>Company address</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('company_address')}
                        className={clsx('form-control', {
                            'is-invalid':
                                formik.touched.company_address && formik.errors.company_address,
                        })}
                    />
                    {renderError('company_address')}
                </div>
                <div className='col-md-4'>
                    <label className='form-label fw-bolder text-dark'>City</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('city')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.city && formik.errors.city,
                        })}
                    />
                    {renderError('city')}
                </div>
                <div className='col-md-4'>
                    <label className='form-label fw-bolder text-dark'>State</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('state')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.state && formik.errors.state,
                        })}
                    />
                    {renderError('state')}
                </div>
                <div className='col-md-4'>
                    <label className='form-label fw-bolder text-dark'>ZIP</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('zip')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.zip && formik.errors.zip,
                        })}
                    />
                    {renderError('zip')}
                </div>
                <div className='col-md-12'>
                    <label className='form-label fw-bolder text-dark'>Notes</label>
                    <input
                        type='text'
                        autoComplete='off'
                        {...formik.getFieldProps('notes')}
                        className={clsx('form-control', {
                            'is-invalid': formik.touched.notes && formik.errors.notes,
                        })}
                    />
                    {renderError('notes')}
                </div>
            </div>
            <div className='mt-10 d-flex justify-content-center gap-3'>
                <button type='button' className='btn btn-light' onClick={onClose}>
                    Cancel
                </button>
                <button type='submit' className='btn btn-primary' disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Submitting...' : 'Create lead'}
                </button>
            </div>
        </form>
    );
};
