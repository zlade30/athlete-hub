import { Modal } from '@/components/shared';
import { Button } from '@/components/shared/buttons';
import { DeleteIcon, PlusIcon, ShowIcon } from '@/public/icons';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { TeamAchievementsModal } from '.';
import { fbDeleteTeamAchievement, fbGetTeamAchievements, fbUpdateTeam } from '@/firebase-api/teams';
import { removeAchievement, setAchievements, updateTeam } from '@/redux/reducers/teams';
import { increment } from 'firebase/firestore';

const TeamAchievements = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const { achievements, selectedTeam, showTeamAchievements } = useAppSelector((state) => state.teams);

    const getTeamAchievements = async () => {
        const result = await fbGetTeamAchievements(selectedTeam?.id!);
        const sort = result.sort((a, b) => b.dateAdded! - a.dateAdded!);
        dispatch(setAchievements(sort));
    };

    useEffect(() => {
        if (showTeamAchievements) {
            getTeamAchievements();
        }
    }, [showTeamAchievements]);

    return (
        <Modal open={open} handleClose={handleClose}>
            <div
                style={{ height: 'calc(100vh - 200px)' }}
                className="w-[800px] bg-white rounded-[8px] px-[20px] flex flex-col items-center justify-between"
            >
                <TeamAchievementsModal open={showModal} handleClose={() => setShowModal(false)} />
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
                                    <DeleteIcon
                                        onClick={async () => {
                                            dispatch(
                                                setShowSpinnerDialog({
                                                    open: true,
                                                    content: 'Removing an achievement...'
                                                })
                                            );
                                            await fbDeleteTeamAchievement(selectedTeam?.id!, item.id!);
                                            if (selectedTeam?.achievements && selectedTeam?.achievements > 0) {
                                                const updateResult = await fbUpdateTeam({
                                                    ...selectedTeam,
                                                    achievements: increment(-1)
                                                } as TeamProps);
                                                dispatch(updateTeam(updateResult));
                                            }
                                            dispatch(removeAchievement(item.id!));
                                            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                                        }}
                                        className="w-[18px] h-[18px] text-error cursor-pointer"
                                    />
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
                    <Button onClick={handleClose} className="w-[200px]" value="Close" />
                </footer>
            </div>
        </Modal>
    );
};

export default TeamAchievements;
