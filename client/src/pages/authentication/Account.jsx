import { useFileHandler, useInputValidation } from '6pp';
import axios from 'axios';
import { default as React, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { activeColor, sideBarBgColor } from '../../constants/color';
import { server } from '../../constants/config';
import { userExits } from '../../redux/reducers/auth';
import { usernameValidator } from '../../utils/Validators';
import './account.css';
import { Avatar, IconButton, Stack } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';
import { VisuallyHiddenInput } from '../../components/styles/StyledComponents';
import Title from '../../components/shared/Title';

export default function account() {


    const dispatch = useDispatch()

    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    const name = useInputValidation('');
    const bio = useInputValidation('');
    const username = useInputValidation('', usernameValidator);
    const password = useInputValidation('');
    // const password = useStrongPassword();

    // console.log(name,username,bio,password)

    const avatar = useFileHandler('single')


    const toggleLogin = () => {
        setIsLogin((prev) => !prev)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const toastId = toast.loading('Logging in ...')
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            };

            const { data } = await axios.post(`${server}/api/user/login`, {
                username: username.value,
                password: password.value
            }, config)
            dispatch(userExits(data.user))
            toast.success(data.message, {
                id: toastId
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId
            });
        } finally {
            setIsLoading(false)
        }

        // console.log(username, password)

    }
    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const toastId = toast.loading('Creating your account...')


        const formData = new FormData();

        formData.append('avatar', avatar.file)
        formData.append('name', name.value)
        formData.append('bio', bio.value)
        formData.append('username', username.value)
        formData.append('password', password.value)

        const config = {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        };

        console.log(formData)
        console.log(name.value, username.value, bio.value, password.value)


        try {
            const { data } = await axios.post(`${server}/api/user/new`, formData, config)
            dispatch(userExits(data.user))
            toast.success(data.message, {
                id: toastId
            })
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId
            });
        } finally {
            setIsLoading(false)
        }

    }



    useEffect(() => {
        const signUpButton = document.getElementById('signUp');
        const signInButton = document.getElementById('signIn');
        const container = document.getElementById('container');

        const form1 = document.getElementById('signup_form');
        const form2 = document.getElementById('login_form');


        signUpButton.addEventListener('click', () => {
            container.classList.add('right-panel-active');
            if (screen.width < 1000) {
                form1.classList.add('changeHeight-signup');
                form2.classList.add('changeHeight-signup');
            }
            if (screen.width > 1000) {
                form1.classList.remove('changeHeight-signup');
                form2.classList.remove('changeHeight-signup');
            }
            console.log('Clicked signup')
        });
        signInButton.addEventListener('click', () => {
            container.classList.remove('right-panel-active');
            form1.classList.remove('changeHeight-signup');
            form2.classList.remove('changeHeight-signup');
        });
    }, []);

    return (
        <>
            <Title title='ZappiChat - Authentication' />
            <div className={`account`} id="account" style={{ backgroundColor: sideBarBgColor }}>
                <div className="container" id="container">
                    <div className="form-container sign-up-container">
                        {/* Create Account Form  */}
                        <form className=' max-lg:h-1/6' onSubmit={handleSignup} >
                            <Stack position={'relative'} width={'6rem'}  >
                                <Avatar
                                    sx={{
                                        width: '6rem',
                                        height: '6rem',
                                        objectFit: 'contain'
                                    }}
                                    src={avatar.preview} />
                                <IconButton sx={{ position: 'absolute', bottom: '0', right: '0', bgcolor: 'rgba(255,255,255,0.5)' }} component="label">
                                    <>
                                        <CameraAlt />
                                        <VisuallyHiddenInput type='file' name='avatar' onChange={avatar.changeHandler} ></VisuallyHiddenInput>
                                    </>
                                </IconButton>
                            </Stack>
                            <input value={name.value} onChange={name.changeHandler} type="text" placeholder="Name" name="name" autoComplete="off"  />
                            <input value={bio.value} onChange={bio.changeHandler} placeholder="Bio" type='text' name="bio" autoComplete="off"/>
                            <input value={username.value} onChange={username.changeHandler} type="text" placeholder="Username" name="username" autoComplete="off"/>
                            <input value={password.value} onChange={password.changeHandler} type="password" placeholder="Password" name="password" autoComplete="off"/>
                            <button type="submit" disabled={isLoading} style={{ backgroundColor: activeColor }}>Sign Up</button>
                        </form>
                    </div>
                    <div className="form-container sign-in-container">
                        <form onSubmit={handleLogin}>
                            <img className=' w-24' src='./assest/zapchat.png' alt="ZapppiChat"
                            />
                            {/* <h1>Sign in</h1> */}
                            <p>
                                Please login to get access ZappiChat Realtime chatting Application
                            </p>
                            <input value={username.value} onChange={username.changeHandler} type="text" placeholder="Username" autoComplete="off" />
                            <input value={password.value} onChange={password.changeHandler} type="password" placeholder="Password" name="password" autoComplete="off" />
                            <button type="submit"  disabled={isLoading} style={{ backgroundColor: activeColor }} >Login</button>
                        </form>
                    </div>
                    <div className="overlay-container" id="overlay-container" style={{ backgroundColor: activeColor }}>
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1>Already have an account?</h1>
                                <p>

                                </p>
                                <img style={{ width: '400px' }} src="./assest/login.png" alt="" />
                                <button className="ghost" id="signIn">
                                    Login
                                </button>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1 className=' text-xl' >Don't have an account? </h1>
                                <p>

                                </p>
                                <img style={{ width: '400px' }} src='./assest/signup.png' alt="" />
                                <button className="ghost" id="signUp">
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
