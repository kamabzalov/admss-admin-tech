import { ChangeEvent, useRef, useState } from 'react';
import { getApiErrorMessage } from 'common/error-utils';
import { useToast } from 'components/dashboard/helpers/renderToastHelper';
import { ActionButton } from 'components/dashboard/smallComponents/buttons/ActionButton';
import { uploadDealerLogo } from 'components/dashboard/dealers/dealers.service';

interface DealerLogoCardProps {
    dealerId: string;
    dealerName: string;
    logoUrl: string | null;
    onAfterUpload: () => Promise<void> | void;
    disabled?: boolean;
}

export const DealerLogoCard = ({
    dealerId,
    dealerName,
    logoUrl,
    onAfterUpload,
    disabled = false,
}: DealerLogoCardProps) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { handleShowToast } = useToast();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        try {
            setIsUploading(true);
            await uploadDealerLogo(dealerId, file);
            await onAfterUpload();
            handleShowToast({
                message: 'Logo uploaded successfully',
                type: 'success',
            });
        } catch (err) {
            handleShowToast({
                message: getApiErrorMessage(err, 'Failed to upload logo'),
                type: 'danger',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='card shadow-sm mb-6'>
            <div className='card-header'>
                <h4 className='card-title m-0'>Logo</h4>
            </div>
            <div className='card-body py-6'>
                <div className='d-flex align-items-center gap-6 flex-wrap'>
                    <div
                        className='d-flex align-items-center justify-content-center rounded border'
                        style={{
                            width: 160,
                            height: 160,
                            background: '#f5f8fa',
                            overflow: 'hidden',
                        }}
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt={`${dealerName} logo`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <span className='text-muted fs-7'>No logo</span>
                        )}
                    </div>
                    <div className='d-flex flex-column gap-2'>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            className='d-none'
                            onChange={(event) => void handleFileChange(event)}
                        />
                        <ActionButton
                            icon='picture'
                            className='w-225px'
                            buttonClickAction={() => fileInputRef.current?.click()}
                            disabled={disabled || isUploading}
                        >
                            {isUploading
                                ? 'Uploading...'
                                : logoUrl
                                ? 'Replace logo'
                                : 'Upload logo'}
                        </ActionButton>
                        <span className='text-muted fs-7'>
                            PNG/JPG/SVG, recommended square format.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
