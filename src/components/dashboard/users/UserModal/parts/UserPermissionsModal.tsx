import { useEffect, useState } from 'react';
import { getUserPermissions, setUserPermissions } from 'components/dashboard/users/user.service';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { AxiosError } from 'axios';
import { Status } from 'common/interfaces/ActionStatus';
import { CustomCheckbox } from 'components/dashboard/helpers/renderInputsHelper';
import { renamedKeys } from 'common/app-consts';

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
    const [modifiedJSON, setModifiedJSON] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const { handleShowToast } = useToast();

    const permissionCategories: Array<{ title: string; keys: string[] }> = [
        {
            title: 'User roles',
            keys: [
                'uaSystemAdmin',
                'uaManager',
                'uaClientAdmin',
                'uaLocationAdmin',
                'uaSalesPerson',
            ],
        },
        {
            title: 'Contacts',
            keys: ['uaViewContacts', 'uaAddContacts', 'uaEditContacts', 'uaDeleteContacts'],
        },
        {
            title: 'Deals',
            keys: [
                'uaViewDeals',
                'uaAddDeals',
                'uaEditDeals',
                'uaEditInsuranceOnly',
                'uaPrintDealsForms',
                'uaEditDealWashout',
                'uaEditPaidComissions',
                'uaDeleteDeal',
            ],
        },
        {
            title: 'Inventory & expenses',
            keys: [
                'uaViewInventory',
                'uaAddInventory',
                'uaEditInventory',
                'uaDeleteInventory',
                'uaViewCostsAndExpenses',
                'uaAddExpenses',
                'uaEditExpenses',
            ],
        },
        {
            title: 'Accounts & payments',
            keys: [
                'uaViewAccounts',
                'uaEditPayments',
                'uaDeletePayments',
                'uaAddCreditsAndFees',
                'uaDeleteAccounts',
                'uaChangePayments',
                'uaAllowBackDatingPayments',
                'uaAllowPartialPayments',
            ],
        },
        {
            title: 'Settings & access',
            keys: [
                'uaCreateUsers',
                'uaEditSettings',
                'uaAllowPaymentCalculator',
                'uaAllowPaymentQuote',
                'uaAllowReports',
                'uaAllowPrinting',
                'uaAllowMobile',
                'uaAllowWeb',
                'uaWebSiteAdmin',
                'uaCreateReports',
                'uaUndeleteDeleted',
                'uaViewDeleted',
            ],
        },
    ];

    const getCategories = (permissions: Record<string, number>) => {
        const usedKeys = new Set(permissionCategories.flatMap((category) => category.keys));
        const categoriesWithValues = permissionCategories
            .map((category) => ({
                title: category.title,
                entries: category.keys
                    .filter((key) => key in permissions)
                    .map((key) => [key, permissions[key]] as [string, number]),
            }))
            .filter((category) => category.entries.length > 0);

        const otherEntries = Object.entries(permissions).filter(([key]) => !usedKeys.has(key));
        if (otherEntries.length > 0) {
            categoriesWithValues.push({
                title: 'Other permissions',
                entries: otherEntries,
            });
        }

        return categoriesWithValues;
    };

    const filterObjectValues = (json: Record<string, string | number>) => {
        const filteredObj: Record<string, number> = {};
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
                const filteredData =
                    typeof response === 'object' && response !== null
                        ? filterObjectValues(response as Record<string, string | number>)
                        : {};
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
            {!isLoading && (
                <div className='row g-8'>
                    {getCategories(modifiedJSON).map((category) => (
                        <div key={category.title} className='col-12 col-md-6 col-xl-4'>
                            <div className='border rounded p-5 h-100'>
                                <h5 className='fw-bolder mb-4'>{category.title}</h5>
                                {category.entries.map(([key, value]) => (
                                    <CustomCheckbox
                                        key={key}
                                        currentValue={value}
                                        id={key}
                                        name={key}
                                        title={renamedKeys[key] || key}
                                        action={handleChangeUserPermissions}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
