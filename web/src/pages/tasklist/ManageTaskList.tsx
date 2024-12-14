import { useSteps } from "../../hooks/useSteps"
import CreateNewTask from "./CreateNewTask";
import TaskList from "./TaskList";

const ManageTaskList = () => {
    const { step, startStep, nextStep, prevStep } = useSteps();

    const steps = [
        <TaskList key={'taskList'} nextStep={nextStep} />,
        <CreateNewTask key={'createNewTask'} prevStep={prevStep} startStep={startStep} />
    ]

    return steps[step]
}
export default ManageTaskList