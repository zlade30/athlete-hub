'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Popup = ({ open, onClose, children }: PopupProps) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const onExitPopup = () => {
        onClose();
    };

    useEffect(() => {
        if (open) {
            const popup = document.getElementById('popup');
            const parentDiv = popup?.parentElement;
            const child = parentDiv?.firstElementChild;

            const target = child as HTMLElement;
            const divWidth = target.offsetWidth;
            const divHeight = target.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            let x = target.getBoundingClientRect().x + divWidth;
            let y = target.getBoundingClientRect().y + divHeight;
            const popupWidth = document.getElementById('popup')?.clientWidth;
            const popupHeight = document.getElementById('popup')?.clientHeight;

            if (x + popupWidth! > screenWidth) {
                x -= popupWidth!;
                y += 10;
            } else {
                x -= divWidth!;
                y += 10;
            }

            if (y + popupHeight! > screenHeight) {
                y = y - popupHeight! - divHeight;
            }

            setPosition({ x, y });
            window.addEventListener('click', onExitPopup);
        }
        return () => {
            window.removeEventListener('click', onExitPopup);
            setPosition({ x: 0, y: 0 });
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={divRef}
                    style={{ left: position.x, top: position.y }}
                    id="popup"
                    className="absolute z-[100]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    exit={{ scale: 0 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Popup;
