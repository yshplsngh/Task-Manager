import { motion } from "framer-motion"
import { Input } from "../../ui/Input"
import { Label } from "../../ui/Label"
import Button from "../../ui/Button"
import { useCallback, useState } from "react"
import { TaskSchema, type TaskSchemaType } from "../../app/task/types"
import { zodErrorToString } from "../../utils/handleZodError"
import { toast } from "sonner"
import Toggle from "../../ui/Toggle"
import { SquarePlus } from "lucide-react"
import DateTime from "../../ui/DateTime"
import type { Dayjs } from "dayjs"
import type { FetchResponseError } from "../../utils/api"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../app/store"
import { createNewTask } from "../../app/task/taskSlice"
import { useNavigate } from "react-router"

const CreateNewTask = () => {
    const dispatch: AppDispatch = useDispatch()
    const [task, setTask] = useState<TaskSchemaType>({ title: '', priority: 1, taskStatus: 'PENDING', startTime: '', endTime: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = TaskSchema.safeParse(task)
        if (isValid.success) {
            setLoading(true);
            try {
                await dispatch(createNewTask(isValid.data)).unwrap();
                toast.success('New task Added');
                navigate('/tasklist')
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while creating task';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            const errorMessages = zodErrorToString(isValid.error)
            toast.error(`Validation errors: ${errorMessages}`);
        }
    };

    const handleDateTimeChange = useCallback((startDateTime: Dayjs | null, endDateTime: Dayjs | null) => {
        if (startDateTime && endDateTime) {
            setTask(prev => ({
                ...prev,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString()
            }));
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className="flex mt-20 items-center justify-center text-black">
                <div className="flex items-center justify-center">
                    <div className="w-[30rem] overflow-hidden rounded-2xl border-y border-gray-200 sm:border sm:shadow-xl">
                        <div className="bg-whitish flex flex-col justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 sm:px-10">
                            <div className={''}>
                                <h3 className="text-xl font-semibold tracking-wide">
                                    Add New Task
                                </h3>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-10">
                            <form onSubmit={handleSubmit} className='space-y-5'>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" type="text" name="title" value={task.title} required onChange={(e) => setTask({ ...task, title: e.target.value })} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="w-1/3 space-y-2">
                                        <Label htmlFor="priority">Priority</Label>
                                        <Input id="priority" type="number" name="priority" min={1} max={5} value={task.priority} required onChange={(e) => setTask({ ...task, priority: +e.target.value })} />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="switch-component-on">Status</Label>
                                        <Toggle checked={task.taskStatus === "FINISHED" ? true : false} onChange={() => setTask({ ...task, taskStatus: task.taskStatus === 'PENDING' ? 'FINISHED' : 'PENDING' })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <DateTime onDateTimeChange={handleDateTimeChange} />
                                </div>
                                <div className="flex space-x-3 pt-5">
                                    <Button
                                        type={'button'}
                                        variant={'secondary'}
                                        text={'cancel'}
                                        className='h-10'
                                        onClick={() => navigate('/tasklist')}
                                    />
                                    <Button
                                        type={'submit'}
                                        variant={'secondary'}
                                        text={'Add Task'}
                                        className='h-10'
                                        icon={<SquarePlus className={'h-4 w-4'} />}
                                        loading={loading}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CreateNewTask