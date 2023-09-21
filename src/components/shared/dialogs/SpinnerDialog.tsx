import React from 'react';
import { Modal } from '..';
import { useAppSelector } from '@/redux/store';

const SpinnerDialog = () => {
    const { showSpinnerDialog } = useAppSelector((state) => state.app);

    return (
        <Modal open={showSpinnerDialog.open} handleClose={() => ''}>
            <div className="relative w-[400px] bg-white rounded-[8px] px-[20px] py-[80px] flex flex-col items-center justify-center gap-[20px]">
                <div className="animate-ping inline-flex h-[20px] w-[20px] rounded-[20px] bg-sky-400" />
                <p>{showSpinnerDialog.content}</p>
            </div>
        </Modal>
    );
};

export default SpinnerDialog;
