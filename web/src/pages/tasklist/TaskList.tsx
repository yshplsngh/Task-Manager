import { motion } from "framer-motion";
import { LayoutDashboard, SquarePlus } from "lucide-react";
import Button from "../../ui/Button";
import Table from "./Table";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import LoLoadingSpinner from "../../ui/LoLoadingSpinner";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getTask } from "../../app/task/taskSlice";
import type { FetchResponseError } from "../../utils/api";
import { toast } from "sonner";
import { type BTaskSchemaType, type SortMethod, STATUS_FILTERS, type TaskStatus, SORT_FILTERS, type TaskPriority, PRIORITY_FILTERS } from "../../app/task/types";

const TaskList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const [allTask, setAllTask] = useState<BTaskSchemaType[]>();
    const [activeStatusFilter, setActiveStatusFilter] = useState<TaskStatus>('PENDING');
    const [activeSortFilter, setActiveSortFilter] = useState<SortMethod>('START TIME: ASC');
    const [activePriorityFilter,setActivePriorityFilter] = useState<TaskPriority>('None')

    useEffect(() => {
        async function fetchTask() {
            setLoading(true);
            try {
                const data = await dispatch(getTask({ status: activeStatusFilter,sortBy:activeSortFilter,priority:activePriorityFilter })).unwrap();
                setAllTask(data.json)
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while fetching tasks';
                toast.error(errorMessage);
            }
        }
        fetchTask().then(() => setLoading(false))
    }, [dispatch, activeStatusFilter,activeSortFilter,activePriorityFilter])


    return !loading ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, type: 'tween' }}
        >
            <div className="w-full">
                <div className="flex flex-row items-center justify-between px-3 py-4 transition-all ">
                    <h1 className="flex items-center text-xl font-semibold md:text-2xl">
                        Task List{' '}
                        <LayoutDashboard className={'ml-2 h-5 w-5 md:ml-3 md:h-6 md:w-6'} />
                    </h1>
                    <Button
                        type={'button'}
                        variant={'secondary'}
                        text={`Add New Task`}
                        icon={<SquarePlus className={'h-4 w-4'} />}
                        onClick={() => navigate('/tasklist/new')}
                        className={'max-w-fit'}
                    />
                </div>
                <hr className={'border-accent'} />
                <div className={'mb-10 mt-4 flex flex-col items-center justify-center transition-all'}>
                    <Table
                        allTask={allTask}
                        setAllTask={setAllTask}

                        STATUS_FILTERS={STATUS_FILTERS}
                        activeStatusFilter={activeStatusFilter}
                        setActiveStatusFilter={setActiveStatusFilter}

                        SORT_FILTERS={SORT_FILTERS}
                        activeSortFilter={activeSortFilter}
                        setActiveSortFilter={setActiveSortFilter}

                        PRIORITY_FILTERS={PRIORITY_FILTERS}
                        activePriorityFilter={activePriorityFilter}
                        setActivePriorityFilter={setActivePriorityFilter}
                    />
                </div>
            </div>
        </motion.div>
    ) : (
        <LoLoadingSpinner />
    )
}
export default TaskList