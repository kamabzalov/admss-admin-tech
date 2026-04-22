import { ButtonHTMLAttributes } from 'react';
import './index.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    appearance?: 'primary' | 'light' | 'danger';
    buttonClickAction?: () => void;
    iconOnly?: boolean;
}

export const ActionButton = ({
    icon,
    disabled,
    buttonClickAction,
    type,
    appearance = 'primary',
    children,
    className,
    iconOnly = false,
    onClick,
    ...buttonProps
}: ButtonProps) => {
    const hasText = Boolean(children);

    return (
        <button
            type={type || 'button'}
            className={`btn action-btn btn-${appearance} d-flex align-items-center justify-content-center ${
                iconOnly ? 'btn-icon' : ''
            } ${className || ''} ${appearance === 'danger' ? 'btn-danger' : ''}`}
            onClick={buttonClickAction ?? onClick}
            disabled={disabled}
            {...buttonProps}
        >
            {icon && (
                <i
                    className={`ki-outline ki-${icon} ${iconOnly || !hasText ? '' : 'me-2'} fs-2`}
                ></i>
            )}
            {!iconOnly && children}
        </button>
    );
};

export const PrimaryButton = ActionButton;
