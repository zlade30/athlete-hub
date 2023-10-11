import { lguImg, logoImg } from '@/public/images';
import { printDate } from '@/utils/helpers';
import Image from 'next/image';
import React, { forwardRef, useRef } from 'react';

const TeamReport = forwardRef(
    (
        {
            teamList
        }: {
            teamList: TeamProps[];
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

        const renderList = () => {
            let count = 0;
            return teamList.map((team) => {
                return team.players.map((player) => {
                    count++;
                    return (
                        <tr key={player.id} className="h-[30px]">
                            <td>{count}</td>
                            <td>{`${team.name}`}</td>
                            <td>{`${team.coach}`}</td>
                            <td>{`${player.firstName} ${player.lastName}`}</td>
                            <td>{`${team.sport}`}</td>
                        </tr>
                    );
                });
            });
        };

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
                    <h1 className="text-[20px]">List of Teams</h1>
                    <div className="w-full flex items-center justify-end text-[14px] py-[20px]">
                        <p>{printDate()}</p>
                    </div>
                    <table className="w-full table-auto text-[14px]">
                        <thead className="h-[40px]">
                            <tr>
                                <th align="left" className="w-[40px]"></th>
                                <th align="left">Team Name</th>
                                <th align="left">Coach</th>
                                <th align="left">Player</th>
                                <th align="left">Sport</th>
                            </tr>
                        </thead>
                        <tbody>{renderList()}</tbody>
                    </table>
                </div>
            </div>
        );
    }
);
TeamReport.displayName = 'TeamReport';

export default TeamReport;
