import type { Options } from 'flatpickr/dist/types/options';
import { useMemo } from 'react';
import Flatpickr from 'react-flatpickr';

export interface MetronicFlatpickrDateInputProps {
    value: string;
    onChange: (next: string) => void;
    disabled: boolean;
    invalid?: boolean;
}

const METRONIC_FLATPICKR_OPTIONS: Partial<Options> = {
    dateFormat: 'Y-m-d',
    allowInput: true,
    disableMobile: true,
    locale: { firstDayOfWeek: 1 },
};

export const MetronicFlatpickrDateInput = ({
    value,
    onChange,
    disabled,
    invalid = false,
}: MetronicFlatpickrDateInputProps) => {
    const wireValue = useMemo(() => {
        const t = (value ?? '').trim();
        return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : '';
    }, [value]);

    return (
        <Flatpickr
            className={`form-control form-control-sm${invalid ? ' is-invalid' : ''}`}
            value={wireValue}
            options={METRONIC_FLATPICKR_OPTIONS}
            onChange={(_dates, dateStr) => {
                onChange(dateStr);
            }}
            disabled={disabled}
            placeholder='yyyy-mm-dd'
            lang='en'
            autoComplete='off'
        />
    );
};
