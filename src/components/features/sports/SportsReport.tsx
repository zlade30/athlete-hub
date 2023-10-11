import { lguImg, logoImg } from '@/public/images';
import { printDate } from '@/utils/helpers';
import Image from 'next/image';
import React, { forwardRef, useRef } from 'react';

const SportsReport = forwardRef(
    (
        {
            sportsList
        }: {
            sportsList: SportProps[];
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
                    <h1 className="text-[20px]">List of Sports</h1>
                    <div className="w-full flex items-center justify-end text-[14px] py-[20px]">
                        <p>{printDate()}</p>
                    </div>
                    <table className="w-full table-auto text-[14px]">
                        <thead className="h-[40px]">
                            <tr>
                                <th align="left" className="w-[40px]"></th>
                                <th align="left">Sport Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sportsList.map((item, key) => (
                                <tr key={item.id} className="h-[30px]">
                                    <td>{key + 1}</td>
                                    <td>{`${item.name}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
);
SportsReport.displayName = 'SportsReport';

export default SportsReport;
