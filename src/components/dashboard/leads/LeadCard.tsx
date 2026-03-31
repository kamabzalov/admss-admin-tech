import { useParams } from 'react-router-dom';

export const LeadCard = () => {
    const { id } = useParams();

    return (
        <div className='card'>
            <div className='card-body'>
                <h3 className='mb-3'>Lead</h3>
                <div className='text-muted'>Lead ID: {id}</div>
            </div>
        </div>
    );
};
