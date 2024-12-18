import { ArrowUpDown, ListTodo, SquarePen } from "lucide-react";
import type { BTaskSchemaType, PRIORITY_FILTERS, SORT_FILTERS, SortMethod, STATUS_FILTERS, TaskPriority, TaskStatus } from "../../app/task/types";
import Button from "../../ui/Button";
import * as React from 'react';
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface TableProps {
    allTask?: BTaskSchemaType[];

    STATUS_FILTERS: typeof STATUS_FILTERS;
    activeStatusFilter: TaskStatus;
    setActiveStatusFilter: (taskStatus: TaskStatus) => void;

    SORT_FILTERS: typeof SORT_FILTERS;
    activeSortFilter: SortMethod;
    setActiveSortFilter: (sortMethod: SortMethod) => void;

    PRIORITY_FILTERS: typeof PRIORITY_FILTERS;
    activePriorityFilter: TaskPriority
    setActivePriorityFilter: (taskPriority: TaskPriority) => void;
}

const Table = (
    {
        allTask,
        STATUS_FILTERS,
        activeStatusFilter,
        setActiveStatusFilter,
        SORT_FILTERS,
        activeSortFilter,
        setActiveSortFilter,
        PRIORITY_FILTERS,
        activePriorityFilter,
        setActivePriorityFilter
    }: TableProps) => {

    const navigate = useNavigate();
    const tableHead = ['Task ID', 'Title', 'Task Status', 'Priority', 'Start Time', 'End Time', 'Task Duration', 'Edit'];
    const [sortMenuToggle, setSortMenuToggle] = useState<boolean>(false);
    const [priorityMenuToggle, setPriorityMenuToggle] = useState<boolean>(false)

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
        <div className="relative flex pb-2 pt-10 space-y-5 flex-col w-full h-full text-whitish bg-transparent border-2 border-accent shadow-md rounded-xl bg-clip-border">
            <div className="px-4 text-whitish bg-transparent rounded-none bg-clip-border">
                <nav className="flex justify-between">

                    {/* status button */}
                    <ul role="tablist" className="flex flex-row space-x-4">
                        {STATUS_FILTERS.map((tab, index) => <TableButton key={index} name={tab} activeStatusFilter={activeStatusFilter} setActiveStatusFilter={setActiveStatusFilter} />)}
                    </ul>

                    <div className="flex space-x-4">
                        {/* sorting button */}
                        <div className="relative">
                            <Button
                                type={'button'}
                                variant={'outlineB'}
                                text="Sort"
                                className={'w-fit rounded-2xl'}
                                icon={<ArrowUpDown className="size-4 text-whitish" />}
                                onClick={() => setSortMenuToggle((prev) => !prev)}
                            />

                            {sortMenuToggle && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.1 }}
                                    className={
                                        'border-accent bg-secondary-dark absolute right-0 top-10 border-[2px] p-1 z-10 rounded-2xl'
                                    }
                                >
                                    {SORT_FILTERS.map((name, index) => (
                                        <Button
                                            key={index}
                                            type={'button'}
                                            variant={'outlineB'}
                                            text={name}
                                            className={`hover:bg-accent justify-start border-none ${activeSortFilter === name ? 'bg-accent' : 'bg-transparent'}`}
                                            onClick={() => setActiveSortFilter(name)}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* priority button */}
                        <div className="relative">
                            <Button
                                type={'button'}
                                variant={'outlineB'}
                                text="Priority"
                                className={'w-fit rounded-2xl'}
                                icon={<ListTodo className="size-4 text-whitish" />}
                                onClick={() => setPriorityMenuToggle((prev) => !prev)}
                            />

                            {priorityMenuToggle && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.1 }}
                                    className={
                                        'border-accent bg-secondary-dark absolute right-0 top-10 border-[2px] p-1 z-10 rounded-2xl'
                                    }
                                >
                                    {PRIORITY_FILTERS.map((name, index) => (
                                        <Button
                                            key={index}
                                            type={'button'}
                                            variant={'outlineB'}
                                            text={name}
                                            className={`hover:bg-accent justify-start border-none ${activePriorityFilter === name ? 'bg-accent' : 'bg-transparent'}`}
                                            onClick={() => setActivePriorityFilter(name)}
                                        />
                                    ))}
                                </motion.div>
                            )}

                        </div>
                    </div>
                </nav>
            </div>
            <div className="px-0">
                <table className="w-full text-left table-auto min-w-max">
                    <thead className="bg-third-dark">
                        <tr>
                            {tableHead.map((head, index) => <TableHead key={index} name={head} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {allTask && allTask.map((task) => {
                            return (
                                <tr key={task.id} className="even:bg-accent/20">
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


const TableButton = ({ name, activeStatusFilter, setActiveStatusFilter }: { name: TaskStatus, activeStatusFilter: TaskStatus, setActiveStatusFilter: (taskStatus: TaskStatus) => void }) => {
    return (
        <li role="tab"
            data-value={name}>
            <Button
                type="button"
                variant={`${name === activeStatusFilter ? "secondary" : "outlineB"}`}
                text={name}
                onClick={() => setActiveStatusFilter(name)}
                className="rounded-2xl"
            />
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