import { useSteps } from "../../hooks/useSteps"
import CreateNewTask from "./CreateNewTask";
import EditTask from "./EditTask";
import TaskList from "./TaskList";

const ManageTaskList = () => {

    // here update the useSteps parameter acc to steps length - 1
    const { step, reachStep } = useSteps(2);

    const steps = [
        <TaskList key={'taskList'} reachStep={reachStep} />,
        <CreateNewTask key={'createNewTask'} reachStep={reachStep} />,
        <EditTask key={'editTask'} />
    ]

    return steps[step]
}
export default ManageTaskList