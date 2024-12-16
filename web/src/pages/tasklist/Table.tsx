import { SquarePen } from "lucide-react";
import type { BTaskSchemaType } from "../../app/task/types";
import Button from "../../ui/Button";
import * as React from 'react';
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { STATUS_FILTERS, type TaskStatus } from "../../app/task/types";

interface TableProps {
    allTask: BTaskSchemaType[];
    statusFilter: typeof STATUS_FILTERS;
    activeStatusFilter: TaskStatus;
    setActiveStatusFilter: (status: TaskStatus) => void;
}

const Table = ({ allTask, statusFilter, activeStatusFilter, setActiveStatusFilter }: TableProps) => {
    const navigate = useNavigate();
    console.log('table')
    const tableHead = ['Task ID', 'Title', 'Task Status', 'Priority', 'Start Time', 'End Time', 'Task Duration', 'Edit']

    // It will return corresponding data to table head
    const calculateDuration = (startTime: string, endTime: string) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        const hours = Math.floor(end.diff(start, 'minute') / 60);
        const minutes = end.diff(start, 'minute') % 60;
        const hourStr = hours > 0 ? `${hours}h` : ''
        const minStr = minutes !== 0 ? `${minutes}m` : ''
        return `${hourStr} ${hourStr.length > 0 && minStr.length > 0 ? ' : ' : ''} ${minStr}`;
    }

    const getCellContent = (task: BTaskSchemaType, header: string) => {
        switch (header) {
            case 'Task ID':
                return task.id;
            case 'Title':
                return task.title;
            case 'Task Status':
                return task.taskStatus
            case 'Priority':
                return task.priority;
            case 'Start Time':
                return dayjs(task.startTime).format('D MMM YYYY • h:mm A')
            case 'End Time':
                return dayjs(task.endTime).format('D MMM YYYY • h:mm A')
            case 'Task Duration':
                return calculateDuration(task.startTime, task.endTime)
            case 'Edit':
                return (
                    <Button
                        type={'button'}
                        variant={'outlineB'}
                        icon={<SquarePen className={'h-4 w-4'} />}
                        className={`hover:bg-accent rounded-xl w-fit border-none bg-transparent`}
                        onClick={() => navigate(`/tasklist/edit/${task.id}`)}
                    />
                )
            default:
                return '';
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full text-whitish bg-transparent border-2 border-accent overflow-hidden shadow-md rounded-xl bg-clip-border">
            <div className="relative mx-4 mt-4 overflow-hidden text-whitish bg-transparent rounded-none bg-clip-border">
                <div className="block w-full overflow-hidden md:w-max">
                    <nav>
                        <ul role="tablist" className="relative flex flex-row p-1 space-x-3 rounded-lg bg-blue-gray-50 bg-opacity-60">
                            {statusFilter.map((tab, index) => <TableButton key={index} name={tab} activeStatusFilter={activeStatusFilter} setActiveStatusFilter={setActiveStatusFilter} />)}
                        </ul>
                    </nav>
                </div>
            </div>
            <div className="px-0 overflow-scroll">
                <table className="w-full mt-4 text-left table-auto min-w-max">
                    <thead className="bg-third-dark">
                        <tr>
                            {tableHead.map((head, index) => <TableHead key={index} name={head} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {allTask.map((task) => {
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


const TableButton = ({ name, activeStatusFilter, setActiveStatusFilter }: { name: TaskStatus, activeStatusFilter: TaskStatus, setActiveStatusFilter: (status: TaskStatus) => void }) => {
    return (
        <li role="tab"
            data-value={name}>
            <Button type="button" variant={`${name === activeStatusFilter ? "secondary" : "outlineB"}`} text={name} onClick={() => setActiveStatusFilter(name)} />
        </li>
    )
}

export const TableHead = ({ name }: { name: string }) => {
    return (
        <th
            className="p-4 transition-colors border-y border-accent bg-blue-gray-50/50 hover:bg-blue-gray-50">
            <p
                className=" gap-2 font-sans text-md antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                {name}
            </p>
        </th>
    )
}
export const TableData = ({ data }: { data: string | number | React.ReactElement }) => {
    return (
        <td className="p-4 border-b border-accent">
            <p className="block font-sans text-md antialiased font-normal leading-normal text-blue-gray-900">
                {data}
            </p>
        </td>
    )
}