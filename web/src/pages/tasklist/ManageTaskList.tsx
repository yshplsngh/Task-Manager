import { useSteps } from "../../hooks/useSteps"
import CreateNewTask from "./CreateNewTask";
import TaskList from "./TaskList";

const ManageTaskList = () => {

    // hre update 
    const { step, startStep, nextStep } = useSteps(2);

    const steps = [
        <TaskList key={'taskList'} nextStep={nextStep} />,
        <CreateNewTask key={'createNewTask'} startStep={startStep} />
    ]

    return steps[step]
}
export default ManageTaskList