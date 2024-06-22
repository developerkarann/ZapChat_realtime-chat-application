import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationIcon, Dialpad } from '@mui/icons-material'
import { orange } from '../../constants/color'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { userNotExits } from '../../redux/reducers/auth'
import { setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
import { resetNotification } from '../../redux/reducers/chat'


const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationDialog = lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroupDialog'))

const Header = () => {


    const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc)
    const { notificationCount } = useSelector((state) => state.chat)
    const naviate = useNavigate()
    const dispatch = useDispatch()


    const handleMobile = () => {
        // console.log("Handle mobile clicked")
        dispatch(setIsMobileMenu(true))
    }
    const openSearh = () => {
        // console.log("openSearhcDialog mobile clicked")
        dispatch(setIsSearch(true))
    }
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    }
    const navigateToGroup = () => {
        naviate('/groups')
    }
    const logoutHandler = () => {

        console.log('Logout clicked')
        try {
            const { data } = axios.get(`${server}/api/user/logout`, { withCredentials: true })
            toast.success('logged out successfully')
            dispatch(userNotExits())

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    }
    const openNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotification())
    }
    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={'4rem'} >
                <AppBar position='static' sx={{ bgcolor: orange }}>

                    <Toolbar>
                        <Typography variant='h6' sx={{ display: { xs: 'none', sm: 'block' } }}>Chat App</Typography>

                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />
                        <Box>

                            <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearh} />

                            <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup} />

                            <IconBtn title={"Manage Group"} icon={<GroupIcon />} onClick={navigateToGroup} />

                            <IconBtn title={"Notifications"} icon={<NotificationIcon />} value={notificationCount} onClick={openNotification} />

                            <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler} />


                        </Box>

                    </Toolbar>

                </AppBar>
            </Box>

            {
                isSearch && (
                    <Suspense fallback={<Backdrop open />}>
                        <SearchDialog />
                    </Suspense>
                )
            }
            {
                isNotification && (
                    <Suspense fallback={<Backdrop open />}>
                        <NotificationDialog />
                    </Suspense>
                )
            }
            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open />}>
                        <NewGroupDialog />
                    </Suspense>
                )
            }
        </>
    )
}

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {value ? <Badge badgeContent={value} color='error' > {icon} </Badge> : icon}
            </IconButton>
        </Tooltip>
    )

}

export default Header