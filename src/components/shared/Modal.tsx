'use client';

import { MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const Modal = ({ open, className, children, handleClose }: ModalProps) => {
    const close = (evt: MouseEvent<HTMLDivElement>) => {
        if (evt.target === evt.currentTarget) {
            handleClose();
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    className={twMerge(
                        'fixed inset-0 flex items-center justify-center z-[100] bg-[#00000050]',
                        className
                    )}
                    onClick={close}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
