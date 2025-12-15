/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getServiceAlerts,
    getServiceAudit,
    getServiceById,
    getServiceCounters,
    getServiceLogs,
} from 'components/dashboard/microservices/service';
import { Microservice, MicroserviceServerData } from 'common/interfaces/MicroserviceServerData';
import { TableHead } from '../helpers/renderTableHelper';

const getUniqValues = ({ values }: { values: MicroserviceServerData[] }) => {
    const columns = new Set<string>();

    values.forEach((obj: MicroserviceServerData): void => {
        Object.keys(obj).forEach((key: string): void => {
            columns.add(key);
        });
    });

    return [...columns];
};

export const renderTable = (data: MicroserviceServerData[]) => {
    const columns = getUniqValues({ values: data });
    return (
        <div className='w-100 table-responsive table-responsive-horizontal'>
            <table className='table table-row-dashed table-row-gray-300 gy-7'>
                <TableHead columns={columns} />
                <TableBody data={data} />
            </table>
        </div>
    );
};

const TableBody = ({ data }: { data: MicroserviceServerData[] }) => (
    <tbody>
        {data.map((row: MicroserviceServerData, index: number) => (
            <tr key={index}>
                {Object.values(row).map((cell: string, cellIndex: number) => (
                    <td key={`${index}-${cellIndex}`}>{cell}</td>
                ))}
            </tr>
        ))}
    </tbody>
);

export function MicroserviceCard() {
    const { uid } = useParams();
    const [logs, setLogs] = useState<MicroserviceServerData[]>([]);
    const [audit, setAudit] = useState<MicroserviceServerData[]>([]);
    const [alerts, setAlerts] = useState<MicroserviceServerData[]>([]);
    const [counters, setCounters] = useState<MicroserviceServerData[]>([]);
    const [microserviceData, setMicroservice] = useState<Microservice | null>(null);

    useEffect(() => {
        if (uid) {
            getServiceById(uid).then((response) => {
                if (response) {
                    setMicroservice(response);
                }
            });
            getServiceLogs(uid).then((response) => {
                if (response) {
                    setLogs(response);
                }
            });
            getServiceAudit(uid).then((response) => {
                if (response) {
                    setAudit(response);
                }
            });
            getServiceAlerts(uid).then((response) => {
                if (response) {
                    setAlerts(response);
                }
            });
            getServiceCounters(uid).then((response) => {
                if (response) {
                    setCounters(response);
                }
            });
        }
    }, [uid]);

    return (
        <>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>State</h3>
                    </div>
                    <div className='card-toolbar'>
                        <ul className='nav'>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#state-general'
                                >
                                    General
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#state-json'
                                >
                                    JSON
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='tab-content'>
                        <div className='tab-pane fade show active' id='state-general'>
                            {microserviceData ? microserviceData.name : 'No data available'}
                        </div>
                        <div className='tab-pane fade' id='state-json'>
                            {microserviceData ? (
                                <pre className='fs-md-4 fs-6'>
                                    JSON.stringify(microserviceData, null, 2)
                                </pre>
                            ) : (
                                'No data available'
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Logs</h3>
                    </div>
                    <div className='card-toolbar'>
                        <ul className='nav'>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#logs-general'
                                >
                                    General
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#logs-json'
                                >
                                    JSON
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='tab-content'>
                        <div className='tab-pane fade show active' id='logs-general'>
                            {logs.length ? renderTable(logs) : 'No data available'}
                        </div>
                        <div className='tab-pane fade' id='logs-json'>
                            <pre className='fs-md-4 fs-6'>{JSON.stringify(logs, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Audit</h3>
                    </div>
                    <div className='card-toolbar'>
                        <ul className='nav'>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#audit-general'
                                >
                                    General
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#audit-json'
                                >
                                    JSON
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='tab-content'>
                        <div className='tab-pane fade show active' id='audit-general'>
                            {audit.length ? renderTable(audit) : 'No data available'}
                        </div>
                        <div className='tab-pane fade' id='audit-json'>
                            <pre className='fs-md-4 fs-6'>{JSON.stringify(audit, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Alerts</h3>
                    </div>
                    <div className='card-toolbar'>
                        <ul className='nav'>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#alerts-general'
                                >
                                    General
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#alerts-json'
                                >
                                    JSON
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='tab-content'>
                        <div className='tab-pane fade show active' id='alerts-general'>
                            {alerts.length ? renderTable(alerts) : 'No data available'}
                        </div>
                        <div className='tab-pane fade' id='alerts-json'>
                            <pre className='fs-md-4 fs-6'>{JSON.stringify(alerts, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card mb-5 mb-xl-10'>
                <div className='card-header'>
                    <div className='card-title m-0'>
                        <h3 className='fw-bolder m-0'>Counters</h3>
                    </div>
                    <div className='card-toolbar'>
                        <ul className='nav'>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#counters-general'
                                >
                                    General
                                </a>
                            </li>
                            <li className='nav-item'>
                                <a
                                    className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                                    data-bs-toggle='tab'
                                    href='#counters-json'
                                >
                                    JSON
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='card-body py-3'>
                    <div className='tab-content'>
                        <div className='tab-pane fade show active' id='counters-general'>
                            {counters.length ? renderTable(counters) : 'No data available'}
                        </div>
                        <div className='tab-pane fade' id='counters-json'>
                            <pre className='fs-md-4 fs-6'>{JSON.stringify(counters, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
