'use client';

import * as yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { defaultProfileImg } from '@/public/images';
import { defaultOptionData } from '@/utils/helpers';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { getSports } from '@/firebase-api/utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { setCurrentInfo, setShowSpinnerDialog } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { Select } from '@/components/shared/options';
import { Button } from '@/components/shared/buttons';
import { fbAddTeam, fbDeleteTeam, fbUpdateTeam } from '@/firebase-api/teams';
import {
    createTeam,
    removeTeam,
    setSelectedPlayers,
    setSelectedTeam,
    setShowTeamInformation,
    setShowTeamPlayerSelection,
    updateTeam
} from '@/redux/reducers/teams';
import { fbGetPlayers } from '@/firebase-api/player';
import { fbGetCoaches } from '@/firebase-api/coaches';
import { useDebouncedCallback } from 'use-debounce';
import { CancelIcon } from '@/public/icons';
import { TeamPlayerBox } from '.';
import { Modal } from '@/components/shared';

const TeamInformation = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedTeam, selectedPlayers } = useAppSelector((state) => state.teams);
    const [sports, setSports] = useState<SelectPropsData[]>();
    const [players, setPlayers] = useState<TeamPlayerProps[]>([]);
    const [coaches, setCoaches] = useState<SelectPropsData[]>();
    const [isSubmit, setIsSubmit] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<File>();
    const isUpdate = selectedTeam?.id;
    const [isGuest, setIsGuest] = useState(false);

    const schema = yup.object().shape({
        profile: yup.string().notRequired(),
        name: yup.string().required('* required field'),
        sport: yup.string().required('* required field'),
        coach: yup.string().required('* require field')
    });

    const formik = useFormik({
        initialValues: {
            profile: '',
            name: '',
            sport: '',
            coach: '',
            players: [],
            achievements: 0,
            dateAdded: 0,
            dateUpdated: 0
        },
        validationSchema: schema,
        onSubmit: async (values: TeamProps) => {
            try {
                setIsSubmit(true);
                if (players.length) {
                    dispatch(
                        setShowSpinnerDialog({
                            open: true,
                            content: isUpdate ? 'Updating a team...' : 'Adding a team...'
                        })
                    );
                    dispatch(setShowTeamInformation(false));
                    let result;
                    let profile = '';
                    let name = values.name.charAt(0).toUpperCase() + values.name.slice(1);
                    if (selectedPhoto) {
                        const storageRef = ref(storage, `/teams/${name}/profile.png`);
                        const uploadTask = await uploadBytes(storageRef, selectedPhoto, {
                            contentType: 'image/png'
                        });
                        profile = await getDownloadURL(uploadTask.ref);
                    }
                    if (isUpdate) {
                        result = await fbUpdateTeam({
                            ...values,
                            players,
                            profile: profile || values.profile,
                            dateUpdated: new Date().getTime(),
                            name
                        });
                        dispatch(updateTeam(result!));
                    } else {
                        result = await fbAddTeam({
                            ...values,
                            players,
                            profile,
                            dateAdded: new Date().getTime(),
                            name
                        });
                        dispatch(createTeam(result!));
                        dispatch(setCurrentInfo('barangay-info'));
                        dispatch(setSelectedTeam());
                        dispatch(setSelectedPlayers([]));
                    }
                    setSelectedPhoto(undefined);
                    dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                }
            } catch (error) {
                console.log(error);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                dispatch(setCurrentInfo('barangay-info'));
            }
        }
    });

    const onClose = () => {
        dispatch(setCurrentInfo('barangay-info'));
        dispatch(setSelectedTeam(undefined));
        handleClose();
        formik.resetForm();
    };

    const loadData = async () => {
        try {
            const sportsList = await getSports();
            const coachList = await fbGetCoaches();
            setSports(sportsList.filter((item) => item.value !== 'All'));
            setCoaches(
                coachList.map((item) => ({ id: item.id, value: `${item.firstName} ${item.lastName}`, payload: item }))
            );
            setPlayers(isUpdate ? selectedTeam?.players : selectedPlayers);
            setSelectedPlayers(selectedTeam?.players!);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing coach...' }));
            dispatch(setShowTeamInformation(false));
            await fbDeleteTeam(selectedTeam?.id!);
            dispatch(removeTeam(selectedTeam?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
            dispatch(setSelectedTeam());
            dispatch(setSelectedPlayers([]));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        }
    };

    const handleSelectPlayers = () => {
        dispatch(setShowTeamPlayerSelection(true));
    };

    useEffect(() => {
        setPlayers(selectedPlayers);
    }, [selectedPlayers]);

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadData();
    }, []);

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedTeam);
        } else {
            formik.resetForm();
        }
        setSelectedPhoto(undefined);
    }, [selectedTeam]);

    return (
        <Modal open={open} handleClose={onClose}>
            <section className="w-[400px] h-[800px] bg-white rounded-[8px] overflow-y-auto">
                <header className="flex items-center justify-between p-[20px]">
                    {isGuest ? (
                        <p className="text-[18px] font-bold">Team Info</p>
                    ) : (
                        <p className="text-[18px] font-bold">{isUpdate ? 'Update Team' : 'Add Team'}</p>
                    )}
                    <CancelIcon onClick={onClose} className="w-[18px] h-[18px] text-error cursor-pointer" />
                </header>
                <form onSubmit={formik.handleSubmit} className="relative w-full grid grid-cols-4 gap-[10px] p-[20px]">
                    <div className="col-span-4 py-[20px] flex items-center justify-center">
                        <label>
                            <input
                                disabled={isGuest}
                                multiple
                                type="file"
                                className="hidden"
                                accept=".png, .jpg, .jpeg"
                                onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                                    if (evt.target.files) {
                                        const file = evt.target.files[0];
                                        const url = URL.createObjectURL(file);
                                        setSelectedPhoto(file);
                                        formik.setFieldValue('profile', url);
                                    }
                                }}
                            />
                            {formik.values.profile ? (
                                <Image
                                    src={formik.values.profile}
                                    className="rounded-[100px] object-cover w-[100px] h-[100px]"
                                    alt="profile"
                                    width={100}
                                    height={100}
                                />
                            ) : (
                                <Image src={defaultProfileImg} alt="profile" width={100} height={100} />
                            )}
                        </label>
                    </div>
                    <Input
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Name"
                        id="name"
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.errors.name}
                    />
                    <Select
                        readOnly
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Sport"
                        id="sport"
                        name="sport"
                        value={formik.values.sport}
                        error={formik.errors.sport}
                        data={sports || defaultOptionData()}
                        onSelectItem={(item: SelectPropsData) => {
                            formik.setFieldValue('sport', item.value);
                        }}
                    />
                    <Select
                        readOnly
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Coach"
                        id="coach"
                        name="coach"
                        value={formik.values.coach}
                        error={formik.errors.coach}
                        data={coaches || defaultOptionData()}
                        onSelectItem={(item: SelectPropsData) => {
                            formik.setFieldValue('coach', item.value);
                        }}
                    />
                    <div className="col-span-4 grid grid-cols-2 gap-[10px]">
                        {players?.map((player) => (
                            <TeamPlayerBox isGuest={isGuest} key={player.id} player={player} />
                        ))}
                        {!isGuest && (
                            <div className="col-span-2 flex items-center justify-center">
                                <Button
                                    type="button"
                                    onClick={handleSelectPlayers}
                                    value="Select Players"
                                    className="w-[140px] bg-transparent text-primary hover:bg-secondary"
                                />
                            </div>
                        )}
                    </div>
                    {!players?.length && isSubmit && (
                        <span className="text-error text-[14px] col-span-4 text-center">
                            Players should not be empty.
                        </span>
                    )}
                    {!isGuest && (
                        <div className="col-span-4 pt-[80px] flex items-center justify-center gap-[40px]">
                            <Button type="submit" value="Save" className="w-[100px]" />
                            {isUpdate && (
                                <Button
                                    type="button"
                                    onClick={handleDelete}
                                    value="Delete"
                                    className="w-[100px] bg-error"
                                />
                            )}
                        </div>
                    )}
                </form>
            </section>
        </Modal>
    );
};

export default TeamInformation;
