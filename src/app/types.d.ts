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

    type InfoProps = 'player-info' | 'barangay-info' | 'coach-info' | 'team-info' | 'sport-info'

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

    type SportProps = {
        id?: string;
        name: string;
        dateAdded?: number;
        dateUpdated?: number;
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
        selected?: boolean;
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
        selected?: boolean;
    }

    type TeamPlayerProps = {
        id?: string;
        profile: string;
        lastName: string;
        firstName: string;
    }

    type TeamProps = {
        id?: string;
        name: string;
        profile: string;
        sport: string;
        coach: string;
        players: TeamPlayerProps[];
        dateAdded?: number;
        dateUpdated?: number;
        selected?: boolean;
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