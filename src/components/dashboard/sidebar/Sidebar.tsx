import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className='app-sidebar flex-column'>
            <div className='app-sidebar-logo px-6'>
                <Link to='/dashboard'>
                    <img src='/logo/admss_logo.png' className='logo mb-0' alt='ADMSS' />
                </Link>
            </div>
            <div className='app-sidebar-menu overflow-hidden flex-column-fluid'>
                <div className='app-sidebar-wrapper hover-scroll-overlay-y my-5'>
                    <div className='menu-item'>
                        <div className='menu-content pt-8 pb-2'>
                            <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                                Dealers
                            </span>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link to='/dashboard' className='menu-link without-sub'>
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-people'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                        <span className='path4'></span>
                                        <span className='path5'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Dealers list</span>
                            </Link>
                        </div>
                    </div>

                    <div className='menu-item'>
                        <div className='menu-content pt-8 pb-2'>
                            <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                                Users
                            </span>
                        </div>
                    </div>

                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link to='users' className='menu-link without-sub'>
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-profile-circle fs-2'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Active users</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link to='deleted-users' className='menu-link without-sub'>
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-tablet-delete'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Deleted users</span>
                            </Link>
                        </div>
                    </div>

                    <div className='menu-item'>
                        <div className='menu-content pt-8 pb-2'>
                            <span className='menu-section text-muted text-uppercase fs-8 ls-1'>
                                Common
                            </span>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link className='menu-link without-sub' to='/dashboard/data-import'>
                                <span className='menu-icon'>
                                    <i className='ki-outline ki-data'></i>
                                </span>
                                <span className='menu-title'>Data import</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link
                                className='menu-link without-sub'
                                to='/dashboard/template-reports'
                            >
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-document'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Templates for reports</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link
                                className='menu-link without-sub'
                                to='/dashboard/template-printed'
                            >
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-printer'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                        <span className='path4'></span>
                                        <span className='path5'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Templates for printed forms</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link className='menu-link without-sub' to='/dashboard/billing'>
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-bill'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                        <span className='path4'></span>
                                        <span className='path5'></span>
                                        <span className='path6'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Billing</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link className='menu-link without-sub' to='/dashboard/reports'>
                                <span className='menu-icon'>
                                    <i className='ki-outline ki-notepad fs-2 m-2'></i>
                                </span>
                                <span className='menu-title'>Reports</span>
                            </Link>
                        </div>
                    </div>
                    <div className='menu menu-column menu-rounded menu-sub-indention px-3'>
                        <div className='menu-item'>
                            <Link to='/dashboard/microservices' className='menu-link without-sub'>
                                <span className='menu-icon'>
                                    <i className='ki-duotone ki-color-swatch'>
                                        <span className='path1'></span>
                                        <span className='path2'></span>
                                        <span className='path3'></span>
                                        <span className='path4'></span>
                                        <span className='path5'></span>
                                        <span className='path6'></span>
                                        <span className='path7'></span>
                                        <span className='path8'></span>
                                        <span className='path9'></span>
                                        <span className='path10'></span>
                                        <span className='path11'></span>
                                        <span className='path12'></span>
                                        <span className='path13'></span>
                                        <span className='path14'></span>
                                        <span className='path15'></span>
                                        <span className='path16'></span>
                                        <span className='path17'></span>
                                        <span className='path18'></span>
                                        <span className='path19'></span>
                                        <span className='path20'></span>
                                        <span className='path21'></span>
                                    </i>
                                </span>
                                <span className='menu-title'>Microservices</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
