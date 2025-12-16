import { Link } from 'react-router-dom';

export const ErrorPage = () => {
    return (
        <>
            {/* begin::Title */}
            <h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>System Error</h1>
            {/* end::Title */}

            {/* begin::Text */}
            <div className='fw-semibold fs-6 text-gray-500 mb-7'>
                Something went wrong! Please try again later.
            </div>
            {/* end::Text */}

            {/* begin::Link */}
            <div className='mb-0'>
                <Link to='/dashboard' className='btn btn-sm btn-primary'>
                    Return Home
                </Link>
            </div>
            {/* end::Link */}
        </>
    );
};
