import { useFileHandler, useInputValidation } from '6pp';
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisuallyHiddenInput } from '../../components/styles/StyledComponents';
import { server } from '../../constants/config';
import { userExits } from '../../redux/reducers/auth';
import { usernameValidator } from '../../utils/Validators';
import Title from '../../components/shared/Title'

export default function Login() {

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

  return (
    <>
      <Container component={'main'} maxWidth="xs"
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }} >
          {
            isLogin ?
              // Login Section 

              <>
                <Title title='ZapCHat - Login' />

                <Typography variant='h5'>Login</Typography>
                <form onSubmit={handleLogin}>
                  <TextField value={username.value} onChange={username.changeHandler} fullWidth label="username" margin='normal' variant='outlined' />
                  <TextField value={password.value} onChange={password.changeHandler} fullWidth label="Password" margin='normal' type='password' variant='outlined' />
                  <Button type='submit' variant='contained' color='primary' sx={{ marginTop: '1rem' }} disabled={isLoading} fullWidth>Login</Button>
                  <Typography textAlign={'center'} m={'1rem'}>Don't have an account?</Typography>

                  <Button variant='text' onClick={toggleLogin} disabled={isLoading} fullWidth>Sign up</Button>
                </form>
              </>
              //
              :
              // Registeration Section 
              <>
                <Title title='ZapCHat - Create Account' />

                <Typography variant='h5'>Register</Typography>
                <form style={{ width: '100%', marginTop: '1rem' }} onSubmit={handleSignup}>
                  <Stack position={'relative'} width={'10rem'} margin={'auto'} >
                    <Avatar
                      sx={{
                        width: '10rem',
                        height: '10rem',
                        objectFit: 'contain'
                      }}
                      src={avatar.preview} />
                    <IconButton sx={{ position: 'absolute', bottom: '0', right: '0', bgcolor: 'rgba(255,255,255,0.5)' }} component="label">
                      <>
                        <CameraAltIcon />
                        <VisuallyHiddenInput type='file' name='avatar' onChange={avatar.changeHandler} ></VisuallyHiddenInput>
                      </>
                    </IconButton>
                  </Stack>
                  {
                    avatar.error && (
                      <Typography margin={'1rem'} width={'fit-content'} display={'block'} color='error' variant='caption'>
                        {avatar.error}
                      </Typography>
                    )
                  }
                  <TextField value={name.value} onChange={name.changeHandler} name='name' required fullWidth label="Name" margin='normal' variant='outlined' />
                  <TextField value={username.value} onChange={username.changeHandler} required fullWidth label="Username" margin='normal' variant='outlined' />
                  {
                    username.error && (
                      <Typography color='error' variant='caption'>
                        {username.error}
                      </Typography>
                    )
                  }
                  <TextField value={bio.value} onChange={bio.changeHandler} required fullWidth label="Bio" margin='normal' variant='outlined' />
                  <TextField value={password.value} onChange={password.changeHandler} required fullWidth label="Password" margin='normal' type='password' variant='outlined' />
                  {/* {
                            password.error && (
                              <Typography color='error' variant='caption'>
                                    {password.error}
                              </Typography>
                            )
                          } */}
                  <Button type='submit' variant='contained' color='primary' sx={{ marginTop: '1rem' }} disabled={isLoading} fullWidth>Sign Up</Button>
                  <Typography textAlign={'center'} m={'1rem'}>Already have an account?</Typography>

                  <Button variant='text' onClick={toggleLogin} disabled={isLoading} fullWidth>Login</Button>
                </form>
              </>
          }
        </Paper>

      </Container>
    </>
  )
}
