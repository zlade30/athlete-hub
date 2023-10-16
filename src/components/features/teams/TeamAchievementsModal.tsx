'use client';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { setCurrentInfo, setShowSpinnerDialog } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { Button } from '@/components/shared/buttons';
import { fbAddSport, fbDeleteSport, fbUpdateSport } from '@/firebase-api/sports';
import {
    createSport,
    removeSport,
    setSelectedSport,
    setShowSportInformation,
    updateSport
} from '@/redux/reducers/sports';
import { Modal } from '@/components/shared';
import { CancelIcon } from '@/public/icons';
import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { increment } from 'firebase/firestore';
import { fbAddTeamAchievement, fbUpdateTeam } from '@/firebase-api/teams';
import { createAchievement, updateTeam } from '@/redux/reducers/teams';

const TeamAchievementsModal = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedTeam } = useAppSelector((state) => state.teams);
    const [selectedPhoto, setSelectedPhoto] = useState('');
    const [selectedAchievement, setSelectedAchievement] = useState<File>();

    const schema = yup.object().shape({
        name: yup.string().required('* required field')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            url: ''
        },
        validationSchema: schema,
        onSubmit: async (values: AchievementProps) => {
            try {
                if (selectedAchievement) {
                    dispatch(
                        setShowSpinnerDialog({
                            open: true,
                            content: 'Adding an achievement...'
                        })
                    );
                    handleClose();
                    const storageRef = ref(
                        storage,
                        `/achievements/${selectedTeam?.id}-${selectedTeam?.name}/${values.name}.jpg`
                    );
                    const uploadTask = await uploadBytes(storageRef, selectedAchievement, {
                        contentType: 'image/jpg'
                    });
                    const url = await getDownloadURL(uploadTask.ref);
                    const payload: AchievementProps = {
                        name: values.name,
                        url,
                        dateAdded: new Date().getTime()
                    };
                    const result = await fbAddTeamAchievement(selectedTeam?.id!, payload);
                    const updateResult = await fbUpdateTeam({
                        ...selectedTeam,
                        achievements: increment(1)
                    } as TeamProps);
                    dispatch(updateTeam(updateResult));
                    dispatch(createAchievement(result));
                    dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                }
            } catch (error) {
                console.log(error);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            }
        }
    });

    useEffect(() => {
        if (open) {
            formik.resetForm();
            setSelectedAchievement(undefined);
            setSelectedPhoto('');
        }
    }, [open]);

    return (
        <Modal open={open} handleClose={handleClose}>
            <section className="w-[600px] bg-white rounded-[8px]">
                <header className="flex items-center justify-between p-[20px]">
                    <p className="text-[18px] font-bold">New Achievement</p>
                    <CancelIcon onClick={handleClose} className="w-[18px] h-[18px] text-error cursor-pointer" />
                </header>
                <form onSubmit={formik.handleSubmit} className="relative w-full grid grid-cols-4 gap-[10px] p-[20px]">
                    <Input
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Name"
                        id="name"
                        name="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.errors.name}
                    />
                    {selectedPhoto && (
                        <div className="col-span-4 h-[600px] bg-black relative">
                            <Image className="object-contain" src={selectedPhoto} alt="achievement" fill />
                        </div>
                    )}
                    <label className="col-span-4 flex items-center justify-center py-[20px]">
                        <input
                            type="file"
                            className="hidden"
                            accept=".png, .jpg, .jpeg"
                            onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                                if (evt.target.files) {
                                    const file = evt.target.files[0];
                                    const url = URL.createObjectURL(file);
                                    setSelectedAchievement(file);
                                    setSelectedPhoto(url);
                                }
                            }}
                        />
                        <span className="text-[14px] text-primary whitespace-nowrap text-center cursor-pointer">
                            Select Achievement
                        </span>
                    </label>
                    <div className="col-span-4 pt-[20px] flex items-center justify-center">
                        <Button type="submit" value="Save" className="w-[100px]" />
                    </div>
                </form>
            </section>
        </Modal>
    );
};

export default TeamAchievementsModal;
