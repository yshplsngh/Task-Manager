import { useEffect, useState } from "react"
import type { FetchResponseError } from "../../utils/api";
import { toast } from "sonner";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getRawData } from "../../app/task/taskSlice";
import LoLoadingSpinner from "../../ui/LoLoadingSpinner";
import { motion } from "framer-motion";
import type { BRawDataType, StatsType } from "../../app/task/types";
import { TableData, TableHead } from "../tasklist/Table";

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const [rawData, setRawData] = useState<BRawDataType>();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await dispatch(getRawData()).unwrap();
                setRawData(data.json)
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while fetching spaces';
                toast.error(errorMessage);
            }
        }
        fetchData().then(() => setLoading(false))
    }, [dispatch])

    const calculateTime = (timeInMin: number) => {
        if (timeInMin === 0) return 0;
        const hours = Math.floor(timeInMin / 60);
        const minutes = timeInMin % 60;
        const hourStr = hours > 0 ? `${hours}h` : ''
        const minStr = minutes !== 0 ? `${minutes}m` : ''
        return `${hourStr} ${hourStr.length > 0 && minStr.length > 0 ? ' : ' : ''} ${minStr}`;
    }

    const tableHead = ['Task Priority', 'Pending Tasks', 'Task Time', 'Remaining Time']

    const getCellContent = (head: string, stats: StatsType) => {
        switch (head) {
            case 'Task Priority':
                return stats.priority
            case 'Pending Tasks':
                return stats.pendingTasks
            case 'Task Time':
                return calculateTime(stats.taskTimeInMin)
            case 'Remaining Time':
                return calculateTime(stats.remainingTimeInMin)
            default:
                return ''
        }
    }

    return !loading ? (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className="mt-1 px-8 py-4 relative space-y-12 flex flex-col w-full h-full text-whitish bg-transparent border-2 border-accent overflow-hidden shadow-md rounded-xl bg-clip-border">
                <div className="space-y-5">
                    <h3 className="text-[2rem] font-semibold tracking-wide">Summary</h3>
                    <div className="flex space-x-14">
                        <div className="flex flex-col justify-start items-center ">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData?.totalTask}</h1>
                            <p className="text-xs text-slate-400 text-center">Total Tasks</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData?.tasksCompleted}%</h1>
                            <p className="text-xs text-slate-400 text-center">Tasks Completed</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData?.tasksPending}%</h1>
                            <p className="text-xs text-slate-400 text-center">Task Pending</p>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData && calculateTime(rawData.averageTimePerTask)}</h1>
                            <p className="text-xs text-slate-400 text-center">Average Time per completed task</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <h3 className="text-[2rem] font-semibold tracking-wide">Pending task summary</h3>
                    <div className="flex space-x-14">
                        <div className="flex flex-col justify-start items-center ">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData?.pendingTasks}</h1>
                            <p className="text-xs text-slate-400 text-center">Pending Tasks</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData && calculateTime(rawData.totalTimeLapsed)}</h1>
                            <p className="text-xs text-slate-400 text-center">Total time lapsed</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">{rawData && calculateTime(rawData.totalTimeToFinish)}</h1>
                            <p className="text-xs text-slate-400 text-center">Total time to finish</p>
                        </div>
                    </div>
                </div>

                {rawData && rawData.pendingTasks > 0 && <div className="border-2 border-accent w-fit rounded-[1rem] overflow-hidden">
                    <table className="w-fit text-left table-auto min-w-max text-lg">
                        <thead className="bg-third-dark">
                            <tr className="text-center">
                                {tableHead.map((head, index) => <TableHead key={index} name={head} />)}
                            </tr>
                        </thead>
                        <tbody>
                            {rawData && Object.entries(rawData.tableData).map(([priority, stats]) => (
                                <tr key={priority} className="text-center">
                                    {tableHead.map((head) => (
                                        <TableData key={head} data={getCellContent(head, stats)} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>
        </motion.div>
    ) : (
        <LoLoadingSpinner />
    )
}
export default Dashboard