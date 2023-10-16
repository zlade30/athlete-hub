import { Modal } from '@/components/shared';
import { Button } from '@/components/shared/buttons';
import { DeleteIcon, PlusIcon, ShowIcon } from '@/public/icons';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { PlayersAchievementsModal } from '.';
import { useAppSelector } from '@/redux/store';
import { fbGetPlayersAchievements } from '@/firebase-api/player';
import { useDispatch } from 'react-redux';
import { setAchievements } from '@/redux/reducers/players';

const PlayersAchievements = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const { achievements, selectedPlayer, showPlayerAchievements } = useAppSelector((state) => state.player);

    const getPlayerAchievements = async () => {
        const result = await fbGetPlayersAchievements(selectedPlayer?.id!);
        const sort = result.sort((a, b) => b.dateAdded! - a.dateAdded!);
        dispatch(setAchievements(sort));
    };

    useEffect(() => {
        if (showPlayerAchievements) {
            getPlayerAchievements();
        }
    }, [showPlayerAchievements]);

    return (
        <Modal open={open} handleClose={handleClose}>
            <div
                style={{ height: 'calc(100vh - 200px)' }}
                className="w-[800px] bg-white rounded-[8px] px-[20px] flex flex-col items-center justify-between"
            >
                <PlayersAchievementsModal open={showModal} handleClose={() => setShowModal(false)} />
                <header className="w-full py-[20px] border-b flex items-center justify-between">
                    <div />
                    <h1 className="text-center font-bold text-[20px]">Achievements</h1>
                    <PlusIcon onClick={() => setShowModal(true)} className="w-[20px] h-[20px] cursor-pointer" />
                </header>
                {achievements.length > 0 ? (
                    <section className="w-full flex-1 flex flex-col">
                        {achievements?.map((item) => (
                            <div key={item.id} className="w-full py-[10px] border-y flex items-center justify-between">
                                <p>{item.name}</p>
                                <div className="flex items-center gap-[12px]">
                                    <ShowIcon
                                        onClick={() => window.open(item.url, '_blank', 'noreferrer')}
                                        className="w-[28px] h-[28px] cursor-pointer"
                                    />
                                    <DeleteIcon className="w-[18px] h-[18px] text-error cursor-pointer" />
                                </div>
                            </div>
                        ))}
                    </section>
                ) : (
                    <section className="w-full flex-1 flex flex-col items-center justify-center">
                        <p className="text-[14px]">Empty Achievements</p>
                    </section>
                )}
                <footer className="w-full h-[80px] border-t flex items-center justify-center">
                    <Button className="w-[200px]" value="Close" />
                </footer>
            </div>
        </Modal>
    );
};

export default PlayersAchievements;
