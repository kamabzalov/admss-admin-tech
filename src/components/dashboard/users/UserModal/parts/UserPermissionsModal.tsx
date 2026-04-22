import { useEffect, useState } from 'react';
import { getUserPermissions, setUserPermissions } from 'components/dashboard/users/user.service';
import { renderList } from 'components/dashboard/helpers/helpers';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { AxiosError } from 'axios';
import { Status } from 'common/interfaces/ActionStatus';

interface UserPermissionsModalProps {
    onClose: () => void;
    useruid: string;
    username: string;
}

export const UserPermissionsModal = ({
    onClose,
    useruid,
    username,
}: UserPermissionsModalProps): JSX.Element => {
    const [userPermissionsJSON, setUserPermissionsJSON] = useState<string>('');
    const [initialUserPermissionsJSON, setInitialUserPermissionsJSON] = useState<string>('');
    const [modifiedJSON, setModifiedJSON] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const { handleShowToast } = useToast();

    const filterObjectValues = (json: Record<string, string | number>) => {
        const filteredObj: any = {};
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                const value = json[key];
                if (value === 0 || value === 1) {
                    filteredObj[key] = value;
                }
            }
        }

        return filteredObj;
    };

    useEffect(() => {
        setIsLoading(true);
        if (useruid) {
            getUserPermissions(useruid).then(async (response) => {
                const stringifiedResponse = JSON.stringify(response, null, 2);
                setUserPermissionsJSON(stringifiedResponse);
                setInitialUserPermissionsJSON(stringifiedResponse);
                const filteredData = typeof response === 'object' && filterObjectValues(response);
                setModifiedJSON(filteredData);
                setIsLoading(false);
            });
        }
    }, [useruid]);

    useEffect(() => {
        if (initialUserPermissionsJSON !== userPermissionsJSON && !isLoading) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [userPermissionsJSON, initialUserPermissionsJSON, isLoading]);

    const handleChangeUserPermissions = ([fieldName, fieldValue]: [string, number]): void => {
        const parsedUserPermission = JSON.parse(userPermissionsJSON);
        parsedUserPermission[fieldName] = fieldValue;
        setUserPermissionsJSON(JSON.stringify(parsedUserPermission, null, 2));
        setModifiedJSON(filterObjectValues(parsedUserPermission));
    };

    const handleSetUserPermissions = async (): Promise<void> => {
        try {
            if (useruid) {
                const response = await setUserPermissions(useruid, JSON.parse(userPermissionsJSON));
                if (response.warning) {
                    throw new Error(response.warning);
                }
                if (response.status === Status.OK) {
                    handleShowToast({
                        message: `<strong>${username}</strong> permissions successfully saved`,
                        type: 'success',
                    });
                    onClose();
                }
            }
        } catch (err) {
            const { message } = err as Error | AxiosError;
            handleShowToast({ message, type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isLoading &&
                renderList({
                    data: modifiedJSON,
                    checkbox: true,
                    action: handleChangeUserPermissions,
                })}
            <div className='mt-12 d-flex justify-content-center align-content-center'>
                <ActionButton
                    icon='check'
                    disabled={isButtonDisabled}
                    buttonClickAction={handleSetUserPermissions}
                >
                    Save {username} permissions
                </ActionButton>
            </div>
        </>
    );
};
