import { AxiosError } from 'axios';
import { convertToNumberIfNumeric, deepEqual } from 'components/dashboard/helpers/common';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { useState, useEffect, useCallback } from 'react';
import { Status } from 'common/interfaces/ActionStatus';
import {
    CustomCheckbox,
    CustomRadioButton,
    CustomRangeInput,
    CustomTextInput,
    InputType,
} from 'components/dashboard/helpers/renderInputsHelper';
import {
    Settings,
    checkboxInputKeys,
    disabledKeys,
    radioButtonsKeys,
    rangeInputKeys,
    selectInputKeys,
    textInputKeys,
} from 'common/interfaces/users/UserSettings';
import { SettingKey } from 'common/interfaces/users/UserConsts';
import {
    SettingGroup,
    dealsGroup,
    feesGroup,
    taxesGroup,
    stockNewGroup,
    stockTIGroup,
    accountGroup,
    contractGroup,
    leaseGroup,
} from 'common/interfaces/users/UserGroups';
import { renamedKeys } from 'common/app-consts';
import { getUserSettings, setUserSettings } from '../../user.service';

const getSettingType = (key: SettingKey): InputType => {
    if (disabledKeys.includes(key)) return InputType.DISABLED;
    if (textInputKeys.includes(key)) return InputType.TEXT;
    if (checkboxInputKeys.includes(key)) return InputType.CHECKBOX;
    if (rangeInputKeys.includes(key)) return InputType.RANGE;
    if (radioButtonsKeys.some((group) => group.includes(key))) return InputType.RADIO;
    if (selectInputKeys.includes(key)) return InputType.SELECT;
    return InputType.DEFAULT;
};

const getSettingGroup = (key: SettingKey): SettingGroup => {
    if (dealsGroup.includes(key)) return SettingGroup.DEALS;
    if (feesGroup.includes(key)) return SettingGroup.FEES;
    if (taxesGroup.includes(key)) return SettingGroup.TAXES;
    if (stockNewGroup.includes(key)) return SettingGroup.STOCK_NEW;
    if (stockTIGroup.includes(key)) return SettingGroup.STOCK_TI;
    if (accountGroup.includes(key)) return SettingGroup.ACCOUNT;
    if (contractGroup.includes(key)) return SettingGroup.CONTRACT;
    if (leaseGroup.includes(key)) return SettingGroup.LEASE;
    return SettingGroup.OTHER;
};

const getSettingTitle = (key: SettingKey): string => renamedKeys[key] || key;

interface Setting {
    key: string;
    value: string | number;
    title: string;
    type: InputType;
}

type GroupedSetting = Record<string, Setting[]>;

interface UserSettingsModalProps {
    onClose: () => void;
    useruid: string;
    username: string;
}

const SettingGroupValues: string[] = Object.values(SettingGroup) as string[];

const getGroupedList = () => {
    const grouped: GroupedSetting = {};
    SettingGroupValues.forEach((groupKey) => {
        grouped[groupKey] = [];
    });
    return grouped;
};

