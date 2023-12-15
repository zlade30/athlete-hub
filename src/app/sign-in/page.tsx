'use client';

import * as yup from 'yup';
import { Input } from '@/components/shared/textfields';
import { BasketballIcon, ChessIcon, VolleyballIcon } from '@/public/icons';
import { useFormik } from 'formik';
import { Button } from '@/components/shared/buttons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/firebase';
import { SpinnerDialog } from '@/components/shared/dialogs';
import { useDispatch } from 'react-redux';
import { setShowSpinnerDialog } from '@/redux/reducers/app';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');

    const schema = yup.object().shape({
        email: yup.string().required('* required field'),
        password: yup.string().required('* required field')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: schema,
        onSubmit: async (values: SignProps) => {
            try {
                dispatch(setShowSpinnerDialog({ open: true, content: 'Signing in...' }));
                const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
                localStorage.setItem('id', userCredential.user.uid);
                localStorage.setItem('user', JSON.stringify(userCredential.user));
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                router.push('/players');
            } catch (error: any) {
                dispatch(setShowSpinnerDialog({ open: false, content: '' }));
                switch (error.code) {
                    case 'auth/invalid-email':
                        setError('Invalid email address');
                        break;
                    case 'auth/user-disabled':
                        setError('User account is disabled');
                        break;
                    case 'auth/user-not-found':
                        setError('User not found');
                        break;
                    case 'auth/invalid-login-credentials':
                        setError('Invalid login credentials');
                        break;
                    case 'auth/wrong-password':
                        setError('Incorrect password');
                        break;
                    default:
                        setError('An unknown error occurred');
                        break;
                }
            }
        }
    });

    const loginAsGuest = () => {
        localStorage.setItem('id', 'guest');
        localStorage.setItem('user', JSON.stringify({ email: 'Guest' }));
        router.push('/highlights');
    };

    useEffect(() => {
        const id = localStorage.getItem('id');
        if (id) router.push('/players');
    }, []);

    return (
        <div className="w-[600px] h-[800px] bg-white rounded-[8px] flex flex-col items-center justify-center p-[40px] gap-[40px]">
            <SpinnerDialog />
            <h1 className="text-[35px] font-extrabold">Athlete Hub</h1>
            <div className="flex items-center gap-[30px]">
                <BasketballIcon className="w-[30px] h-[30px]" />
                <VolleyballIcon className="w-[30px] h-[30px]" />
                <ChessIcon className="w-[30px] h-[30px]" />
            </div>
            <p className="w-[400px] text-[14px] font-light text-justify leading-7 tracking-[0.5px]">
                <span className="font-medium">Athlete Hub</span> is the premier web app designed exclusively for the
                Manolo Fortich area, catering to the diverse needs of athletes, sports fans, and fitness enthusiasts
                alike. Whether you&apos;re a dedicated athlete, a casual sports enthusiast, or simply looking for
                information on local sporting events and facilities
            </p>
            {error && <p className="text-error text-[14px]">{`Error: ${error}`}</p>}
            <form className="w-[400px] flex flex-col gap-[20px]" onSubmit={formik.handleSubmit}>
                <Input
                    containerClassName="w-full flex flex-col gap-[4px]"
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    className="normal-case"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.errors.email}
                />
                <Input
                    containerClassName="w-full flex flex-col gap-[4px]"
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    className="normal-case"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.errors.password}
                />
                <Button value="Login" />
            </form>
            <p onClick={loginAsGuest} className="text-primary cursor-pointer hover:underline">
                Login as Guest
            </p>
        </div>
    );
};

export default SignInPage;
