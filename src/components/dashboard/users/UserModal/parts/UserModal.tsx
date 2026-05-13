import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { HTMLInputTypeAttribute, useState } from 'react';
import { createOrUpdateUser } from 'components/dashboard/users/user.service';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { User, UserInputData, UsersType } from 'common/interfaces/UserData';
import { useQueryResponse } from 'common/core/QueryResponseProvider';
import { Status } from 'common/interfaces/ActionStatus';

interface UserModalProps {
    onClose: () => void;
    user?: User;
    dealerId?: string;
    onSuccess?: () => void;
}

interface UserModalData extends UserInputData {
    confirmPassword: '';
}

// eslint-disable-next-line no-unused-vars
enum PassIcon {
    // eslint-disable-next-line no-unused-vars
    SHOW = 'ki-eye',
    // eslint-disable-next-line no-unused-vars
    HIDDEN = 'ki-eye-slash',
}

export const UserModal = ({ onClose, user, dealerId, onSuccess }: UserModalProps): JSX.Element => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [passwordFieldType, setPasswordFieldType] = useState<HTMLInputTypeAttribute>('password');
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const [confirmPasswordFieldType, setConfirmPasswordFieldType] =
        useState<HTMLInputTypeAttribute>('password');
    const { refetch } = useQueryResponse(UsersType.ACTIVE);

    const initialUserData: UserModalData = {
        username: user?.username || '',
        password: '',
        confirmPassword: '',
    };

    const { handleShowToast } = useToast();

    const handleChangePasswordVisible = () => {
        switch (isPasswordVisible) {
            case true:
                setPasswordFieldType('password');
                setIsPasswordVisible(false);
                break;
            case false:
                setPasswordFieldType('text');
                setIsPasswordVisible(true);
                break;
        }
    };

    const handleChangeConfirmPasswordVisible = () => {
        switch (isConfirmPasswordVisible) {
            case true:
                setConfirmPasswordFieldType('password');
                setIsConfirmPasswordVisible(false);
                break;
            case false:
                setConfirmPasswordFieldType('text');
                setIsConfirmPasswordVisible(true);
                break;
        }
    };

    const addUserSchema = Yup.object().shape({
        username: Yup.string().trim().required('Username is required'),
        password: Yup.string().trim().required('Password is required'),
        confirmPassword: Yup.string()
            .trim()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Password confirmation is required'),
    });

    const formik = useFormik({
        initialValues: initialUserData,
        validationSchema: addUserSchema,
        onSubmit: async ({ username, password, confirmPassword }, { setSubmitting }) => {
            if (password !== confirmPassword) {
                handleShowToast({
                    message: 'Passwords do not match',
                    type: 'danger',
                });
                setSubmitting(false);
                return;
            }

            setSubmitting(true);
            try {
                const isUpdate = Boolean(user?.useruid);
                const uidForUrl = user?.useruid ?? '0';
                const extraData = !isUpdate && dealerId ? { dealer_id: dealerId } : undefined;
                const responseData = await createOrUpdateUser(
                    username,
                    password,
                    uidForUrl,
                    extraData
                );

                const message = isUpdate
                    ? `<strong>${username}</strong> password successfully updated`
                    : `User <strong>${username}</strong> successfully created`;

                if (responseData.status === Status.OK) {
                    handleShowToast({
                        message,
                        type: 'success',
                    });
                    onClose();
                    refetch();
                    onSuccess?.();
                }
            } catch (err: any) {
                const { warning, error } = err.data;
                const errorMessage = warning || error;
                handleShowToast({ message: errorMessage, type: 'danger' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <form className='form' onSubmit={formik.handleSubmit} noValidate>
                <div className='d-flex flex-column scroll-y me-n7 pe-7'>
                    <div className='fv-row mb-8'>
                        <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
                        <input
                            placeholder='Username'
                            {...formik.getFieldProps('username')}
                            className={clsx(
                                'form-control',
                                {
                                    'is-invalid': formik.touched.username && formik.errors.username,
                                },
                                {
                                    'is-valid': formik.touched.username && !formik.errors.username,
                                }
                            )}
                            type='text'
                            name='username'
                            autoComplete='off'
                            disabled={Boolean(user)}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <div className='fv-plugins-message-container'>
                                <span role='alert'>{formik.errors.username}</span>
                            </div>
                        )}
                    </div>

                    <div className='fv-row mb-10 position-relative'>
                        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                        <input
                            type={passwordFieldType}
                            placeholder='Password'
                            autoComplete='off'
                            {...formik.getFieldProps('password')}
                            className={clsx(
                                'form-control bg-transparent',
                                {
                                    'border-danger':
                                        formik.touched.password && formik.errors.password,
                                },
                                {
                                    'border-success':
                                        formik.touched.password && !formik.errors.password,
                                }
                            )}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className='fv-plugins-message-container position-absolute'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.password}</span>
                                </div>
                            </div>
                        )}

                        <i
                            className={clsx(
                                `ki-outline fs-2 ${
                                    isPasswordVisible ? PassIcon.SHOW : PassIcon.HIDDEN
                                } position-absolute end-0 top-50 px-3 cursor-pointer text-hover-primary`
                            )}
                            onClick={handleChangePasswordVisible}
                        />
                    </div>

                    <div className='fv-row mb-10 position-relative'>
                        <label className='form-label fw-bolder text-dark fs-6 mb-0'>
                            Password Confirmation
                        </label>
                        <input
                            type={confirmPasswordFieldType}
                            placeholder='Confirm Password'
                            autoComplete='off'
                            {...formik.getFieldProps('confirmPassword')}
                            className={clsx(
                                'form-control bg-transparent',
                                {
                                    'border-danger':
                                        formik.touched.confirmPassword &&
                                        formik.errors.confirmPassword,
                                },
                                {
                                    'border-success':
                                        formik.touched.confirmPassword &&
                                        !formik.errors.confirmPassword,
                                }
                            )}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                            <div className='fv-plugins-message-container position-absolute'>
                                <div className='fv-help-block'>
                                    <span role='alert'>{formik.errors.confirmPassword}</span>
                                </div>
                            </div>
                        )}

                        <i
                            className={clsx(
                                `ki-outline fs-2 ${
                                    isConfirmPasswordVisible ? PassIcon.SHOW : PassIcon.HIDDEN
                                } position-absolute end-0 top-50 px-3 cursor-pointer text-hover-primary`
                            )}
                            onClick={handleChangeConfirmPasswordVisible}
                        />
                    </div>
                </div>
                <div className='mt-12 d-flex justify-content-center align-content-center'>
                    <button
                        type='submit'
                        className='btn btn-primary'
                        data-kt-users-modal-action='submit'
                        disabled={formik.isSubmitting || !formik.isValid || !formik.touched}
                    >
                        <span className='indicator-label'>Submit</span>
                        {formik.isSubmitting && (
                            <span className='indicator-progress'>
                                Please wait...{' '}
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};
