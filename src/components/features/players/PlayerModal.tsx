'use client';

import * as yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { defaultProfileImg } from '@/public/images';
import { defaultOptionData, genderData, suffixData } from '@/utils/helpers';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { createPlayer, setShowPlayerModal, updatePlayer } from '@/redux/reducers/players';
import { ChangeEvent, useEffect, useState } from 'react';
import { getBarangay, getSports } from '@/firebase-api/utils';
import { getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { storage } from '@/firebase';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { fbAddPlayer, fbUpdatePlayer } from '@/firebase-api/player';
import { Input } from '@/components/shared/textfields';
import { Select } from '@/components/shared/options';
import { Button } from '@/components/shared/buttons';
import { Modal } from '@/components/shared';

const PlayerModal = () => {
    const dispatch = useDispatch();
    const { showPlayerModal, selectedPlayer } = useAppSelector((state) => state.player);
    const [barangay, setBarangay] = useState<SelectPropsData[]>();
    const [sports, setSports] = useState<SelectPropsData[]>();
    const [selectedPhoto, setSelectedPhoto] = useState<File>();
    const isUpdate = selectedPlayer?.id;

    const schema = yup.object().shape({
        profile: yup.string().notRequired(),
        lastName: yup.string().required('* required field'),
        firstName: yup.string().required('* required field'),
        suffix: yup.string().notRequired(),
        gender: yup.string().required('* required field'),
        sport: yup.string().required('* required field'),
        barangay: yup.string().required('* required field'),
        height: yup.string().notRequired(),
        age: yup.string().required('* required field'),
        weight: yup.string().notRequired(),
        achievements: yup.array().notRequired(),
        videos: yup.array().notRequired()
    });

    const formik = useFormik({
        initialValues: {
            profile: '',
            lastName: '',
            firstName: '',
            suffix: '',
            barangay: '',
            sport: '',
            height: '',
            gender: '',
            age: '',
            weight: '',
            achivements: [],
            videos: [],
            dateAdded: 0,
            dateUpdated: 0
        },
        validationSchema: schema,
        onSubmit: async (values: PlayerProps) => {
            try {
                dispatch(setShowPlayerModal(false));
                dispatch(
                    setShowSpinnerDialog({
                        open: true,
                        content: isUpdate ? 'Updating a player...' : 'Adding a player...'
                    })
                );
                let result;
                let profile = '';
                let lastName = values.lastName.charAt(0).toUpperCase() + values.lastName.slice(1);
                let firstName = values.firstName.charAt(0).toUpperCase() + values.firstName.slice(1);
                if (selectedPhoto) {
                    const storageRef = ref(storage, `/players/${values.firstName} ${values.lastName}/profile.png`);
                    const uploadTask = await uploadBytes(storageRef, selectedPhoto, {
                        contentType: 'image/png'
                    });
                    profile = await getDownloadURL(uploadTask.ref);
                }
                if (isUpdate) {
                    result = await fbUpdatePlayer({
                        ...values,
                        profile: profile || values.profile,
                        dateUpdated: new Date().getTime(),
                        lastName,
                        firstName
                    });
                    dispatch(updatePlayer(result!));
                } else {
                    result = await fbAddPlayer({
                        ...values,
                        profile,
                        dateAdded: new Date().getTime(),
                        lastName,
                        firstName
                    });
                    dispatch(createPlayer(result!));
                }
                setSelectedPhoto(undefined);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            } catch (error) {
                console.log(error);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            }
        }
    });

    const handleClose = () => {
        dispatch(setShowPlayerModal(false));
    };

    const loadData = async () => {
        try {
            const barangayList = await getBarangay();
            const sportsList = await getSports();
            setBarangay(barangayList);
            setSports(sportsList);
        } catch (error) {}
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (showPlayerModal && isUpdate) {
            formik.setValues(selectedPlayer);
        } else if (showPlayerModal && !isUpdate) {
            formik.resetForm();
        }
        return () => {
            setSelectedPhoto(undefined);
        };
    }, [showPlayerModal]);

    return (
        <Modal open={showPlayerModal} handleClose={handleClose}>
            <div className="relative w-[600px] max-h-max-[1000px] bg-white rounded-[8px] p-[20px]">
                <header className="flex items-center justify-between">
                    <p className="text-[18px] font-bold">{isUpdate ? 'Update Player' : 'Add Player'}</p>
                    <Button
                        className="w-[100px] bg-transparent text-primary font-medium hover:bg-secondary"
                        value="Close"
                        onClick={handleClose}
                    />
                </header>
                <form onSubmit={formik.handleSubmit} className="relative w-full grid grid-cols-4 gap-[10px] py-[20px]">
                    <div className="col-span-4 py-[20px] flex items-center justify-center">
                        <label>
                            <input
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
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.errors.firstName}
                    />
                    <Input
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.errors.lastName}
                    />
                    <div className="col-span-4 grid grid-cols-3 gap-[10px]">
                        <Select
                            containerClassName="col-span-1 flex flex-col gap-[4px]"
                            label="Gender"
                            id="gender"
                            name="gender"
                            value={formik.values.gender}
                            error={formik.errors.gender}
                            data={genderData()}
                            onSelectItem={(item: SelectPropsData) => {
                                formik.setFieldValue('gender', item.value);
                            }}
                        />
                        <Select
                            containerClassName="col-span-1 flex flex-col gap-[4px]"
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
                            containerClassName="col-span-1 flex flex-col gap-[4px]"
                            label="Barangay"
                            id="barangay"
                            name="barangay"
                            value={formik.values.barangay}
                            error={formik.errors.barangay}
                            data={barangay || defaultOptionData()}
                            onSelectItem={(item: SelectPropsData) => {
                                formik.setFieldValue('barangay', item.value);
                            }}
                        />
                    </div>
                    <Select
                        containerClassName="flex flex-col gap-[4px]"
                        label="Suffix"
                        id="suffix"
                        name="suffix"
                        value={formik.values.suffix}
                        error={formik.errors.suffix}
                        data={suffixData()}
                        onSelectItem={(item: SelectPropsData) => {
                            formik.setFieldValue('suffix', item.value);
                        }}
                    />
                    <Input
                        containerClassName="flex flex-col gap-[4px]"
                        label="Age"
                        id="age"
                        name="age"
                        type="number"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        error={formik.errors.age}
                        pattern="[0-9]"
                    />
                    <Input
                        containerClassName="flex flex-col gap-[4px]"
                        label="Height"
                        id="height"
                        name="height"
                        type="number"
                        placeholder="cm"
                        className="normal-case"
                        value={formik.values.height}
                        onChange={formik.handleChange}
                        error={formik.errors.height}
                        pattern="[0-9]"
                    />
                    <Input
                        containerClassName="flex flex-col gap-[4px]"
                        label="Weight"
                        id="weight"
                        name="weight"
                        type="number"
                        placeholder="kg"
                        className="normal-case"
                        value={formik.values.weight}
                        onChange={formik.handleChange}
                        error={formik.errors.weight}
                        pattern="[0-9]"
                    />
                    <div className="col-span-4 pt-[20px] flex items-center justify-center">
                        <Button type="submit" value="Save" className="w-[100px]" />
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default PlayerModal;
