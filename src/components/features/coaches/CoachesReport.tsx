import { lguImg, logoImg } from '@/public/images';
import { printDate } from '@/utils/helpers';
import Image from 'next/image';
import React, { forwardRef, useRef } from 'react';

const CoachesReport = forwardRef(
    (
        {
            coachList,
            selectedSport,
            selectedBarangay
        }: {
            coachList: CoachProps[];
            selectedSport: string;
            selectedBarangay: string;
        },
        ref
    ) => {
        const coachesReportRef = useRef<HTMLDivElement>(null);

        if (ref) {
            if (typeof ref === 'function') {
                ref(coachesReportRef.current);
            } else {
                ref.current = coachesReportRef.current;
            }
        }

        return (
            <div className="hidden">
                <div
                    ref={coachesReportRef}
                    className="w-[800px] flex flex-col items-center h-full bg-white z-[100] p-[40px]"
                >
                    <div className="w-full flex items-center justify-center gap-[20px]">
                        <Image src={logoImg} width={100} height={80} alt="lgu" />
                        <h1 className="font-bold text-[14px]">Municipality of Manolo Fortich Bukidnon</h1>
                        <Image src={lguImg} width={80} height={80} alt="lgu" />
                    </div>
                    <h1 className="text-[20px]">List of Coaches</h1>
                    <div className="w-full flex items-center justify-between text-[14px] py-[20px]">
                        <div className="flex items-center gap-[10px]">
                            <p>
                                <b>Sport:</b> {selectedSport}
                            </p>
                            <p>
                                <b>Barangay:</b> {selectedBarangay}
                            </p>
                        </div>
                        <p>{printDate()}</p>
                    </div>
                    <table className="w-full table-auto text-[14px]">
                        <thead className="h-[40px]">
                            <tr>
                                <th align="left" className="w-[40px]"></th>
                                <th align="left">Name</th>
                                <th align="right">Age</th>
                                <th align="right">Sport</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coachList.map((item, key) => (
                                <tr key={item.id} className="h-[30px]">
                                    <td>{key + 1}</td>
                                    <td>{`${item.firstName} ${item.lastName}`}</td>
                                    <td align="right">{item.age}</td>
                                    <td align="right">{item.sport}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);
CoachesReport.displayName = 'CoachesReport';

export default CoachesReport;
