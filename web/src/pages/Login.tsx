import { motion } from 'framer-motion';
import { WEB_NAME, type FetchResponseError } from '../utils/api';
import Button from '../ui/Button';
import { AuthSchema , AuthSchemaType} from '../app/auth/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { zodErrorToString } from '../utils/handleZodError';
import { fetchUserInfo, selectUser, userLogin } from '../app/auth/authSlice';
import { useNavigate } from 'react-router';
import { CircleAlert } from 'lucide-react'

const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectUser);
    const [credentials, setCredentials] = useState<AuthSchemaType>({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = AuthSchema.safeParse(credentials)
        if (isValid.success) {
            setLoading(true);
            try {
                await dispatch(userLogin(isValid.data)).unwrap();
                toast.success('Login successfully');
                await dispatch(fetchUserInfo()).unwrap();
                navigate('/dashboard');
            } catch (err) {
                const errorMessage =
                    (err as FetchResponseError).message ||
                    'An error occurred while signing in.';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        } else {
            const errorMessages = zodErrorToString(isValid.error)
            toast.error(`Validation errors: ${errorMessages}`);
        }
    };

    useEffect(() => {
        if (user.email) {
            return navigate('/dashboard')
        }
    }, [navigate, user])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <div className="flex h-screen items-center justify-center text-black">
                <div className="flex items-center justify-center">
                    <div className="w-96 overflow-hidden rounded-2xl border-y border-gray-200 sm:border sm:shadow-xl">
                        <div className="bg-whitish flex flex-col justify-center space-y-3 border-b border-gray-200 px-4 py-6 pt-8 sm:px-10">
                            <div className={''}>
                                <h3 className="text-xl font-semibold tracking-wide">
                                    {import.meta.env.VITE_ENV === 'development'
                                        ? 'Sign in to localhost'
                                        : 'Sign in to testimonial'}
                                </h3>
                                <p className="text-sm tracking-wide text-gray-500">
                                    to continue to {WEB_NAME}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-10">
                            <form onSubmit={handleSubmit} className='space-y-5'>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" name="email" required onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" name="password" required onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                                </div>
                                <Button
                                    type={'submit'}
                                    variant={'secondary'}
                                    text={'Login'}
                                    className='h-10 md:text-md'
                                    loading={loading}
                                />
                            </form>
                            <p className="flex items-center gap-x-1 text-xs text-slate-400">
                                <CircleAlert className={'h-4 w-4'} />
                                no registration required
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
export default Login