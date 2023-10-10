'use client';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentInfo, setShowSpinnerDialog } from '@/redux/reducers/app';
import { Input } from '@/components/shared/textfields';
import { Button } from '@/components/shared/buttons';
import { fbAddSport, fbDeleteSport, fbUpdateSport } from '@/firebase-api/sports';
import { createSport, removeSport, setSelectedSport, updateSport } from '@/redux/reducers/sports';

const SportsInformation = () => {
    const dispatch = useDispatch();
    const { selectedSport } = useAppSelector((state) => state.sports);
    const isUpdate = selectedSport?.id;
    const isGuest = localStorage.getItem('id') === 'guest';

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

    const handleClose = () => {
        dispatch(setCurrentInfo('barangay-info'));
        dispatch(setSelectedSport(undefined));
    };

    const handleDelete = async () => {
        try {
            dispatch(setShowSpinnerDialog({ open: true, content: 'Removing sport...' }));
            await fbDeleteSport(selectedSport?.id!);
            dispatch(removeSport(selectedSport?.id!));
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        } catch (error) {
            dispatch(setShowSpinnerDialog({ open: false, content: '' }));
            dispatch(setCurrentInfo('barangay-info'));
        }
    };

    useEffect(() => {
        if (isUpdate) {
            formik.setValues(selectedSport);
        } else {
            formik.resetForm();
        }
    }, [selectedSport]);

    return (
        <>
            <header className="flex items-center justify-between p-[20px]">
                <p className="text-[18px] font-bold">{isUpdate ? 'Update Sport' : 'Add Sport'}</p>
                <Button
                    className="w-[100px] bg-transparent text-primary font-medium hover:bg-secondary"
                    value="Close"
                    onClick={handleClose}
                />
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
        </>
    );
};

export default SportsInformation;
