import {
    EditableField,
    fieldLabel,
    inputTypeByFieldKey,
    isEditableDateFieldKey,
    requiredEditableFields,
} from 'components/dashboard/dealers/parts/helpers';
import { MetronicFlatpickrDateInput } from 'components/dashboard/dealers/parts/MetronicFlatpickrDateInput';

interface DealerEditableSectionProps {
    title: string;
    fields: EditableField[];
    draft: Record<EditableField, string>;
    errors: Partial<Record<EditableField, string>>;
    onChange: (field: EditableField, value: string) => void;
    disabled: boolean;
}

export const DealerEditableSection = ({
    title,
    fields,
    draft,
    errors,
    onChange,
    disabled,
}: DealerEditableSectionProps) => {
    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>{title}</h4>
            </div>
            <div className='card-body py-6'>
                <div className='row'>
                    {fields.map((key) => {
                        const isRequired = requiredEditableFields.includes(key);
                        const isDateField = isEditableDateFieldKey(key);
                        const errorMessage = errors[key];
                        return (
                            <div className='col-md-6 mb-5' key={key}>
                                <div className='row align-items-center'>
                                    <label
                                        className={`col-lg-4 fw-bold text-muted ${
                                            isRequired ? 'required' : ''
                                        }`}
                                    >
                                        {fieldLabel(key)}
                                    </label>
                                    <div className='col-lg-8'>
                                        {isDateField ? (
                                            <MetronicFlatpickrDateInput
                                                value={draft[key] ?? ''}
                                                onChange={(next) => onChange(key, next)}
                                                disabled={disabled}
                                                invalid={Boolean(errorMessage)}
                                            />
                                        ) : (
                                            <input
                                                type={inputTypeByFieldKey(key)}
                                                autoComplete='off'
                                                className={`form-control form-control-sm ${
                                                    errorMessage ? 'is-invalid' : ''
                                                }`}
                                                value={draft[key] ?? ''}
                                                onChange={(event) =>
                                                    onChange(key, event.target.value)
                                                }
                                                disabled={disabled}
                                            />
                                        )}
                                        {errorMessage && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert' className='text-danger'>
                                                    {errorMessage}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
