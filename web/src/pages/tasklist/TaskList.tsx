import { motion } from "framer-motion";
import { LayoutDashboard, SquarePlus } from "lucide-react";
import Button from "../../ui/Button";
import Table from "./Table";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import LoLoadingSpinner from "../../ui/LoLoadingSpinner";
import type { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { getTask, selectTaskIds } from "../../app/task/taskSlice";
import type { FetchResponseError } from "../../utils/api";
import { toast } from "sonner";

const TaskList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const taskIds = useSelector(selectTaskIds)
    
    useEffect(() => {
        async function fetchTask() {
            setLoading(true);
            try {
                await dispatch(getTask()).unwrap();
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while fetching spaces';
                toast.error(errorMessage);
            }
        }
        fetchTask().then(() => setLoading(false))
    }, [dispatch,taskIds])


    return !loading ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={'relative'}
        >
            <div className="w-full">
                <div className="flex flex-row items-center justify-between px-3 py-4 transition-all md:px-5 md:py-6">
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
                <div className={'mt-10 flex flex-col items-center justify-center transition-all'}>
                    {taskIds && taskIds.length>0 ? (
                        <Table />
                    ) :
                        (
                            <div className="w-fit space-y-3">
                                <div className="w-full text-center">No Tasks found !</div>
                                <Button
                                    type={'button'}
                                    variant={'secondary'}
                                    text={`Add New Task`}
                                    icon={<SquarePlus className={'h-4 w-4'} />}
                                    onClick={() => navigate('/tasklist/new')}
                                    className={'max-w-fit'}
                                />
                            </div>
                        )}
                </div>
            </div>
        </motion.div>
    ) : (
        <LoLoadingSpinner />
    )
}
export default TaskList