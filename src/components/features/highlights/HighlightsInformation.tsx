'use client';

import * as yup from 'yup';
import Image from 'next/image';
import { useFormik } from 'formik';
import { defaultProfileImg } from '@/public/images';
import { generateId } from '@/utils/helpers';
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
    setSelectedHighlights,
    setShowHighlightInformation,
    updateHighlights
} from '@/redux/reducers/highlights';
import { Modal } from '@/components/shared';
import { CancelIcon } from '@/public/icons';

const HighlightsInformation = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedHighlight } = useAppSelector((state) => state.highlights);
    const [selectedPhoto, setSelectedPhoto] = useState<File>();
    const isUpdate = selectedHighlight?.id;
    const [isGuest, setIsGuest] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required('* required field')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            image: '',
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
                        dateUpdated: new Date().getTime()
                    });
                    dispatch(updateHighlights(result!));
                } else {
                    result = await fbAddHighlights({
                        ...values,
                        image,
                        dateAdded: new Date().getTime()
                    });
                    dispatch(createHighlights(result!));
                }
                setSelectedPhoto(undefined);
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            } catch (error) {
                console.log(error);
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

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedHighlight);
        } else {
            formik.resetForm();
        }
        setSelectedPhoto(undefined);
    }, [selectedHighlight]);

    return (
        <Modal open={open} handleClose={onClose}>
            <section className="w-[400px] h-full bg-white rounded-[8px]">
                <header className="flex items-center justify-between p-[20px]">
                    {isGuest ? (
                        <p className="text-[18px] font-bold">Highlight Info</p>
                    ) : (
                        <p className="text-[18px] font-bold">{isUpdate ? 'Update Highlight' : 'Add Highlight'}</p>
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

export default HighlightsInformation;
