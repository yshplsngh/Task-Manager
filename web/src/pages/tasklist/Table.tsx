import { ArrowUpDown, ListTodo, SquarePen, Trash2 } from "lucide-react";
import { TaskIdsSchema, type BTaskSchemaType, type PRIORITY_FILTERS, type SORT_FILTERS, type SortMethod, type STATUS_FILTERS, type TaskPriority, type TaskStatus } from "../../app/task/types";
import Button from "../../ui/Button";
import * as React from 'react';
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Checkbox from "../../ui/Checkbox";
import { toast } from "sonner";
import type { FetchResponseError } from "../../utils/api";
import { zodErrorToString } from "../../utils/handleZodError";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { deleteTasks } from "../../app/task/taskSlice";

interface TableProps {
    allTask?: BTaskSchemaType[];
    setAllTask: (remainingTask:BTaskSchemaType[]) => void;

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
        setAllTask,
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
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch:AppDispatch = useDispatch();
    const tableHead = ['Delete All', 'Task ID', 'Title', 'Priority', 'Start Time', 'End Time', 'Time Left', 'Edit'];
    const [sortMenuToggle, setSortMenuToggle] = useState<boolean>(false);
    const [priorityMenuToggle, setPriorityMenuToggle] = useState<boolean>(false)
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

    // this function will add taskId in set if it is true, and remove if false 
    const handleTaskSelection = (taskId: number, checkBoxValue: boolean) => {
        setSelectedTasks(prev => {
            const newSet = new Set(prev);
            if (checkBoxValue) {
                newSet.add(taskId);
            } else {
                newSet.delete(taskId);
            }
            return newSet
        })
    }

    const handleAllTaskSelection = (checked: boolean) => {
        if (checked && allTask) {
            setSelectedTasks(new Set(allTask.map(task => task.id)))
        } else {
            setSelectedTasks(new Set());
        }
    }

    const handleDelete = async () => {
        // send array to server instead of set
        const taskIdsArr = Array.from(selectedTasks);
        const isValid = TaskIdsSchema.safeParse({ ids: taskIdsArr });
        if (isValid.success && allTask) {
            setLoading(true);
            try {
                await dispatch(deleteTasks(isValid.data)).unwrap();
                toast.success('task deleted');
                //here we use set coz set have O(1) lookup time
                const remainingTask = allTask.filter(task => !selectedTasks.has(task.id));
                setAllTask(remainingTask);
                setSelectedTasks(new Set()); // empty selected task coz those are deleted from allTask
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while deleting tasks';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            const errorMessages = isValid.error && zodErrorToString(isValid.error)
            toast.error(`Validation errors: ${errorMessages}`);
        }
    }

    // It will return corresponding data to table head
    const calculateDuration = (endTime: string) => {
        const end = dayjs(endTime);
        const current = dayjs();
        const hours = Math.floor(end.diff(current, 'minute') / 60);
        const minutes = end.diff(current, 'minute') % 60;
        const hourStr = hours > 0 ? `${hours}h` : ''
        const minStr = minutes > 0 ? `${minutes}m` : '0m'
        return `${hourStr} ${hourStr.length > 0 && minStr.length > 0 ? ' : ' : ''} ${minStr}`;
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
                return dayjs(task.startTime).format('D MMM YYYY • h:mm A')
            case 'End Time':
                return dayjs(task.endTime).format('D MMM YYYY • h:mm A')
            case 'Time Left':
                return calculateDuration(task.endTime)
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
                        {/* delete button */}
                        {selectedTasks.size > 0 && (
                            <Button
                                variant={'danger'}
                                type={'button'}
                                text={'Delete'}
                                className={'w-fit'}
                                onClick={() => handleDelete()}
                                icon={<Trash2 className={'h-4 w-4'} />}
                                loading={loading}
                            />
                        )}

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
                            {/* here we are rendering checkbox directly without any switch case check to optimise */}
                            <TableHead key={'Delete All'} name={<Checkbox checked={allTask && allTask?.length > 0 && selectedTasks.size === allTask.length} onCheckedChange={handleAllTaskSelection} />} />
                            {tableHead.slice(1).map((head, index) => <TableHead key={index} name={head} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {allTask && allTask.map((task) => {
                            return (
                                <tr key={task.id}>
                                    <TableData key={'Delete All'} data={<Checkbox checked={selectedTasks.has(task.id)} onCheckedChange={(checkBoxValue) => handleTaskSelection(task.id, checkBoxValue)} />} />
                                    {tableHead.slice(1).map((head) => (
                                        <TableData key={head} data={getCellContent(task, head)} task={task} />
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
                text={name === 'PENDING' ? 'TASK' : name}
                onClick={() => setActiveStatusFilter(name)}
                className="rounded-2xl"
            />
        </li>
    )
}

export const TableHead = ({ name }: { name: string | React.ReactElement }) => {
    return (
        <th
            className="p-4 transition-colors border-y border-accent bg-blue-gray-50/50 hover:bg-blue-gray-50">
            <div
                className=" gap-2 font-sans text-md antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                {name}
            </div>
        </th>
    )
}

export const TableData = ({ data, task }: { data: string | number | React.ReactElement, task?: BTaskSchemaType }) => {
    return (
        <td className="p-4 border-b border-accent">
            <div className={`block font-sans text-md antialiased font-normal leading-norma ${task?.taskStatus === "FINISHED" ? 'text-zinc-600' : 'text-whitish'}`}>
                {data}
            </div>
        </td>
    )
}