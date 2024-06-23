import { faBars, faBell, faMagnifyingGlass, faPlus, faSignOutAlt, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { activeColor, sideBarBgColor } from '../../constants/color';
import { setIsMobileMenu, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import NewGroupDialog from '../specific/NewGroupDialog';
import NotificationsDialog from '../specific/Notifications';
import SearchDialog from '../specific/Search';
import { server } from '../../constants/config';
import { userNotExits } from '../../redux/reducers/auth'

const SideBar = ({ user }) => {

    const { isSearch, isNotification, isNewGroup, isOpenSidebar } = useSelector((state) => state.misc)
    const { notificationCount } = useSelector((state) => state.chat)
    const naviate = useNavigate()
    const dispatch = useDispatch()

    const [isExpanded, setIsExpanded] = useState(false);

    const handleMobile = () => {
        dispatch(setIsMobileMenu(true))
    }
    const openSearh = () => {
        dispatch(setIsSearch(true))
    }
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    }
    const navigateToGroup = () => {
        naviate('/groups')
    }
    const logoutHandler = async () => {

        console.log('Logout clicked')
        try {
            const { data } = await axios.get(`${server}/api/user/logout`, { withCredentials: true })
            toast.success('logged out successfully')
            dispatch(userNotExits())

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
            console.log(error)
        }
    }

    const openNotificationDialog = () => {
        dispatch(setIsNotification(true))
    }

    useEffect(() => {
        if (isOpenSidebar) {
            setIsExpanded(true)
        }
    }, [isOpenSidebar])


    return (
        <>
            <div className={` sidebarContainer flex flex-col ${isExpanded ? isOpenSidebar ? 'w-full' : 'w-48' : 'w-12'} 
             h-screen ${isOpenSidebar ? 'max-md:absolute' : 'max-md:hidden'} z-20 text-white transition-all duration-300`}
                style={{ backgroundColor: activeColor, }} >

                <div className="flex items-center ml-3 py-4 text-xl max-md:hidden" >
                    {/* <img src="./assest/zapchat.png" alt="" /> */}
                    <FontAwesomeIcon icon={faBars} className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} />
                </div>


                <div className={`flex flex-col flex-1 ${isExpanded ? " " : 'py-4'} px-1 space-y-4  text-xl ${isExpanded ? 'space-y-4' : 'space-y-10'}`}>
                    {
                        isExpanded &&
                        <>
                            <div className="flex items-center flex-col  p-4 " style={{ backgroundColor: activeColor }} >
                                <img src={user?.avatar.url} alt="User profile" className="w-12 h-12 rounded-full mr-4  " />
                                <h1 className="text-xl font-bold">{user?.name}</h1>
                                <p className=" text-xs text-slate-200">{user?.username}</p>
                            </div>

                            <div className="flex flex-col px-2 " style={{ backgroundColor: activeColor }} >
                                <p className="text-sm">{isOpenSidebar ? user?.bio : user?.bio.slice(0, 20)}...</p>
                            </div>

                            <hr />

                        </>

                    }

                    <div className="flex shadow-md items-center space-x-2 cursor-pointer hover:bg-sky-600 p-2 rounded"
                        onClick={openNotificationDialog}>
                        <FontAwesomeIcon icon={faBell} />
                        <p className='text-lg'>
                            {isExpanded && <span>Notifications</span>}
                        </p>
                    </div>


                    <div className="flex shadow-md items-center space-x-2 cursor-pointer hover:bg-sky-600 p-2 rounded"
                        onClick={openSearh}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <p className='text-lg'>
                            {isExpanded && <span>Add Friend</span>}
                        </p>
                    </div>

                    <div className="flex shadow-md items-center space-x-2 cursor-pointer hover:bg-sky-600 p-2 rounded"
                        onClick={navigateToGroup}>
                        <FontAwesomeIcon icon={faUserGroup} />
                        <p className='text-lg'>
                            {isExpanded && <span>My Groups</span>}
                        </p>
                    </div>

                    <div className="flex shadow-md items-center space-x-2 cursor-pointer hover:bg-sky-600 p-2 rounded"
                        onClick={openNewGroup}>
                        <FontAwesomeIcon icon={faPlus} />
                        <p className='text-lg'>
                            {isExpanded && <span>Create Group</span>}
                        </p>
                    </div>

                    <hr />

                    <div className="flex shadow-md items-center space-x-2 cursor-pointer hover:bg-sky-600 p-2 rounded"
                        onClick={logoutHandler}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <p className=' text-lg'>
                            {isExpanded && <span>Logout</span>}
                        </p>
                    </div>

                </div>
            </div>

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
                        <NotificationsDialog />
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

export default SideBar