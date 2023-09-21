import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Select } from '@/components/shared/options';
import { getBarangay } from '@/firebase-api/utils';
import { setBarangayList, setSelectedBarangay } from '@/redux/reducers/barangay';
import { useAppSelector } from '@/redux/store';

const BarangayInformation = () => {
    const dispatch = useDispatch();
    const { players } = useAppSelector((state) => state.player);
    const { selectedBarangay, barangayList } = useAppSelector((state) => state.barangay);
    const [availablePlayers, setAvailablePlayers] = useState<PlayerProps[]>([]);

    const loadBarangay = async () => {
        try {
            const list = await getBarangay();
            dispatch(setBarangayList(list));
        } catch (error) {}
    };

    const handleSelectedItem = (option: SelectPropsData) => {
        dispatch(setSelectedBarangay(option.value));
    };

    const maleCount = useMemo(() => {
        return availablePlayers.filter((item) => item.gender === 'Male').length;
    }, [availablePlayers]);

    const femaleCount = useMemo(() => {
        return availablePlayers.filter((item) => item.gender === 'Female').length;
    }, [availablePlayers]);

    const playerCount = useMemo(() => {
        return availablePlayers.length;
    }, [availablePlayers]);

    const sportCount = useMemo(() => {
        const uniqueList = Array.from(new Set(availablePlayers.map((obj) => obj.sport))).map((sport) => {
            return availablePlayers.find((obj) => obj.sport === sport);
        });
        return uniqueList.length;
    }, [availablePlayers]);

    useEffect(() => {
        loadBarangay();
    }, []);

    useEffect(() => {
        if (selectedBarangay === 'All') {
            const list = players.filter((item) => item.barangay !== 'All');
            setAvailablePlayers(list);
        } else {
            const list = players.filter((item) => item.barangay === selectedBarangay);
            setAvailablePlayers(list);
        }
    }, [players, selectedBarangay]);

    return (
        <>
            <div className="w-full border-b border-b-gray-200 p-[40px]">
                <Select
                    containerClassName="w-full flex flex-col gap-[4px]"
                    label="Barangay"
                    value={selectedBarangay}
                    data={barangayList! || []}
                    onSelectItem={handleSelectedItem}
                />
            </div>
            <div className="w-full grid grid-cols-2 p-[40px] gap-[20px]">
                <div className="flex flex-col justify-center items-start bg-secondary h-[150px] p-[20px] rounded-[8px]">
                    <p className="uppercase text-[12px]">Male</p>
                    <div className="flex items-center">
                        <div />
                        <p className="text-[40px] font-bold text-blue-500">{maleCount}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start bg-secondary h-[150px] p-[20px] rounded-[8px]">
                    <p className="uppercase text-[12px]">Female</p>
                    <div className="flex items-center">
                        <div />
                        <p className="text-[40px] font-bold text-pink-500">{femaleCount}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start bg-secondary h-[150px] p-[20px] rounded-[8px]">
                    <p className="uppercase text-[12px]">Players</p>
                    <div className="flex items-center">
                        <div />
                        <p className="text-[40px] font-bold text-primary">{playerCount}</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-start bg-secondary h-[150px] p-[20px] rounded-[8px]">
                    <p className="uppercase text-[12px]">Sports</p>
                    <div className="flex items-center">
                        <div />
                        <p className="text-[40px] font-bold text-green-500">{sportCount}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BarangayInformation;
