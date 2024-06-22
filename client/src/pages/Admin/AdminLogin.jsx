import { useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';

const AdminLogin = () => {

    const { isAdmin } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const secretKey = useInputValidation('')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(adminLogin(secretKey.value))
    }

    useEffect(() => {
        dispatch(getAdmin())
    }, [dispatch])


    if (isAdmin) return (<Navigate to='/admin/dashboard' />)


    return (
        <>
            <Container component={'main'} maxWidth="xs"
                sx={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
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
                    <>
                        <Typography variant='h5'>Admin Panel</Typography>
                        <form onSubmit={submitHandler}>
                            <TextField value={secretKey.value} onChange={secretKey.changeHandler} required fullWidth label="Secret Key" margin='normal' type='password' variant='outlined' />
                            <Button type='submit' variant='contained' color='primary' sx={{ marginTop: '1rem' }} fullWidth>Login</Button>
                        </form>
                    </>
                </Paper>

            </Container>
        </>
    )
}

export default AdminLogin