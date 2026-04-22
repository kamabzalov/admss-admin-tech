import { ApiKeyEnabled, ApiKeyRecord, ApiTypes } from 'common/interfaces/UserApiKeys';
import { CustomModal } from 'components/dashboard/helpers/modal/renderModalHelper';
import { CustomCheckbox } from 'components/dashboard/helpers/renderInputsHelper';
import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getApiKeysTypes, getClientUid, setUserApiKey } from '../apiKeys.service';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { useParams } from 'react-router-dom';
import { Status } from 'common/interfaces/ActionStatus';

interface ApiKeyModalProps {
    onClose: () => void;
    apiKey?: Partial<ApiKeyRecord>;
    updateAction?: () => void;
}

const formatDateToInputString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const defaultDate = new Date().getTime();

export const ApiKeyModal = ({ apiKey, onClose, updateAction }: ApiKeyModalProps): JSX.Element => {
    const { id: useruid } = useParams();
    const [apiKeyTypes, setApiKeyTypes] = useState<ApiTypes[] | null>(null);
    const [apiKeyType, setApiKeyType] = useState<string>(apiKey?.apitype || '');
    const [apiKeyValue, setApiKeyValue] = useState<string>(apiKey?.apikey || '');
    const [apiKeyIssue, setApiKeyIssue] = useState<number | string | Date>(
        apiKey?.issuedate || defaultDate
    );
    const [apiKeyExpiration, setApiKeyExpiration] = useState<number | string | Date>(
        apiKey?.expirationdate || defaultDate
    );
    const [apiKeyNotes, setApiKeyNotes] = useState<string>(apiKey?.notes || '');
    const [apiKeyEnabled, setApiKeyEnabled] = useState<ApiKeyEnabled | 0>(apiKey?.enabled || 0);
    const [apiHost, setApiHost] = useState<string>(apiKey?.host || '');
    const [apiPort, setApiPort] = useState<number>(apiKey?.port || 0);
    const [apiUserLogin, setApiUserLogin] = useState<string>(apiKey?.userlogin || '');
    const [apiUserPassword, setApiUserPassword] = useState<string>(apiKey?.userpassword || '');
    const [apiClientUid, setApiClientUid] = useState<string>(apiKey?.clientuid || '');

    const getApiTypes = () => {
        getApiKeysTypes().then((res) => {
            res.status === Status.OK && setApiKeyTypes(res.api_types);
            updateAction && updateAction();
        });
    };

    useEffect(() => {
        getApiTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetUid = () => {
        getClientUid().then((res) => {
            if (res.status === Status.OK) {
                setApiClientUid(res.itemuid);
            }
        });
    };

    const handleApiKeyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setApiKeyType(e.target.value);
    };

    const handleApiKeyEnabledChange = () => {
        setApiKeyEnabled((prevEnabled) => (prevEnabled ? 0 : 1));
    };

    const handleSave = () => {
        setUserApiKey(useruid as string, {
            ...apiKey,
            issuedate: apiKeyIssue as string,
            expirationdate: apiKeyExpiration as string,
            enabled: apiKeyEnabled,
            apitype: apiKeyType,
            notes: apiKeyNotes,
            apikey: apiKeyValue,
            host: apiHost,
            port: apiPort,
            userlogin: apiUserLogin,
            userpassword: apiUserPassword,
            clientuid: apiClientUid,
        }).then((res) => {
            if (res.status === Status.OK) updateAction && updateAction();
        });

        onClose();
    };

    return (
        <CustomModal onClose={onClose} width={800} title={`${apiKey ? 'Edit' : 'Add'} API key`}>
            <Form.Group className='d-flex flex-column row-gap-4'>
                <Form.Group>
                    <label className='form-label mb-0'>Created API key</label>
                    <Form.Control value={apiKey?.created} disabled name='Created API key' />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Deleted API key</label>
                    <Form.Control value={apiKey?.deleted} disabled name='Deleted API key' />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Updated API key</label>
                    <Form.Control value={apiKey?.updated} disabled name='Updated API key' />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Issue date API key</label>
                    <input
                        type='date'
                        className='form-control'
                        name='Issue API key'
                        value={formatDateToInputString(new Date(apiKeyIssue))}
                        onChange={({ target }) => setApiKeyIssue(new Date(target.value).getTime())}
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Expiration date API key</label>
                    <input
                        type='date'
                        className='form-control'
                        name='Expiration API key'
                        value={formatDateToInputString(new Date(apiKeyExpiration))}
                        onChange={({ target }) =>
                            setApiKeyExpiration(new Date(target.value).getTime())
                        }
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Last used date API key</label>
                    <Form.Control value={apiKey?.lastused} disabled name='Last used API key' />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Flags API key</label>
                    <Form.Control value={apiKey?.flags as number} disabled name='Flags API key' />
                </Form.Group>

                <Form.Group>
                    <label className='form-label mb-0'>API key type</label>
                    <Form.Select value={apiKeyType} onChange={handleApiKeyTypeChange}>
                        {apiKeyTypes?.map(({ id, name }) => (
                            <option key={id} value={name}>
                                {name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Client UID</label>
                    <div className='d-flex'>
                        <Form.Control
                            value={apiClientUid}
                            name='Client UID'
                            onChange={({ target }) => setApiClientUid(target.value)}
                        />
                        <Button className='w-25 ms-4' onClick={handleGetUid}>
                            Create
                        </Button>
                    </div>
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>User login</label>
                    <Form.Control
                        value={apiUserLogin}
                        name='User login'
                        onChange={({ target }) => setApiUserLogin(target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>User password</label>
                    <Form.Control
                        value={apiUserPassword}
                        name='User password'
                        type='password'
                        onChange={({ target }) => setApiUserPassword(target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>User uID</label>
                    <Form.Control value={apiKey?.useruid || useruid} disabled name='User uid' />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Item uID</label>
                    <Form.Control
                        value={apiKey?.itemuid}
                        disabled
                        id={String(apiKey?.itemuid)}
                        name='Item uid'
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Api key</label>
                    <Form.Control
                        as='textarea'
                        value={apiKeyValue}
                        onChange={({ target }) => setApiKeyValue(target.value)}
                        placeholder='Api key value'
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Api notes</label>
                    <Form.Control
                        as='textarea'
                        value={apiKeyNotes}
                        onChange={({ target }) => setApiKeyNotes(target.value)}
                        placeholder='Leave notes here'
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Host</label>
                    <Form.Control
                        value={apiHost}
                        name='Host'
                        onChange={({ target }) => setApiHost(target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <label className='form-label mb-0'>Port</label>
                    <Form.Control
                        value={apiPort}
                        type='number'
                        min={0}
                        max={65535}
                        onChange={({ target }) => setApiPort(+target.value)}
                    />
                </Form.Group>
                <CustomCheckbox
                    currentValue={apiKeyEnabled}
                    id={apiKey?.apikey as string}
                    name='API key enabled'
                    title='API key enabled'
                    action={handleApiKeyEnabledChange}
                />

                <div className='mt-12 d-flex justify-content-center align-content-center'>
                    {apiKey ? (
                        <ActionButton type='button' buttonClickAction={handleSave}>
                            Save changes
                        </ActionButton>
                    ) : (
                        <ActionButton type='button' buttonClickAction={handleSave}>
                            Create
                        </ActionButton>
                    )}
                </div>
            </Form.Group>
        </CustomModal>
    );
};
