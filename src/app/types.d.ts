import { ReactElement } from "react";

export {};

declare global {
    /**
     * Now declare things that go in the global namespace,
     * or augment existing declarations in the global namespace.
     */
    type SignProps = {
        email: string;
        password: string;
    }

    type InfoProps = 'player-info' | 'barangay-info' | 'coach-info'

    type FallbackProps = {
        show: boolean;
        icon?: ReactElement;
        content: string;
    }

    type PopupProps = {
        open: boolean;
        onClose: VoidFunction;
        children?: ReactNode;
    };

    type SpinnerDialogProps = {
        open: boolean;
        content: string;
    }

    type CoachProps = {
        id?: string;
        profile: string;
        lastName: string;
        firstName: string;
        suffix: string;
        sport: string;
        barangay: string;
        gender: string;
        age: string;
        dateAdded?: number;
        dateUpdated?: number;
    }

    type PlayerProps = {
        id?: string;
        profile: string;
        lastName: string;
        firstName: string;
        suffix: string;
        sport: string;
        barangay: string;
        height: string;
        weight: string;
        gender: string;
        age: string;
        achivements: Array;
        videos: Array;
        dateAdded?: number;
        dateUpdated?: number;
    }

    type ModalProps = {
        open: boolean;
        className?: string;
        children: ReactNode;
        handleClose: VoidFunction;
    }

    type FormProps = {
        label?: string;
        containerClassName?: string;
        error?: string | number | undefined;
    }

    type SelectPropsData = {
        id: string;
        value: string;
        payload?: Object;
    }

    type SelectProps = {
        data: SelectPropsData[],
        onSelectItem: (_: SelectPropsData) => void;
    }

    type BarangayProps = SelectPropsData;
    type SportsProps = SelectPropsData;
}
