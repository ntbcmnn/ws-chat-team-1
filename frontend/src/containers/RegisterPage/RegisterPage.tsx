import React, {useState} from 'react';
import {RegisterMutation} from '../../types';
import {useAppDispatch, useAppSelector} from '../../app/hooks.ts';
import {selectRegisterError, selectRegisterLoading} from '../../store/slices/usersSlice.ts';
import {NavLink, useNavigate} from 'react-router-dom';
import {googleLogin, register} from '../../store/thunks/usersThunk.ts';
import Loader from '../../components/UI/Loader/Loader.tsx';
import {GoogleLogin} from '@react-oauth/google';
import FileInput from '../../components/UI/FileInput/FileInput.tsx';

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const registerError = useAppSelector(selectRegisterError);
    const isLoading = useAppSelector(selectRegisterLoading);
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterMutation>({
        username: '',
        password: '',
        avatar: null,
        displayName: '',
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prevState => ({...prevState, [name]: value}));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(register(form)).unwrap();
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    };

    const getFieldError = (fieldName: string) => {
        try {
            return registerError?.errors[fieldName].message;
        } catch {
            return undefined;
        }
    };

    const googleLoginHandler = async (credential: string) => {
        await dispatch(googleLogin(credential)).unwrap();
        navigate('/');
    };

    const onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const {name, files} = e.target;

        if (files) {
            setForm((prevState: RegisterMutation) => ({
                ...prevState,
                [name]: files[0] || null,
            }));
        }
    };

    return (
        <>
            {isLoading ? <Loader/> :
                <div className="container mt-5 bg-primary-subtle rounded-3 p-4 rounded-3" style={{maxWidth: '400px'}}>
                    <div className="text-center mb-4">
                        <h2 className="mt-2">Sign Up</h2>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="mb-3 d-flex flex-column align-items-center">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        void googleLoginHandler(credentialResponse.credential);
                                    }
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            >
                            </GoogleLogin>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={form.username}
                                onChange={onChange}
                                className={`form-control ${getFieldError('username') ? 'is-invalid' : ''}`}
                            />
                            {getFieldError('username') && (
                                <div className="invalid-feedback">{getFieldError('username')}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="displayName" className="form-label">The name you'll see in your
                                profile</label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={form.displayName}
                                onChange={onChange}
                                className={`form-control ${getFieldError('displayName') ? 'is-invalid' : ''}`}
                            />
                            {getFieldError('displayName') && (
                                <div className="invalid-feedback">{getFieldError('displayName')}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={onChange}
                                className={`form-control ${getFieldError('password') ? 'is-invalid' : ''}`}
                            />
                            {getFieldError('password') && (
                                <div className="invalid-feedback">{getFieldError('password')}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <FileInput
                                id="avatar"
                                name="avatar"
                                label="Avatar"
                                onGetFile={onFileChange}
                                file={form.avatar}
                                className="form-control"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Sign Up
                        </button>

                        <div className="text-center mt-3">
                            <NavLink to="/login" className="text-decoration-none">Already have an account? Sign
                                in</NavLink>
                        </div>
                    </form>
                </div>
            }
        </>
    );
};

export default RegisterPage;
