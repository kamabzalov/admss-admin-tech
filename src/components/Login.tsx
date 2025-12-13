import clsx from 'clsx';
import { useFormik } from 'formik';
import { HTMLInputTypeAttribute, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from 'common/auth.service';
import { LOC_STORAGE_USER, LOC_STORAGE_USER_STATE } from 'common/app-consts';
import { useTokenValidation } from 'common/hooks/useTokenValidation';
import { getToken } from 'common/utils';
import { Status } from 'common/interfaces/ActionStatus';

interface LoginCredentials {
    username: string;
    password: string;
}

type PasswordFieldIcon = 'ki-eye' | 'ki-eye-slash';

const loginSchema = Yup.object().shape({
    username: Yup.string().trim().required('Username is required'),
    password: Yup.string().trim().required('Password is required'),
});

const initialValues: LoginCredentials = {
    username: '',
    password: '',
};

export function Login() {
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [passwordFieldType, setPasswordFieldType] = useState<HTMLInputTypeAttribute>('password');
    const [passwordFieldIcon, setPasswordFieldIcon] = useState<PasswordFieldIcon>('ki-eye');

    const navigate = useNavigate();
    const token = getToken();
    const isTokenValid = useTokenValidation(token as string);

    useEffect(() => {
        isTokenValid && navigate('/dashboard');
    }, [isTokenValid, navigate]);

    const handleChangePasswordField = () => {
        switch (isPasswordVisible) {
            case true:
                setPasswordFieldType('password');
                setPasswordFieldIcon('ki-eye-slash');
                setIsPasswordVisible(false);
                break;
            case false:
                setPasswordFieldType('text');
                setPasswordFieldIcon('ki-eye');
                setIsPasswordVisible(true);
                break;
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setLoading(true);

            login(values.username, values.password)
                .then((response) => {
                    if (response && response?.status === Status.OK) {
                        setStatus(false);
                        const login = response?.loginname || response.username;
                        localStorage.setItem(LOC_STORAGE_USER, JSON.stringify(response));

                        localStorage.setItem(
                            LOC_STORAGE_USER_STATE,
                            JSON.stringify({ login, currentpage: 0 })
                        );

                        navigate('/dashboard');
                    }
                })
                .catch((err) => {
                    setStatus(err.response.data.error);
                })
                .finally(() => {
                    setSubmitting(false);
                    setLoading(false);
                });
        },
    });
    return (
        <div className='d-flex flex-lg-row-fluid p-10 sign-in-bg h-100'>
            <div className='d-flex flex-center flex-column flex-lg-row-fluid'>
                <img src='/logo/admss_logo.png' className='logo w-50 w-sm-25' alt='ADMS' />
                <div className='w-sm-500px w-100 p-10 bg-white border'>
                    <form className='form w-100' onSubmit={formik.handleSubmit} noValidate>
                        <div className='text-center mb-11'>
                            <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
                        </div>

                        {formik.status && (
                            <div className='mb-lg-15 alert alert-danger'>
                                <div className='alert-text font-weight-bold'>{formik.status}</div>
                            </div>
                        )}

                        <div className='fv-row mb-10 position-relative'>
                            <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
                            <input
                                placeholder='Username'
                                {...formik.getFieldProps('username')}
                                className={clsx(
                                    'form-control bg-transparent',
                                    {
                                        'border-danger':
                                            formik.touched.username && formik.errors.username,
                                    },
                                    {
                                        'border-success':
                                            formik.touched.username && !formik.errors.username,
                                    }
                                )}
                                type='text'
                                name='username'
                                autoComplete='off'
                            />
                            {formik.touched.username && formik.errors.username && (
                                <div className='fv-plugins-message-container position-absolute'>
                                    <div className='fv-help-block'>
                                        <span role='alert'>{formik.errors.username}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='fv-row mb-10 position-relative'>
                            <label className='form-label fw-bolder text-dark fs-6 mb-0 w-100'>
                                Password
                            </label>
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
                                    `ki-outline fs-2 ${passwordFieldIcon} position-absolute end-0 top-50 px-3 cursor-pointer text-hover-primary`
                                )}
                                onClick={handleChangePasswordField}
                            />
                        </div>

                        <div className='d-grid'>
                            <button
                                type='submit'
                                className='btn btn-primary'
                                disabled={formik.isSubmitting || !formik.isValid || loading}
                            >
                                {!loading && <span className='indicator-label'>Continue</span>}
                                {loading && (
                                    <span className='indicator-progress d-block'>
                                        Please wait...
                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
