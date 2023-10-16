'use client';

import * as yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { defaultProfileImg } from '@/public/images';
import { defaultOptionData, genderData, suffixData } from '@/utils/helpers';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { getBarangay, getSports } from '@/firebase-api/utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/firebase';
import { setCurrentInfo, setShowSpinnerDialog } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { Select } from '@/components/shared/options';
import { Button } from '@/components/shared/buttons';
import { fbAddCoach, fbDeleteCoach, fbUpdateCoach } from '@/firebase-api/coaches';
import {
    createCoach,
    removeCoach,
    setSelectedCoach,
    setShowCoachInformation,
    updateCoach
} from '@/redux/reducers/coaches';
import { Modal } from '@/components/shared';
import { CancelIcon } from '@/public/icons';

const CoachesInformation = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedCoach } = useAppSelector((state) => state.coaches);
    const [barangay, setBarangay] = useState<SelectPropsData[]>();
    const [sports, setSports] = useState<SelectPropsData[]>();
    const [selectedPhoto, setSelectedPhoto] = useState<File>();
    const isUpdate = selectedCoach?.id;
    const [isGuest, setIsGuest] = useState(false);

    const schema = yup.object().shape({
        profile: yup.string().notRequired(),
        lastName: yup.string().required('* required field'),
        firstName: yup.string().required('* required field'),
        suffix: yup.string().notRequired(),
        gender: yup.string().required('* required field'),
        sport: yup.string().required('* required field'),
        barangay: yup.string().required('* required field'),
        age: yup.string().required('* required field')
    });

    const formik = useFormik({
        initialValues: {
            profile: '',
            lastName: '',
            firstName: '',
            suffix: '',
            barangay: '',
            sport: '',
            gender: '',
            age: '',
            dateAdded: 0,
            dateUpdated: 0
        },
        validationSchema: schema,
        onSubmit: async (values: CoachProps) => {
            try {
                dispatch(
                    setShowSpinnerDialog({
                        open: true,
                        content: isUpdate ? 'Updating a coach...' : 'Adding a coach...'
                    })
                );
                dispatch(setShowCoachInformation(false));
                let result;
                let profile = '';
                let lastName = values.lastName.charAt(0).toUpperCase() + values.lastName.slice(1);
                let firstName = values.firstName.charAt(0).toUpperCase() + values.firstName.slice(1);
                if (selectedPhoto) {
                    const storageRef = ref(storage, `/coaches/${values.firstName} ${values.lastName}/profile.png`);
                    const uploadTask = await uploadBytes(storageRef, selectedPhoto, {
                        contentType: 'image/png'
                    });
                    profile = await getDownloadURL(uploadTask.ref);
                }
                if (isUpdate) {
                    result = await fbUpdateCoach({
                        ...values,
                        profile: profile || values.profile,
                        dateUpdated: new Date().getTime(),
                        lastName,
                        firstName
                    });
                    dispatch(updateCoach(result!));
                } else {
                    result = await fbAddCoach({
                        ...values,
                        profile,
                        dateAdded: new Date().getTime(),
                        lastName,
                        firstName
                    });
                    dispatch(createCoach(result!));
                    dispatch(setCurrentInfo('barangay-info'));
                }
                setSelectedPhoto(undefined);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            } catch (error) {
                console.log(error);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                dispatch(setCurrentInfo('barangay-info'));
            }
        }
    });

    const onClose = () => {
        dispatch(setCurrentInfo('barangay-info'));
        dispatch(setSelectedCoach(undefined));
        handleClose();
        formik.resetForm();
    };

    const loadData = async () => {
        try {
            const barangayList = await getBarangay();
            const sportsList = await getSports();
            setBarangay(barangayList.filter((item) => item.value !== 'All'));
            setSports(sportsList.filter((item) => item.value !== 'All'));
        } catch (error) {}
    };

    const handleDelete = async () => {
        try {
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing coach...' }));
            dispatch(setShowCoachInformation(false));
            await fbDeleteCoach(selectedCoach?.id!);
            dispatch(removeCoach(selectedCoach?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        }
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
        loadData();
    }, []);

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedCoach);
        } else {
            formik.resetForm();
        }
        console.log(selectedCoach);
        setSelectedPhoto(undefined);
    }, [selectedCoach]);

    return (
        <Modal open={open} handleClose={onClose}>
            <section className="w-[400px] h-full bg-white rounded-[8px]">
                <header className="flex items-center justify-between p-[20px]">
                    {isGuest ? (
                        <p className="text-[18px] font-bold">Coach Info</p>
                    ) : (
                        <p className="text-[18px] font-bold">{isUpdate ? 'Update Coach' : 'Add Coach'}</p>
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
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.errors.firstName}
                    />
                    <Input
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.errors.lastName}
                    />
                    <Select
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
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
                    <Select
                        disabled={isGuest}
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
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
                        disabled={isGuest}
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
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
                        disabled={isGuest}
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
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
                        disabled={isGuest}
                        containerClassName="col-span-2 flex flex-col gap-[4px]"
                        label="Age"
                        id="age"
                        name="age"
                        type="text"
                        value={formik.values.age}
                        onChange={(evt: ChangeEvent<HTMLInputElement>) => {
                            const value = evt.target.value;
                            const numericValue = value.replace(/[^0-9.]/g, '');
                            formik.setFieldValue('age', numericValue);
                        }}
                        error={formik.errors.age}
                    />
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

export default CoachesInformation;
