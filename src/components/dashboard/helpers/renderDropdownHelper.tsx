/* eslint-disable jsx-a11y/anchor-is-valid */
import { PropsWithChildren, useEffect } from 'react';
import { MenuComponent } from '_metronic/assets/ts/components';
import clsx from 'clsx';

interface PropsItems {
    menuItemName: string;
    icon?: string;
    menuItemAction?: () => void;
}

interface DropdownProps {
    title: string;
    width?: number;
    iconBefore?: string;
    background?: 'default' | 'none';
    items?: PropsItems[];
}

export const CustomDropdown = ({
    title,
    items,
    children,
    iconBefore,
    background = 'default',
    width,
}: PropsWithChildren<DropdownProps>) => {
    useEffect(() => {
        MenuComponent.reinitialization();
    }, []);

    return (
        <>
            <a
                className={clsx(
                    'btn btn-sm d-inline-flex justify-content-center align-items-center column-gap-1',
                    {
                        'btn-light btn-active-light-primary': background === 'default',
                        'fs-6 text-hover-primary fw-bold text-gray-700': background === 'none',
                    }
                )}
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-end'
            >
                {iconBefore && <i className={`ki-outline ki-${iconBefore} fs-2`} />}
                <span className='menu-title'>{title}</span>
                <i className='ki-duotone ki-down fs-4 m-0' />
            </a>
            <div
                className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 py-4'
                data-kt-menu='true'
                style={{ width: `${width || 150}px` }}
            >
                {children}
                {items &&
                    items.map(({ menuItemName, menuItemAction, icon }) => (
                        <div key={menuItemName} className='menu-item px-3' onClick={menuItemAction}>
                            <a className='menu-link px-3 text-hover-primary'>
                                {icon && <i className={`ki-outline ki-${icon} fs-2 me-2`} />}
                                {menuItemName}
                            </a>
                        </div>
                    ))}
            </div>
        </>
    );
};
