import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Groups as GroupsIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon
} from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { grayColor, mateBlack } from '../../constants/color'
import { adminLogout } from '../../redux/thunks/admin'
import { Link } from '../styles/StyledComponents'


const Sidebar = ({ w = '100%' }) => {
    const location = useLocation()
    const dispatch =  useDispatch()
    

    const adminTabs = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: <DashboardIcon />
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: <ManageAccountsIcon />
        },
        {
            name: 'Chats',
            path: '/admin/chats',
            icon: <GroupsIcon />
        },
        {
            name: 'Messages',
            path: '/admin/messages',
            icon: <MessageIcon />
        },
    ]

    const logoutHandler = () => {
        console.log("Logged out successfully")
        dispatch(adminLogout())
    }

   

    return (
        <>
            <Stack direction={'column'} p={'3rem'} spacing={'3rem'} width={w}>
                <Typography variant='h4' textTransform={'uppercase'}> Admin </Typography>

                <Stack spacing={'1rem'}>
                    {
                        adminTabs.map((tab) => (
                            <Link key={tab.path} to={tab.path} sx={
                                location.pathname === tab.path && { bgcolor: mateBlack, color: 'white', ":hover": { bgcolor: mateBlack } }
                            } >
                                <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
                                    {tab.icon}
                                    <Typography>{tab.name}</Typography>
                                </Stack>
                            </Link>
                        ))
                    }

                    <Link onClick={logoutHandler}>
                        <Stack direction={'row'} alignItems={'center'} spacing={'1rem'}>
                            <ExitToAppIcon />
                            <Typography>Logout</Typography>
                        </Stack>
                    </Link>
                </Stack>
            </Stack>
        </>
    )
}

const AdminLayout = ({ children }) => {

    const { isAdmin } = useSelector((state) => state.auth)

    const [isMobile, setIsMobile] = useState(false)

    const handleMobile = () => {
        setIsMobile(!isMobile)
    }

    const handleClose = () => {
        setIsMobile(false)
    }


    if(!isAdmin) return <Navigate to='/admin' />

    return (
        <>
            <Grid container minHeight={'100vh'}>

                <Box sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', right: '1rem', top: '1rem' }}>
                    <IconButton onClick={handleMobile}>
                        {
                            isMobile ? <CloseIcon /> : <MenuIcon />
                        }
                    </IconButton>
                </Box>

                <Grid item md={4} lg={3} sx={{ display: { xs: 'none', md: 'block' } }} >
                    <Sidebar />
                </Grid>

                <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: grayColor }}>
                    {children}
                </Grid>

                <Drawer open={isMobile} onClick={handleClose}>
                    <Sidebar w='50vw' />
                </Drawer>

            </Grid>
        </>
    )
}

export default AdminLayout