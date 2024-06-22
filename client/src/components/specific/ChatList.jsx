import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { SideBgColor1, activeColor } from '../../constants/color';
import { setIsOpenSidebar, setIsSearch } from '../../redux/reducers/misc';
import ChatItem from '../shared/ChatItem';

const ChatList = ({ w = '100%',
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [{
        chatId: '',
        count: 0
    }],
    handleChatDelete,
    user
}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch()

    const { isOpenSidebar } = useSelector((state) => state.misc)

    const filteredChatItems = chats?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGroupItems = chats?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openSidebardHandler = () => {
        dispatch(setIsOpenSidebar(true))
    }
    const closeSidebardHandler = () => {
        dispatch(setIsOpenSidebar(false))
    }

    const openSearh = () => {
        dispatch(setIsSearch(true))
    }

    return (
        <>

            <div className={`flex flex-col  w-72  h-screen text-white transition-all duration-300 max-md:w-full`} style={{ backgroundColor: SideBgColor1, borderRight: '#eeeeee' }} >
                <div className="flex items-center p-2 justify-between shadow-md" style={{ backgroundColor: activeColor, borderRadius: '0px 0px 8px 0px' }} >
                    <div className="flex items-center ">
                        <img src={user && user?.avatar.url} alt="User profile" className="w-12 h-12 rounded-full mr-4 " />
                        <h1 className="text-xl font-bold">{user && user?.name}</h1>
                    </div>

                    {
                        isOpenSidebar ? <>
                            <div className="relative max-md:block hidden z-50 ">
                                <button className="text-white" onClick={closeSidebardHandler}>
                                    <FaEllipsisV size={24} />
                                </button>
                            </div>
                        </> : <>
                            <div className="relative max-md:block hidden z-50 ">
                                <button className="text-white" onClick={openSidebardHandler}>
                                    <FaEllipsisV size={24} />
                                </button>
                            </div>
                        </>
                    }
                </div>

                <div className="p-3 px-4 ">
                    <div className="flex items-center p-2 rounded shadow-md " style={{ backgroundColor: 'white' }}>
                        <FontAwesomeIcon icon={faSearch} className="mr-2 text-gray-500" />

                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=" bg-transparent border-none outline-none text-gray-500 placeholder-gray-500 w-full"
                        />

                    </div>
                </div>
                <div className="flex-1 overflow-y-auto ">
                    {
                        filteredChatItems.length === 0 ? <> 
                            <div className="flex flex-col items-center justify-center text-center h-full">
                                <h1 className=' mb-5 text-lg text-slate-800 '>Please add some friends</h1>
                                 <img onClick={openSearh} className=' hover:cursor-pointer' src="./assest/add_friend2.png" alt="" />
                            </div>
                              
                        </> :
                            filteredChatItems?.map((data, index) => {
                                const { avatar, _id, name, groupChat, members } = data
                                const newMessageAlert = newMessagesAlert.find(
                                    ({ chatId }) => chatId === _id
                                )
                                const isOnline = members?.some((member) => onlineUsers.includes(member));

                                return (
                                    <ChatItem
                                        index={index}
                                        newMessageAlert={newMessageAlert}
                                        isOnline={isOnline}
                                        avatar={avatar}
                                        name={name}
                                        _id={_id}
                                        key={_id}
                                        groupChat={groupChat}
                                        sameSender={chatId === _id}
                                        handleDeleteChatOpen={handleChatDelete}
                                        chatId={chatId}
                                    />
                                )


                            })

                    }
                    {

                    }
                </div>
            </div>
        </>
    )
}

export default ChatList