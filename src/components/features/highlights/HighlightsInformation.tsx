'use client';

import * as yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { defaultProfileImg } from '@/public/images';
import { capitalizeEveryWord, generateId } from '@/utils/helpers';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { Button } from '@/components/shared/buttons';
import { fbAddHighlights, fbDeleteHighlights, fbUpdateHighlight } from '@/firebase-api/highlights';
import {
    createHighlights,
    removeHighlights,
    setSelectedAthletes,
    setSelectedHighlights,
    setSelectedTeams,
    setShowAthleteSelection,
    setShowHighlightInformation,
    setShowTeamSelection,
    updateHighlights
} from '@/redux/reducers/highlights';
import { Modal, SelectTeamBox } from '@/components/shared';
import { CancelIcon } from '@/public/icons';
import { TeamPlayerBox } from '../teams';
import { HighlightTeamBox } from '.';

const HighlightsInformation = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedHighlight, selectedTeams, selectedAthletes } = useAppSelector((state) => state.highlights);
    const [selectedPhoto, setSelectedPhoto] = useState<File>();
    const isUpdate = selectedHighlight?.id;
    const [isGuest, setIsGuest] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required('* required field'),
        image: yup.string().required('* required field'),
        date: yup.string().required('* required field')
    });

    const handleTeams = () => {
        return selectedTeams.map((item) => ({
            id: item.id,
            name: capitalizeEveryWord(item.name),
            players: item.players,
            profile: item.profile
        }));
    };

    const handleAthletes = () => {
        return selectedAthletes.map((item) => ({
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            profile: item.profile
        }));
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            image: '',
            athletes: [],
            date: '',
            teams: [],
            dateAdded: 0,
            dateUpdated: 0
        },
        validationSchema: schema,
        onSubmit: async (values: HighlightProps) => {
            try {
                dispatch(
                    setShowSpinnerDialog({
                        open: true,
                        content: isUpdate ? 'Updating a highlight...' : 'Adding a highlight...'
                    })
                );
                dispatch(setShowHighlightInformation(false));
                let result;
                let image = '';
                if (selectedPhoto) {
                    const storageRef = ref(storage, `/highlights/${generateId(10)}.png`);
                    const uploadTask = await uploadBytes(storageRef, selectedPhoto, {
                        contentType: 'image/png'
                    });
                    image = await getDownloadURL(uploadTask.ref);
                }
                if (isUpdate) {
                    result = await fbUpdateHighlight({
                        ...values,
                        image: image || values.image,
                        name: capitalizeEveryWord(values.name),
                        athletes: handleAthletes(),
                        teams: handleTeams(),
                        dateUpdated: new Date().getTime()
                    });
                    dispatch(updateHighlights(result!));
                } else {
                    result = await fbAddHighlights({
                        ...values,
                        image,
                        name: capitalizeEveryWord(values.name),
                        athletes: handleAthletes(),
                        teams: handleTeams(),
                        dateAdded: new Date().getTime()
                    });
                    dispatch(createHighlights(result!));
                }
                setSelectedPhoto(undefined);
                dispatch(setSelectedHighlights(undefined));
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            } catch (error) {
                console.log(error);
                dispatch(setSelectedHighlights(undefined));
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            }
        }
    });

    const onClose = () => {
        dispatch(setSelectedHighlights(undefined));
        handleClose();
        formik.resetForm();
    };

    const handleDelete = async () => {
        try {
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing highlights...' }));
            dispatch(setShowHighlightInformation(false));
            await fbDeleteHighlights(selectedHighlight?.id!);
            dispatch(removeHighlights(selectedHighlight?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
        }
    };

    const handleSelectTeams = () => {
        dispatch(setShowTeamSelection(true));
    };

    const handleSelectAthlete = () => {
        dispatch(setShowAthleteSelection(true));
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedHighlight);
            dispatch(setSelectedAthletes(selectedHighlight.athletes));
            dispatch(setSelectedTeams(selectedHighlight.teams));
        } else {
            formik.resetForm();
            dispatch(setSelectedAthletes([]));
            dispatch(setSelectedTeams([]));
        }
        setSelectedPhoto(undefined);
    }, [selectedHighlight]);

    return (
        <Modal open={open} handleClose={onClose}>
            <section className="w-[400px] h-full max-h-[800px] bg-white rounded-[8px]">
                <header className="flex items-center justify-between p-[20px]">
                    {isGuest ? (
                        <p className="text-[18px] font-bold">Highlight Info</p>
                    ) : (
                        <p className="text-[18px] font-bold">{isUpdate ? 'Update Highlight' : 'Add Highlight'}</p>
                    )}
                    <CancelIcon onClick={onClose} className="w-[18px] h-[18px] text-error cursor-pointer" />
                </header>
                <form onSubmit={formik.handleSubmit} className="relative flex flex-col">
                    <div className="relative w-full grid grid-cols-4 gap-[10px] p-[20px] overflow-y-auto h-[600px]">
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
                                            formik.setFieldValue('image', url);
                                        }
                                    }}
                                />
                                {formik.values.image ? (
                                    <Image
                                        src={formik.values.image}
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
                        <Input
                            disabled={isGuest}
                            containerClassName="col-span-4 flex flex-col gap-[4px]"
                            label="Date"
                            id="date"
                            name="date"
                            type="date"
                            className="normal-case"
                            value={formik.values.date}
                            onChange={formik.handleChange}
                            error={formik.errors.date}
                        />
                        <p className="font-bold">Teams</p>
                        <div className="col-span-4 grid grid-cols-2 gap-[10px]">
                            {selectedTeams.map((team) => (
                                <HighlightTeamBox key={team.id} isGuest={isGuest} team={team} />
                            ))}
                            {!isGuest && (
                                <div className="col-span-2 flex items-center justify-center">
                                    <Button
                                        type="button"
                                        onClick={handleSelectTeams}
                                        value="Select Teams"
                                        className="w-[140px] bg-transparent text-primary hover:bg-secondary"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="font-bold">Atheletes</p>
                        <div className="col-span-4 grid grid-cols-2 gap-[10px]">
                            {selectedAthletes?.map((athlete) => (
                                <TeamPlayerBox isGuest={isGuest} key={athlete.id} player={athlete} />
                            ))}
                            {!isGuest && (
                                <div className="col-span-2 flex items-center justify-center">
                                    <Button
                                        type="button"
                                        onClick={handleSelectAthlete}
                                        value="Select Athlete"
                                        className="w-[140px] bg-transparent text-primary hover:bg-secondary"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {!isGuest && (
                        <div className="col-span-4 flex items-center justify-center py-[20px] gap-[40px]">
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

export default HighlightsInformation;
