import { useQueryRequest } from 'common/core/QueryRequestProvider';
import { useState, useEffect, KeyboardEvent } from 'react';
import clsx from 'clsx';
import { initialQueryState } from '_metronic/helpers';

export const UsersListSearchComponent = () => {
    const { state, updateState } = useQueryRequest();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isSearchUnchanged, setIsSearchUnchanged] = useState<boolean>(true);

    useEffect(() => {
        setIsSearchUnchanged(searchTerm === state.search);
    }, [searchTerm, state.search]);

    const handleSearch = (): void => {
        if (!isSearchUnchanged) {
            setIsSearchUnchanged(true);
            try {
                updateState({ ...state, search: searchTerm, currentpage: 0 });
            } catch (error) {}
        }
    };

    const handleClear = (): void => {
        setSearchTerm('');
        updateState(initialQueryState);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className='d-flex align-items-center position-relative my-1'>
            <input
                type='text'
                data-kt-user-table-filter='search'
                className='form-control rounded-0 rounded-start-2 form-control-solid pe-4'
                placeholder='Search dealer'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={handleKeyPress}
            />
            {searchTerm && (
                <i
                    onClick={handleClear}
                    className='ki-outline ki-cross fs-1 end-0 position-absolute me-20 px-2 cursor-pointer'
                />
            )}
            <button
                className={clsx('btn btn-primary rounded-0 rounded-end-2', {
                    disabled: isSearchUnchanged,
                })}
                onClick={handleSearch}
            >
                <i className='ki-outline ki-magnifier fs-2' />
            </button>
        </div>
    );
};
