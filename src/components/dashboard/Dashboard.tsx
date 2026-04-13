import React, { useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';

const SIDEBAR_MINIMIZE_KEY = 'sidebar-minimize';

export function Dashboard() {
    useEffect(() => {
        const body = document.body;
        body.setAttribute('data-kt-app-sidebar-fixed', 'true');
        body.setAttribute('data-kt-app-sidebar-hoverable', 'true');
        body.setAttribute('data-kt-app-header-fixed', 'true');
        body.setAttribute('data-kt-app-sidebar-push-header', 'true');

        const saved = localStorage.getItem(SIDEBAR_MINIMIZE_KEY);
        if (saved === 'on') {
            body.setAttribute('data-kt-app-sidebar-minimize', 'on');
        }

        return () => {
            body.removeAttribute('data-kt-app-sidebar-fixed');
            body.removeAttribute('data-kt-app-sidebar-hoverable');
            body.removeAttribute('data-kt-app-header-fixed');
            body.removeAttribute('data-kt-app-sidebar-push-header');
            body.removeAttribute('data-kt-app-sidebar-minimize');
        };
    }, []);

    return (
        <div className='d-flex flex-column flex-root app-root'>
            <div className='app-page flex-column flex-column-fluid'>
                <DashboardHeader />
                <div className='app-wrapper flex-column flex-row-fluid'>
                    <Sidebar />
                    <div className='app-main flex-column flex-row-fluid'>
                        <div className='d-flex flex-column flex-column-fluid'>
                            <div className='app-content flex-column-fluid'>
                                <div className='app-container container-fluid'>
                                    <Outlet />
                                </div>
                            </div>
                            {/*<ClearCache />*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
