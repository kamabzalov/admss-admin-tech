/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { checkServiceDB, listServices, stopService } from './service';
import { Link } from 'react-router-dom';
import { TableHead } from 'components/dashboard/helpers/renderTableHelper';
import { CustomDropdown } from 'components/dashboard/helpers/renderDropdownHelper';
import { useToast } from '../helpers/renderToastHelper';
import { Microservice } from 'common/interfaces/MicroserviceServerData';
import { Status } from 'common/interfaces/ActionStatus';

enum MicroserviceColumns {
    ID = 'Index',
    MICROSERVICE = 'Microservice',
    STARTED = 'Started',
    ACTIONS = 'Actions',
}

const microserviceColumnsArray: string[] = Object.values(MicroserviceColumns) as string[];

export const Microservices = () => {
    const [listOfServices, setListOfServices] = useState<Microservice[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const { handleShowToast } = useToast();

    const updateMicroservices = (): void => {
        listServices().then((response) => {
            setListOfServices(response);
            setLoaded(true);
        });
    };

    useEffect(() => {
        if (!loaded) {
            updateMicroservices();
        }
    });

    const handleStopService = async (uid: string): Promise<void> => {
        try {
            if (uid) {
                const response = await stopService(uid);
                if (response.status === Status.ERROR) {
                    throw new Error(response.info);
                }
                if (response.status === Status.OK) {
                    updateMicroservices();
                    handleShowToast({
                        message: 'Microservice successfully stopped',
                        type: 'success',
                    });
                }
            }
        } catch (err) {
            let message = '';
            if (err instanceof Error) {
                message = err.message;
            }
            if (typeof err === 'string') {
                message = err;
            }
            handleShowToast({ message, type: 'danger' });
        }
    };

    const handleCheckDB = async (uid: string): Promise<void> => {
        try {
            if (uid) {
                const response = await checkServiceDB(uid);
                if (response.status === Status.ERROR) {
                    throw new Error(response.info);
                }
                if (response.status === Status.OK) {
                    handleShowToast({
                        message: 'Microservice bases successfully checked',
                        type: 'success',
                    });
                }
            }
        } catch (err) {
            let message = '';
            if (err instanceof Error) {
                message = err.message;
            }
            if (typeof err === 'string') {
                message = err;
            }
            handleShowToast({ message, type: 'danger' });
        }
    };

    return (
        <>
            <div className='card'>
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table className='table align-middle table-row-dashed fs-6 gy-3 no-footer'>
                            <TableHead columns={microserviceColumnsArray} />
                            <tbody className='text-gray-600 fw-bold'>
                                {listOfServices.map((service) => {
                                    return (
                                        <tr key={service.uid}>
                                            <td className='text-gray-800'>{service.index}</td>
                                            <td>
                                                <Link
                                                    to={`${service.uid}`}
                                                    className='text-gray-800 text-hover-primary mb-1 text-decoration-underline'
                                                >
                                                    {service.name}
                                                </Link>
                                            </td>
                                            <td className='text-gray-800'>{service.started}</td>
                                            <td>
                                                <CustomDropdown
                                                    title='Actions'
                                                    items={[
                                                        {
                                                            menuItemName: 'Restart',
                                                            menuItemAction: () =>
                                                                handleStopService(service.uid),
                                                        },
                                                        {
                                                            menuItemName: 'Check Database',
                                                            menuItemAction: () =>
                                                                handleCheckDB(service.uid),
                                                        },
                                                    ]}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
