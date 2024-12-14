import { selectUser, selectStatusLoading } from '../app/auth/authSlice';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import LoLoadingSpinner from '../ui/LoLoadingSpinner';

const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const statusLoading = useSelector(selectStatusLoading);

  if (statusLoading) {
    return <LoLoadingSpinner />;
  } else {
    if (user.id) {
      return <Outlet />;
    }
  }
  return <Navigate to="/login" replace />;
};
export default ProtectedRoute;
