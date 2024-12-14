import Button from './Button';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectStatusLoading } from '../app/auth/authSlice';
import LoadingSpinner from './LoadingSpinner';

function Header() {
  const user = useSelector(selectUser);
  const statusLoading = useSelector(selectStatusLoading);
  const location = useLocation();

  const dashboardBtn = (
    <Link to={`/dashboard`}>
      <Button type={'button'} variant={'outlineB'} text={'Dashboard'} />
    </Link>
  );

  const loginBtn = (
    <Link to="/login">
      <Button type={'button'} variant={'outlineB'} text={'Sign in'} />
    </Link>
  );

  return (
    <div
      className={
        'sticky top-0 z-50 mx-auto max-w-[100rem] items-center justify-between border-b-2 border-zinc-800 bg-zinc-900 bg-opacity-30 bg-clip-padding backdrop-blur-sm backdrop-filter transition-all md:px-10'
      }
    >
      <div className="flex items-center justify-between px-5 py-2 md:px-9 md:py-5">
        <div className="text-xl md:text-3xl">
          <Link to={'/'} className="flex items-center space-x-1">
            <span className="font-bold">Task</span>
          </Link>
        </div>

        {/*remove all buttons on feedback page*/}
        {!location.pathname.startsWith('/feedback/') && (
          <div className="flex items-center gap-x-2">
            {statusLoading ? (
              <LoadingSpinner />
            ) : !user.id ? (
              <>
              {/* show button when user is not login */}
                {loginBtn}
              </>
            ) : (
              <>
              {/* button when user is login */}
                {dashboardBtn}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
