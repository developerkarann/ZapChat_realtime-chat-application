
import { createContext, useMemo, useContext } from 'react';
import io from 'socket.io-client'
import { server } from './constants/config';

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext)

const SocketProvider = ({ Children }) => {
    const socket = useMemo(() =>
        io(server, { withCredentials: true, }),
        [])
    //  console.log(socket)
    return (
        <SocketContext.Provider value={socket} >
            {Children}
        </SocketContext.Provider>
    )
}


export { SocketProvider , getSocket }