export const UserSettingsModal = ({
    onClose,
    useruid,
    username,
}: UserSettingsModalProps): JSX.Element => {
    const [settings, setSettings] = useState<Settings>();
    const [groupedSettings, setGroupedSettings] = useState<GroupedSetting>({});
    const [initialUserSettings, setInitialUserSettings] = useState<Settings>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const { handleShowToast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        if (useruid) {
            getUserSettings(useruid)
                .then(async (response) => {
                    if (response.status === Status.OK && response.settings) {
                        const settings = response.settings;
                        setInitialUserSettings(settings);
                        setSettings(settings);
                        const groupedList: GroupedSetting = getGroupedList();

                        Object.entries<string | number>({ ...settings }).forEach(
                            ([key, value]: [string, string | number]) => {
                                const type = getSettingType(key as SettingKey);
                                const group = getSettingGroup(key as SettingKey);
                                const title = getSettingTitle(key as SettingKey);

                                groupedList[group].push({
                                    key,
                                    value,
                                    title,
                                    type,
                                });
                            }
                        );
                        setGroupedSettings(groupedList);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [useruid]);

    useEffect(() => {
        const isEqual = deepEqual(initialUserSettings, settings);
        if (!isEqual && !isLoading) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [settings, initialUserSettings, isLoading]);

    const handleChangeUserSettings = useCallback(
        (inputData: [string, number | string, SettingKey?]) => {
            const [name, value, group] = inputData;

            let changedSettings: any;

            if (group && groupedSettings) {
                groupedSettings[group].forEach((group) => {
                    if (group.type === InputType.RADIO) {
                        if (group.key !== name) {
                            changedSettings = { ...changedSettings, [group.key]: 0 };
                        }
                    }
                });
            }

            changedSettings = {
                ...changedSettings,
                [name]: convertToNumberIfNumeric(value as string),
            };

            setSettings({
                ...settings,
                ...changedSettings,
            });
        },
        [settings, groupedSettings]
    );

    const handleSetUserSettings = async (): Promise<void> => {
        setIsLoading(true);
        try {
            if (useruid) {
                const newSettings = { settings };
                const response = await setUserSettings(useruid, newSettings);
                if (response.status === Status.OK) {
                    handleShowToast({
                        message: `<strong>${username}</strong> settings successfully saved`,
                        type: 'success',
                    });
                    onClose();
                }
            }
        } catch (error) {
            const { message } = error as Error | AxiosError;
            handleShowToast({ message, type: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!settings) {
        return <></>;
    }

    return (
        <>
            {groupedSettings &&
                Object.entries(groupedSettings).map(([groupName, groupSettings]) => {
                    return (
                        <div className='fv-row mb-16' key={groupName}>
                            <h2 className='display-6'>{groupName}</h2>
                            {(groupSettings as Setting[]).map(
                                ({ key, title, type, value }: Setting) => (
                                    <div className='mb-4' key={key}>
                                        {type === InputType.TEXT && (
                                            <CustomTextInput
                                                currentValue={String(value)}
                                                id={key}
                                                name={key}
                                                title={title}
                                                action={handleChangeUserSettings}
                                            />
                                        )}
                                        {type === InputType.CHECKBOX && (
                                            <CustomCheckbox
                                                currentValue={Number(value)}
                                                id={key}
                                                name={key}
                                                title={title}
                                                action={handleChangeUserSettings}
                                            />
                                        )}
                                        {type === InputType.RADIO && (
                                            <CustomRadioButton
                                                id={key}
                                                name={key}
                                                title={title}
                                                group={groupName as SettingKey}
                                                currentValue={Number(settings[key as SettingKey])}
                                                action={handleChangeUserSettings}
                                            />
                                        )}
                                        {type === InputType.RANGE && (
                                            <CustomRangeInput
                                                id={key}
                                                minValue={0}
                                                maxValue={10}
                                                step={1}
                                                name={key}
                                                title={title}
                                                group={groupName}
                                                currentValue={Number(value)}
                                                action={handleChangeUserSettings}
                                            />
                                        )}
                                        {type === InputType.DEFAULT && (
                                            <CustomTextInput
                                                currentValue={String(value)}
                                                id={key}
                                                name={key}
                                                title={title}
                                            />
                                        )}
                                        {type === InputType.DISABLED && (
                                            <CustomTextInput
                                                currentValue={String(value)}
                                                id={key}
                                                name={key}
                                                title={title}
                                                disabled
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            <div className='mt-12 d-flex justify-content-center align-content-center'>
                <ActionButton
                    icon='check'
                    disabled={isButtonDisabled}
                    buttonClickAction={handleSetUserSettings}
                >
                    Save {username} settings
                </ActionButton>
            </div>
        </>
    );
};
