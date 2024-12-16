import { useEffect, useState } from "react"
import type { FetchResponseError } from "../../utils/api";
import { toast } from "sonner";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";
import { getRawData } from "../../app/task/taskSlice";
import LoLoadingSpinner from "../../ui/LoLoadingSpinner";
import { motion } from "framer-motion";

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch: AppDispatch = useDispatch();
    const [rawData,setRawData] = useState();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const data = await dispatch(getRawData()).unwrap();
                console.log(data)
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while fetching spaces';
                toast.error(errorMessage);
            }
        }
        fetchData().then(() => setLoading(false))
    }, [dispatch])

    return !loading ? (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className="mt-10 p-8 relative space-y-20 flex flex-col w-full h-full text-whitish bg-transparent border-2 border-accent overflow-hidden shadow-md rounded-xl bg-clip-border">
                <div className="space-y-5">
                    <h3 className="text-[2rem] font-semibold tracking-wide">Summary</h3>
                    <div className="flex space-x-14">
                        <div className="flex flex-col justify-start items-center ">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Total Tasks</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Tasks Completed</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Task Pending</p>
                        </div>
                        <div className="flex flex-col justify-center items-center w-28">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Average Time per completed task</p>
                        </div>

                    </div>
                </div>

                <div className="space-y-5">
                    <h3 className="text-[2rem] font-semibold tracking-wide">Pending task summary</h3>
                    <div className="flex space-x-14">
                        <div className="flex flex-col justify-start items-center ">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Pending Tasks</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Total time lapsed</p>
                        </div>
                        <div className="flex flex-col justify-start items-center">
                            <h1 className="font-bold text-[1.7rem] bg-gradient-to-br from-green-500 to-green-800 text-transparent bg-clip-text">25%</h1>
                            <p className="text-xs text-slate-400 text-center">Total time to finish</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    ) : (
        <LoLoadingSpinner />
    )
}
export default Dashboard