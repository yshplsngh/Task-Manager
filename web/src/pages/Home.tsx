import { useSelector } from "react-redux";
import { selectUser } from "../app/auth/authSlice";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import GithubLogo from "../ui/GithubLogo";
import AnimatedGradientText from "../ui/AnimatedGradientText";
import { ChevronRight } from "lucide-react";
import { cn } from "../utils/util";

const Home = () => {
  const user = useSelector(selectUser)
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <div
        className={`h-full ${user?.email && "mt-0"
          } md:max-w-4xl w-[80vw] text-center items-center flex flex-col z-20 `}
      >
        <AnimatedGradientText>
          🚀 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-400" />{' '}
          <span
            className={cn(
              `animate-gradient inline bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
            )}
          >
            Introducing Task Manager
          </span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>

        <div className="mt-10 md:text-6xl text-3xl  font-semibold">
          <span className="bg-gradient-to-br from-gray-100 to-gray-300 text-transparent bg-clip-text">
            Organize
          </span>
          <span className=" md:text-6xl text-3xl  font-semibold bg-gradient-to-br from-green-500 to-green-800 h-fit text-transparent bg-clip-text  ml-2">
            Better!
          </span>
        </div>
        <div className="bg-gradient-to-br from-gray-100 to-gray-300 text-transparent  md:text-6xl text-3xl  font-semibold  bg-clip-text py-2">
          Manage Tasks with Flow!
        </div>
        <p className="mt-3 md:text-[1.1rem] text-sm  text-gray-300">
          Simplify your workflow with a task management app that helps you organize, track, and prioritize with ease.
        </p>
        {user?.email ? (
          <div className="mt-10">
            <Link
              to={'https://github.com/yshplsngh/reunion'}
              target={'_blank'}
            >
              <Button
                type={'button'}
                variant={'secondary'}
                text={'Github'}
                icon={<GithubLogo />}
              />
            </Link>
          </div>
        ) : (
          <div className="mt-10">
            <Link to="/login">
              <Button type={'button'} variant={'outlineB'} text={'Get Started'} className="border-green-400 border text-white bg-gradient-to-br from-green-500 to-green-800  px-3 py-1 rounded-md w-fit mx-auto" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
