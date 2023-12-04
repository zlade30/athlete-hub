import { Modal } from '@/components/shared';
import { Button } from '@/components/shared/buttons';
import { DeleteIcon, PlusIcon, ShowIcon } from '@/public/icons';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { fbDeletePlayerFile, fbGetPlayerFiles, fbUpdatePlayer } from '@/firebase-api/player';
import { useDispatch } from 'react-redux';
import { removeFile, setFiles, updatePlayer } from '@/redux/reducers/players';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { increment } from 'firebase/firestore';
import PlayersFilesModal from './PlayersFilesModal';

const PlayersFiles = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const { files, selectedPlayer, showPlayerFiles } = useAppSelector((state) => state.player);
    const [isGuest, setIsGuest] = useState(false);

    const getPlayerFiles = async () => {
        const result = await fbGetPlayerFiles(selectedPlayer?.id!);
        const sort = result.sort((a, b) => b.dateAdded! - a.dateAdded!);
        dispatch(setFiles(sort));
    };

    useEffect(() => {
        if (showPlayerFiles) {
            setIsGuest(localStorage.getItem('id') === 'guest');
            getPlayerFiles();
        }
    }, [showPlayerFiles]);

    return (
        <Modal open={open} handleClose={handleClose}>
            <div
                style={{ height: 'calc(100vh - 200px)' }}
                className="w-[800px] bg-white rounded-[8px] px-[20px] flex flex-col items-center justify-between"
            >
                <PlayersFilesModal open={showModal} handleClose={() => setShowModal(false)} />
                <header className="w-full py-[20px] border-b flex items-center justify-between">
                    <div />
                    <h1 className="text-center font-bold text-[20px]">Files</h1>
                    {!isGuest ? (
                        <PlusIcon onClick={() => setShowModal(true)} className="w-[20px] h-[20px] cursor-pointer" />
                    ) : (
                        <div />
                    )}
                </header>
                {files.length > 0 ? (
                    <section className="w-full flex-1 flex flex-col">
                        {files?.map((item) => (
                            <div key={item.id} className="w-full py-[10px] border-y flex items-center justify-between">
                                <p>{item.name}</p>
                                <div className="flex items-center gap-[12px]">
                                    <ShowIcon
                                        onClick={() => window.open(item.url, '_blank', 'noreferrer')}
                                        className="w-[28px] h-[28px] cursor-pointer"
                                    />
                                    {!isGuest && (
                                        <DeleteIcon
                                            onClick={async () => {
                                                dispatch(
                                                    setShowSpinnerDialog({
                                                        open: true,
                                                        content: 'Removing a file...'
                                                    })
                                                );
                                                await fbDeletePlayerFile(selectedPlayer?.id!, item.id!);
                                                if (selectedPlayer?.files && selectedPlayer?.files > 0) {
                                                    const updateResult = await fbUpdatePlayer({
                                                        ...selectedPlayer,
                                                        files: increment(-1)
                                                    } as PlayerProps);
                                                    dispatch(updatePlayer(updateResult));
                                                }
                                                dispatch(removeFile(item.id!));
                                                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                                            }}
                                            className="w-[18px] h-[18px] text-error cursor-pointer"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                ) : (
                    <section className="w-full flex-1 flex flex-col items-center justify-center">
                        <p className="text-[14px]">Empty Files</p>
                    </section>
                )}
                <footer className="w-full h-[80px] border-t flex items-center justify-center">
                    <Button onClick={handleClose} className="w-[200px]" value="Close" />
                </footer>
            </div>
        </Modal>
    );
};

export default PlayersFiles;
