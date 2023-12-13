'use client';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
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
import { fbGetPlayerFromSports, fbGetPlayers, fbUpdatePlayer } from '@/firebase-api/player';

const SportsInformation = ({ open, handleClose }: Omit<ModalProps, 'children'>) => {
    const dispatch = useDispatch();
    const { selectedSport } = useAppSelector((state) => state.sports);
    const isUpdate = selectedSport?.id;
    const [isGuest, setIsGuest] = useState(false);

    const schema = yup.object().shape({
        name: yup.string().required('* required field')
    });

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: schema,
        onSubmit: async (values: SportProps) => {
            try {
                dispatch(
                    setShowSpinnerDialog({
                        open: true,
                        content: isUpdate ? 'Updating a sport...' : 'Adding a sport...'
                    })
                );
                dispatch(setShowSportInformation(false));
                let result;
                let name = values.name.charAt(0).toUpperCase() + values.name.slice(1);
                if (isUpdate) {
                    result = await fbUpdateSport({
                        ...values,
                        name,
                        dateUpdated: new Date().getTime()
                    });
                    dispatch(updateSport(result!));
                } else {
                    result = await fbAddSport({
                        ...values,
                        name,
                        dateAdded: new Date().getTime()
                    });
                    dispatch(createSport(result!));
                    dispatch(setCurrentInfo('barangay-info'));
                }
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
        dispatch(setSelectedSport(undefined));
        handleClose();
        formik.resetForm();
    };

    const handleDelete = async () => {
        try {
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing sport...' }));
            dispatch(setShowSportInformation(false));
            await fbDeleteSport(selectedSport?.id!);
            const results = await fbGetPlayerFromSports(selectedSport?.name!);
            results.forEach(async (player) => {
                await fbUpdatePlayer({ ...player, removed: true });
            });
            dispatch(removeSport(selectedSport?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        }
    };

    useEffect(() => {
        setIsGuest(localStorage.getItem('id') === 'guest');
    }, []);

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedSport);
        } else {
            formik.resetForm();
        }
    }, [selectedSport]);

    return (
        <Modal open={open} handleClose={onClose}>
            <section className="w-[400px] h-full bg-white rounded-[8px]">
                <header className="flex items-center justify-between p-[20px]">
                    <p className="text-[18px] font-bold">{isUpdate ? 'Update Sport' : 'Add Sport'}</p>
                    <CancelIcon onClick={onClose} className="w-[18px] h-[18px] text-error cursor-pointer" />
                </header>
                <form onSubmit={formik.handleSubmit} className="relative w-full grid grid-cols-4 gap-[10px] p-[20px]">
                    <Input
                        disabled={isGuest}
                        containerClassName="col-span-4 flex flex-col gap-[4px]"
                        label="Sport Name"
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

export default SportsInformation;
