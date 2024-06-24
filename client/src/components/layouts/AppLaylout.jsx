import { Drawer, Grid, Skeleton } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import { useErrors, useSocket, useSocketEvents } from '../../hooks/hook'
import { getOrSaveFromLocalStorage } from '../../lib/features'
import { useMyChatsQuery } from '../../redux/api/api'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { setIsDeleteMenu, setIsMobileMenu, setSelectedDeleteChat } from '../../redux/reducers/misc'
import DeleteChatMenuDialog from '../dialogs/DeleteChatMenuDialog'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import SideBar from './SideBar'



const AppLaylout = () => (WrappedComponent) => {

    return (props) => {
        const dispatch = useDispatch()
        const { isMobileMenu } = useSelector((state) => state.misc)
        const { user } = useSelector((state) => state.auth)

        // console.log(user)

        const { newMessagesAlert } = useSelector((state) => state.chat)

        const param = useParams()
        const chatId = param.chatId;
        const navigate = useNavigate()
        const location = useLocation()

        const deleteMenuAnchor = useRef(null)

        const [socket] = useSocket()

        const [onlineUsers, setOnlineUsers] = useState([])


        const { isLoading, data, isError, error, refetch } = useMyChatsQuery('')
        useErrors([{ isError, error }])


        const handleChatDelete = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true))
            dispatch(setSelectedDeleteChat({ chatId, groupChat }))
            deleteMenuAnchor.current = e.currentTarget;
        }

        const handleMobileClose = () => {
            dispatch(setIsMobileMenu(false))
        }

        const newMessageAlertHandler = useCallback((data) => {
            if (data.chatId === chatId) {
                return;
            }
            dispatch(setNewMessagesAlert(data))
        }, [chatId])
        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification());
        }, [dispatch])


        const refetchListner = useCallback(() => {
            refetch()
            navigate('/')
        }, [refetch])

        const onlineUsersListner = useCallback((data) => {
            setOnlineUsers(data)
        }, [])

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
            [REFETCH_CHATS]: refetchListner,
            [ONLINE_USERS]: onlineUsersListner
        }

        useSocketEvents(socket, eventHandlers)

        useEffect(() => {
            getOrSaveFromLocalStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert })
            refetch()
        }, [newMessagesAlert])


        return (
            <>
                <Title title='ZappiChat - Home' />
                {/* <Header /> */}
                <DeleteChatMenuDialog dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor.current} />
                {
                    isLoading ? <Skeleton /> :
                        <Drawer open={isMobileMenu} onClose={handleMobileClose}>

                        </Drawer>
                }

                <div className="homeSection flex ">
                    <div className="sidebarSection">
                        <SideBar user={user} />

                    </div>
                    <div className={`chatListSection max-md:w-screen ${location.pathname === '/' ? 'block' : 'max-md:hidden'} `}>
                        <ChatList chats={data?.chats} user={user} chatId={chatId} newMessagesAlert={newMessagesAlert}
                            onlineUsers={onlineUsers}
                            handleChatDelete={handleChatDelete}
                        />
                    </div>

                    <div className={`chatComponentSection w-full h-screen ${location.pathname === '/' ? 'max-md:hidden' : 'block'}`} style={{ height: '100vh' }} >
                        <WrappedComponent {...props} chats={data?.chats} chatId={chatId} user={user} onlineUsers={onlineUsers} />
                    </div>
                </div>
            </>
        )
    }
}

export default AppLaylout