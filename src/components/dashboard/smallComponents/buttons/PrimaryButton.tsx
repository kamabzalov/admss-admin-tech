import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    appearance?: 'primary' | 'light' | 'danger';
    buttonClickAction?: () => void;
}

export const PrimaryButton = ({
    icon,
    disabled,
    buttonClickAction,
    type,
    appearance = 'primary',
    children,
    className,
}: ButtonProps) => {
    return (
        <button
            type={type || 'button'}
            className={`btn btn-${appearance} d-flex align-items-center ${className} ${
                appearance === 'danger' ? 'btn-danger' : ''
            }`}
            onClick={buttonClickAction}
            disabled={disabled}
        >
            {icon && <i className={`ki-outline ki-${icon} me-2 fs-2`}></i>}
            {children}
        </button>
    );
};
