import { SquarePen } from "lucide-react";
import type { BTaskSchemaType } from "../../app/task/types";
import Button from "../../ui/Button";
import * as React from 'react';
import dayjs from "dayjs";

const Table = () => {
    const tabOptions = ['All', 'Finished', 'Pending']
    const tableHead = ['Task ID', 'Title', 'Priority', 'Start Time', 'End Time', 'Task Duration', 'Edit']
    const taskCount: BTaskSchemaType[] = [
        {
            id: 1,
            title: "Complete Project Documentation",
            priority: 1,
            taskStatus: "Pending",
            startTime: "2024-01-20 09:00:00",
            endTime: "2024-01-20 11:00:00",
        },
        {
            id: 2,
            title: "Team Meeting",
            priority: 2,
            taskStatus: "Finished",
            startTime: "2024-01-20 14:00:00",
            endTime: "2024-01-20 15:30:00",
        },
        {
            id: 3,
            title: "Code Review",
            priority: 3,
            taskStatus: "Pending",
            startTime: "2024-01-21 10:00:00",
            endTime: "2024-01-21 12:00:00",
        },
        {
            id: 4,
            title: "Bug Fixes",
            priority: 4,
            taskStatus: "Pending",
            startTime: "2024-01-22 13:00:00",
            endTime: "2024-01-22 17:00:00",
        }];

    // It will return corresponding data to table head
    const calculateDuration = (startTime: string, endTime: string) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        const hours = Math.floor(end.diff(start, 'minute') / 60);
        const minutes = end.diff(start, 'minute') % 60;
        return `${hours}h ${minutes}m`;
    }
    const getCellContent = (task: BTaskSchemaType, header: string) => {
        switch (header) {
            case 'Task ID':
                return task.id;
            case 'Title':
                return task.title;
            case 'Priority':
                return task.priority;
            case 'Start Time':
                return task.startTime;
            case 'End Time':
                return task.endTime;
            case 'Task Duration':
                return calculateDuration(task.startTime, task.endTime)
            case 'Edit':
                return (
                    <Button
                        type={'button'}
                        variant={'outlineB'}
                        icon={<SquarePen className={'h-4 w-4'} />}
                        className={`hover:bg-accent rounded-xl w-fit border-none bg-transparent`}
                    // onClick={() => }
                    />
                )
            default:
                return '';
        }
    };
    return (
        <div className="relative flex flex-col w-full h-full text-white bg-transparent border-2 border-accent shadow-md rounded-xl bg-clip-border">
            <div className="relative mx-4 mt-4 overflow-hidden text-white bg-transparent rounded-none bg-clip-border">
                <div className="block w-full overflow-hidden md:w-max">
                    <nav>
                        <ul role="tablist" className="relative flex flex-row p-1 rounded-lg bg-blue-gray-50 bg-opacity-60">
                            {tabOptions.map((tab, index) => <TableButton key={index} name={tab} />)}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="px-0 overflow-scroll">
                <table className="w-full mt-4 text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            {tableHead.map((head, index) => <TableHead key={index} name={head} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {taskCount.map((task) => {
                            return (
                                <tr key={task.id}>
                                    {tableHead.map((head) => (
                                        <TableData key={head} data={getCellContent(task, head)} />
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Table


const TableButton = ({ name }: { name: string }) => {
    return (
        <li role="tab"
            className="relative flex items-center justify-center w-full h-full px-5 py-1 font-sans text-base antialiased font-normal leading-relaxed text-center bg-transparent cursor-pointer select-none text-whitish"
            data-value={name}>
            <div className="z-20 text-inherit">
                {name}
            </div>
        </li>
    )
}

const TableHead = ({ name }: { name: string }) => {
    return (
        <th
            className="p-4 transition-colors border-y border-accent bg-blue-gray-50/50 hover:bg-blue-gray-50">
            <p
                className="flex items-center justify-between gap-2 font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                {name}
            </p>
        </th>
    )
}
const TableData = ({ data }: { data: string | number | React.ReactElement }) => {
    return (
        <td className="p-4 border-b border-accent">
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                {data}
            </p>
        </td>
    )
}