import { motion } from "framer-motion";
import { LayoutDashboard, SquarePlus } from "lucide-react";
import Button from "../../ui/Button";
import Table from "./compoenent/Table.";

const TaskList = ({ nextStep }: { nextStep: () => void }) => {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={'relative'}
        >
            <div className="w-full">
                <div className="flex flex-row items-center justify-between px-3 py-4 transition-all md:px-5 md:py-6">
                    <h1 className="flex items-center text-xl font-semibold md:text-2xl">
                        Dashboard{' '}
                        <LayoutDashboard className={'ml-2 h-5 w-5 md:ml-3 md:h-6 md:w-6'} />
                    </h1>
                    <Button
                        type={'button'}
                        variant={'secondary'}
                        text={`Add New Task`}
                        icon={<SquarePlus className={'h-4 w-4'} />}
                        onClick={() => nextStep()}
                        className={'max-w-fit'}
                    />
                </div>
                <hr className={'border-accent'} />
                <div className={'mt-10 flex flex-col items-center justify-center transition-all'}>
                    <Table/>
                </div>
            </div>
        </motion.div>
    )
}
export default TaskList