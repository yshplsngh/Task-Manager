import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = ({ message }: { message?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid min-h-[80vh] place-content-center px-4">
        <h1 className="tracking-widest text-slate-300">
          {message ? message : '404 | Page Not Found!'}
        </h1>

        <Link to={'/'}>
          <Button
            type={'button'}
            className="mt-3 text-slate-200"
            variant={'outlineB'}
            text={'Go Home Page 🏡'}
          />
        </Link>
        <p className="mt-2 text-center font-thin text-slate-200">Task Manager</p>
      </div>
    </motion.div>
  );
};
export default NotFound;
