import React from 'react';
import { Popup } from '.';
import { useDispatch } from 'react-redux';
import { setSelectedPlayer, setShowPlayerModal } from '@/redux/reducers/players';

const PlayerActionPopup = ({ open, onClose, player }: PopupProps & { player: PlayerProps }) => {
    const dispatch = useDispatch();
    const actions = ['Update', 'Delete'];

    const handleSelectedAction = (action: string) => {
        if (action === 'Update') {
            dispatch(setShowPlayerModal(true));
            dispatch(setSelectedPlayer(player));
        } else {
        }
    };

    return (
        <Popup open={open} onClose={onClose}>
            <div className="w-full max-h-[300px] bg-white rounded-[8px] shadow-[0px_10px_10px_1px_rgba(0,0,0,0.10)] border border-gray-100 overflow-y-auto">
                {actions.map((action) => (
                    <div
                        key={action}
                        onClick={() => handleSelectedAction(action)}
                        className="text-[14px] px-[10px] py-[5px] hover:bg-secondary h-[40px] flex items-center cursor-pointer"
                    >
                        {action}
                    </div>
                ))}
            </div>
        </Popup>
    );
};

export default PlayerActionPopup;
