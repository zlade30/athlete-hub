import { printDate } from '@/utils/helpers';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const PlayersReport = forwardRef(
    (
        {
            playerList,
            selectedSport,
            selectedBarangay
        }: {
            playerList: PlayerProps[];
            selectedSport: string;
            selectedBarangay: string;
        },
        ref
    ) => {
        const playersReportRef = useRef<HTMLDivElement>(null);

        if (ref) {
            if (typeof ref === 'function') {
                ref(playersReportRef.current);
            } else {
                ref.current = playersReportRef.current;
            }
        }

        return (
            <div className="hidden">
                <div
                    ref={playersReportRef}
                    className="w-[800px] flex flex-col items-center h-full bg-white z-[100] p-[40px]"
                >
                    <h1 className="font-bold text-[20px]">List of Players</h1>
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
                            {playerList.map((item, key) => (
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
PlayersReport.displayName = 'PlayersReport';

export default PlayersReport;
