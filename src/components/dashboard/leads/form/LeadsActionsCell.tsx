import { CustomDropdown } from 'components/dashboard/helpers/renderDropdownHelper';

interface LeadsActionsCellProps {
    leaduid: string;
    isConvertible: boolean;
    onOpen: () => void;
    onConvert: () => void;
    onDelete: () => void;
}

export const LeadsActionsCell = ({
    leaduid,
    isConvertible,
    onOpen,
    onConvert,
    onDelete,
}: LeadsActionsCellProps) => {
    if (!leaduid) {
        return <span className='text-muted'>-</span>;
    }

    return (
        <CustomDropdown
            title='Actions'
            items={[
                {
                    menuItemName: 'Open',
                    menuItemAction: onOpen,
                },
                ...(isConvertible
                    ? [
                          {
                              menuItemName: 'Convert',
                              menuItemAction: onConvert,
                          },
                      ]
                    : []),
                {
                    menuItemName: 'Delete',
                    menuItemAction: onDelete,
                },
            ]}
        />
    );
};
