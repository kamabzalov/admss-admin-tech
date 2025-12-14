import React from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader';

export function Dashboard() {
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
